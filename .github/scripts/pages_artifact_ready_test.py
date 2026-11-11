import copy
import json
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

from pages_artifact_ready import artifact_visible, read_artifacts, wait_for_artifact


REPO, RUN, ATTEMPT, ARTIFACT, SHA = 'jz237/jez237-site', 123, 2, 456, 'a' * 40


def visible():
    return {'total_count': 1, 'artifacts': [{
        'id': ARTIFACT, 'name': f'github-pages-{RUN}-{ATTEMPT}', 'expired': False,
        'size_in_bytes': 800, 'workflow_run': {'id': RUN, 'head_sha': SHA},
    }]}


class Clock:
    elapsed = 0

    def now(self):
        return self.elapsed

    def pause(self, seconds):
        self.elapsed += seconds


class ArtifactReadinessTests(unittest.TestCase):
    def test_uploaded_but_temporarily_absent_then_visible(self):
        clock = Clock()
        replies = iter([{'total_count': 0, 'artifacts': []}] * 2 + [visible()])
        calls = []

        def reader(endpoint, timeout):
            calls.append((endpoint, timeout))
            return next(replies)

        checks = wait_for_artifact(REPO, RUN, ATTEMPT, ARTIFACT, SHA,
                                  reader=reader, now=clock.now, pause=clock.pause, log=lambda _: None)
        self.assertEqual(checks, 3)
        self.assertEqual(clock.elapsed, 10)
        self.assertTrue(all(endpoint.endswith('/runs/123/artifacts?per_page=100') for endpoint, _ in calls))

    def test_existing_exact_artifact_does_not_wait_or_deploy(self):
        with patch('pages_artifact_ready.subprocess.run') as process:
            self.assertEqual(wait_for_artifact(REPO, RUN, ATTEMPT, ARTIFACT, SHA,
                reader=lambda *_: visible(), pause=lambda _: self.fail('unnecessary wait'), log=lambda _: None), 1)
            process.assert_not_called()

    def test_missing_artifact_stops_at_deadline(self):
        clock = Clock()
        calls = []

        def reader(*args):
            calls.append(args)
            return {'total_count': 0, 'artifacts': []}

        with self.assertRaisesRegex(ValueError, 'no deployment submitted'):
            wait_for_artifact(REPO, RUN, ATTEMPT, ARTIFACT, SHA, reader=reader,
                              now=clock.now, pause=clock.pause, timeout=12, log=lambda _: None)
        self.assertEqual(clock.elapsed, 12)
        self.assertEqual(len(calls), 3)
        self.assertLessEqual(calls[-1][1], 2)

    def test_response_arriving_after_deadline_is_not_accepted(self):
        clock = Clock()

        def reader(*_):
            clock.pause(121)
            return visible()

        with self.assertRaisesRegex(ValueError, 'deadline'):
            wait_for_artifact(REPO, RUN, ATTEMPT, ARTIFACT, SHA,
                              reader=reader, now=clock.now, pause=clock.pause)

    def test_previous_attempt_is_not_this_attempt(self):
        payload = visible()
        payload['artifacts'][0].update(id=455, name='github-pages-123-1')
        self.assertFalse(artifact_visible(payload, RUN, ATTEMPT, ARTIFACT, SHA))

    def test_identity_mismatch_expired_empty_and_ambiguous_fail_closed(self):
        mutations = [
            {'id': 999}, {'name': 'github-pages-123-1'},
            {'workflow_run': {'id': 999, 'head_sha': SHA}},
            {'workflow_run': {'id': RUN, 'head_sha': 'b' * 40}},
            {'workflow_run': None}, {'expired': True}, {'expired': None},
            {'size_in_bytes': 0}, {'size_in_bytes': '800'},
        ]
        for mutation in mutations:
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                payload = visible()
                payload['artifacts'][0].update(mutation)
                artifact_visible(payload, RUN, ATTEMPT, ARTIFACT, SHA)
        payload = visible()
        payload['artifacts'].append(copy.deepcopy(payload['artifacts'][0]))
        payload['total_count'] = 2
        with self.assertRaisesRegex(ValueError, 'Ambiguous'):
            artifact_visible(payload, RUN, ATTEMPT, ARTIFACT, SHA)

    def test_incomplete_or_malformed_api_data_is_not_readiness(self):
        for payload in [None, [], {}, {'total_count': 1, 'artifacts': []},
                        {'total_count': 101, 'artifacts': []}, {'total_count': 1, 'artifacts': [None]}]:
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                artifact_visible(payload, RUN, ATTEMPT, ARTIFACT, SHA)

    def test_auth_or_transport_failure_never_permits_deployment(self):
        for error in [ValueError('permission denied'), subprocess.TimeoutExpired('gh', 20)]:
            with self.subTest(error=error), self.assertRaises(type(error)):
                def reader(*_):
                    raise error
                wait_for_artifact(REPO, RUN, ATTEMPT, ARTIFACT, SHA, reader=reader)

    def test_api_is_read_only_bounded_and_errors_are_sanitized(self):
        with patch('pages_artifact_ready.subprocess.run', return_value=subprocess.CompletedProcess(
                [], 0, json.dumps(visible()), '')) as run:
            self.assertEqual(read_artifacts('repos/test/actions/runs/123/artifacts', 7), visible())
            self.assertEqual(run.call_args.args[0][0:4], ['gh', 'api', '--method', 'GET'])
            self.assertEqual(run.call_args.kwargs['timeout'], 7)
        with patch('pages_artifact_ready.subprocess.run', return_value=subprocess.CompletedProcess(
                [], 1, 'private response', 'private details')):
            with self.assertRaisesRegex(ValueError, '^Cannot read uploaded artifacts; publication stopped$'):
                read_artifacts('repos/test/actions/runs/123/artifacts', 7)

    def test_missing_upload_id_or_other_repo_stops_before_api(self):
        for args in [('other/repo', RUN, ATTEMPT, ARTIFACT, SHA),
                     (REPO, RUN, ATTEMPT, 0, SHA), (REPO, RUN, 0, ARTIFACT, SHA),
                     (REPO, RUN, ATTEMPT, ARTIFACT, 'not-a-sha')]:
            with self.subTest(args=args), self.assertRaises(ValueError):
                wait_for_artifact(*args, reader=lambda *_: self.fail('API called'))

    def test_workflow_gate_precedes_deploy_and_is_in_sparse_checkout(self):
        workflow = (Path(__file__).parents[1] / 'workflows/pages.yml').read_text()
        self.assertLess(workflow.index('id: upload'), workflow.index('name: Wait for the exact'))
        self.assertLess(workflow.index('name: Wait for the exact'), workflow.index('name: Deploy to GitHub Pages'))
        self.assertIn('PAGES_ARTIFACT_ID: ${{ steps.upload.outputs.artifact_id }}', workflow)
        self.assertIn('/.github/scripts/pages_artifact_ready.py', workflow)
        self.assertIn('/.github/scripts/pages_artifact_ready_test.py', workflow)
        gate = workflow.split('name: Wait for the exact')[1].split('      - name:')[0]
        self.assertNotIn('continue-on-error', gate)
        self.assertNotIn('if:', gate)


if __name__ == '__main__':
    unittest.main()
