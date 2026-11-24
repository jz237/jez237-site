#!/usr/bin/env python3
"""Wait for the exact uploaded artifact to appear in Pages' discovery API.

Read-only and bounded: never upload, delete, retry, or create a deployment.

GitHub's artifact listing is eventually consistent: one read can show a fresh
upload and the next, a second later, can miss it. The deploy action looks the
artifact up by name and fails outright on such a miss, so a single sighting is
not enough. Require several consecutive sightings, confirming with the same
name-filtered query the deploy action uses.
"""
import json
import os
import re
import subprocess
import time


def artifact_visible(payload, run_id, attempt, artifact_id, sha):
    if not isinstance(payload, dict) or not isinstance(payload.get('artifacts'), list):
        raise ValueError('Invalid artifact-list response; publication stopped')
    rows = payload['artifacts']
    total = payload.get('total_count')
    if type(total) is not int or not 0 <= total <= 100 or len(rows) > 100:
        raise ValueError('Invalid or paginated artifact list; publication stopped')
    if any(not isinstance(row, dict) for row in rows):
        raise ValueError('Invalid artifact entry; publication stopped')
    name = f'github-pages-{run_id}-{attempt}'
    matches = [row for row in rows if row.get('name') == name or row.get('id') == artifact_id]
    if not matches:
        return False
    if len(matches) != 1:
        raise ValueError('Ambiguous artifact identity; publication stopped')
    row = matches[0]
    owner = row.get('workflow_run')
    if (row.get('name') != name or row.get('id') != artifact_id
            or not isinstance(owner, dict) or owner.get('id') != run_id
            or owner.get('head_sha') != sha):
        raise ValueError('Uploaded artifact identity does not match this run; publication stopped')
    if row.get('expired') is not False or type(row.get('size_in_bytes')) is not int or row['size_in_bytes'] <= 0:
        raise ValueError('Uploaded artifact is expired, empty, or incomplete; publication stopped')
    # GitHub's count and rows can become visible at different times just after
    # upload. An inconsistent snapshot is NOT readiness, but may settle within
    # the existing deadline. Validate any matching identity above first so a
    # count mismatch cannot hide a wrong, ambiguous, expired or empty artifact.
    return total == len(rows)


def read_artifacts(endpoint, timeout):
    result = subprocess.run(['gh', 'api', '--method', 'GET', '-H', 'Cache-Control: no-cache', endpoint],
                            capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        # Do not print upstream responses or credential-bearing diagnostics.
        raise ValueError('Cannot read uploaded artifacts; publication stopped')
    return json.loads(result.stdout)


def wait_for_artifact(repository, run_id, attempt, artifact_id, sha, *, reader=read_artifacts,
                      now=time.monotonic, pause=time.sleep, timeout=120, log=print, stable=1):
    if (repository != 'jz237/jez237-site' or not re.fullmatch(r'[0-9a-f]{40}', sha)
            or any(type(value) is not int or value <= 0 for value in [run_id, attempt, artifact_id])
            or not 0 < timeout <= 120 or type(stable) is not int or not 1 <= stable <= 5):
        raise ValueError('Invalid artifact readiness inputs; publication stopped')
    endpoint = f'repos/{repository}/actions/runs/{run_id}/artifacts?per_page=100'
    # After the first sighting, confirm with the deploy action's own lookup.
    by_name = f'{endpoint}&name=github-pages-{run_id}-{attempt}'
    deadline = now() + timeout
    checks = 0
    sightings = 0
    while now() < deadline:
        payload = reader(by_name if sightings else endpoint, min(20, deadline - now()))
        checks += 1
        if now() >= deadline:
            break
        if artifact_visible(payload, run_id, attempt, artifact_id, sha):
            sightings += 1
            if sightings >= stable:
                log(f'Exact Pages artifact {artifact_id} is visible for run {run_id}, attempt {attempt}.')
                return checks
            log(f'Uploaded artifact seen {sightings} of {stable} consecutive times (check {checks}); confirming.')
        else:
            # A miss after a sighting is exactly the flicker that breaks the deploy action: start over.
            sightings = 0
            log(f'Uploaded artifact is absent or its listing has not settled (check {checks}); waiting before deployment.')
        pause(min(5, max(0, deadline - now())))
    raise ValueError('Uploaded artifact did not become visible within the readiness deadline; no deployment submitted')


def main():
    try:
        wait_for_artifact(os.environ['GITHUB_REPOSITORY'], int(os.environ['GITHUB_RUN_ID']),
                          int(os.environ['GITHUB_RUN_ATTEMPT']), int(os.environ['PAGES_ARTIFACT_ID']),
                          os.environ['GITHUB_SHA'], stable=3)
    except (ValueError, KeyError, OSError, subprocess.TimeoutExpired) as error:
        # Errors here occur before the deploy action, so its recovery path must not run.
        raise SystemExit(str(error)) from None


if __name__ == '__main__':
    main()
