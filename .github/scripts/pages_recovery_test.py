import json
import os
import re
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from pages_recovery import decision, final_success, inspect


class PagesRecoveryTests(unittest.TestCase):
    def test_workflow_respects_upstream_timeout_cap(self):
        workflow = Path(__file__).parents[1] / 'workflows/pages.yml'
        text = workflow.read_text()
        limits = [int(v) for v in re.findall(r'^          timeout: (\d+)$', text, re.M)]
        self.assertEqual(len(limits), 2)
        self.assertTrue(all(0 < value <= 600000 for value in limits))
        job_minutes = int(re.search(r'timeout-minutes: (\d+)', text).group(1))
        self.assertGreaterEqual(job_minutes * 60000, sum(limits) + 300000)

    def test_cancelled_allows_one_retry(self):
        self.assertEqual(decision({'status': 'deployment_cancelled'}), 'retry')

    def test_late_success_does_not_redeploy(self):
        self.assertEqual(decision({'status': 'succeed'}), 'success')
        self.assertTrue(final_success('failure', 'success', 'skipped'))

    def test_unknown_and_active_statuses_fail_closed(self):
        for status in ['deployment_queued', 'deployment_in_progress', 'syncing_files',
                       'deployment_failed', 'unknown', '', None]:
            with self.subTest(status=status), self.assertRaises(ValueError):
                decision({'status': status})
        for value in [None, [], 'succeed']:
            with self.assertRaises(ValueError):
                decision(value)

    def test_failed_status_lookup_never_retries(self):
        with patch('pages_recovery.subprocess.run', return_value=subprocess.CompletedProcess([], 1, '', '404')):
            with self.assertRaisesRegex(ValueError, 'Cannot verify'):
                inspect('jz237/jez237-site', 'a' * 40)

    def test_valid_status_lookup_is_scoped_to_commit(self):
        with patch('pages_recovery.subprocess.run', return_value=subprocess.CompletedProcess([], 0,
                   json.dumps({'status': 'deployment_cancelled'}), '')) as run:
            self.assertEqual(inspect('jz237/jez237-site', 'a' * 40), 'retry')
            self.assertEqual(run.call_args.args[0], ['gh', 'api',
                'repos/jz237/jez237-site/pages/deployments/' + 'a' * 40])
        with self.assertRaises(ValueError):
            inspect('other/repo', 'a' * 40)

    def test_final_gate_does_not_mask_failures_or_cancellations(self):
        self.assertTrue(final_success('success', '', 'skipped'))
        self.assertTrue(final_success('failure', 'retry', 'success'))
        for first, recovery, retry in [('failure', 'retry', 'failure'),
            ('failure', 'retry', 'cancelled'), ('failure', '', 'skipped'),
            ('skipped', '', 'skipped'), ('cancelled', 'retry', 'success'),
            ('failure', '', 'success')]:
            self.assertFalse(final_success(first, recovery, retry))

    def test_finish_cli_outputs_success_and_keeps_recovery_record(self):
        with tempfile.TemporaryDirectory() as tmp:
            output, summary = Path(tmp) / 'output', Path(tmp) / 'summary'
            env = dict(os.environ, FIRST_OUTCOME='failure', RECOVERY_DECISION='retry',
                       RETRY_OUTCOME='success', GITHUB_OUTPUT=str(output), GITHUB_STEP_SUMMARY=str(summary))
            helper = Path(__file__).with_name('pages_recovery.py')
            result = subprocess.run(['python3', str(helper), 'finish'], env=env, capture_output=True)
            self.assertEqual(result.returncode, 0)
            self.assertIn('page_url=https://jz237.github.io/jez237-site/', output.read_text())
            self.assertIn('initial deploy action failed', summary.read_text())
            env['RETRY_OUTCOME'] = 'failure'
            result = subprocess.run(['python3', str(helper), 'finish'], env=env, capture_output=True)
            self.assertEqual(result.returncode, 1)


if __name__ == '__main__':
    unittest.main()
