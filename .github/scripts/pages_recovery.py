#!/usr/bin/env python3
"""Bounded GitHub Pages recovery; never submit a second active deployment."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess

PAGE_URL = 'https://jz237.github.io/jez237-site/'


def decision(payload):
    if not isinstance(payload, dict):
        raise ValueError('Invalid Pages status response; refusing to retry')
    status = payload.get('status')
    if status == 'succeed':
        return 'success'
    if status == 'deployment_cancelled':
        return 'retry'
    # Do not guess about active, unknown, invalid-artifact, or permission failures.
    raise ValueError(f'Pages deployment status is {status!r}; refusing a duplicate or unclassified retry')


def final_success(first, recovery, retry):
    return ((first == 'success' and recovery in {'', 'skipped'} and retry in {'', 'skipped'})
            or (first == 'failure' and recovery == 'success' and retry in {'', 'skipped'})
            or (first == 'failure' and recovery == 'retry' and retry == 'success'))


def inspect(repository, sha):
    if repository != 'jz237/jez237-site' or not re.fullmatch(r'[0-9a-f]{40}', sha):
        raise ValueError('Unexpected repository or commit')
    result = subprocess.run(['gh', 'api', f'repos/{repository}/pages/deployments/{sha}'],
                            capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise ValueError('Cannot verify previous deployment status; refusing to submit another')
    return decision(json.loads(result.stdout))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['inspect', 'finish'])
    args = parser.parse_args()
    try:
        if args.action == 'inspect':
            value = inspect(os.environ['GITHUB_REPOSITORY'], os.environ['GITHUB_SHA'])
            with Path(os.environ['GITHUB_OUTPUT']).open('a') as output:
                output.write(f'decision={value}\n')
            print('Previous deployment succeeded; no retry.' if value == 'success'
                  else 'Previous deployment cancellation confirmed. One recovery attempt is allowed.')
        else:
            first = os.environ.get('FIRST_OUTCOME', '')
            recovery = os.environ.get('RECOVERY_DECISION', '')
            retry = os.environ.get('RETRY_OUTCOME', '')
            if not final_success(first, recovery, retry):
                raise ValueError('Pages deployment did not succeed; recovery is exhausted or blocked')
            with Path(os.environ['GITHUB_OUTPUT']).open('a') as output:
                output.write(f'page_url={PAGE_URL}\n')
            if first == 'failure':
                with Path(os.environ['GITHUB_STEP_SUMMARY']).open('a') as summary:
                    summary.write('### GitHub Pages recovery\n'
                                  'The initial deploy action failed. Backend reconciliation and the '
                                  'bounded recovery path confirmed a successful deployment. '
                                  'See the initial attempt logs for the original failure.\n')
            print('GitHub Pages deployment success confirmed.')
    except (ValueError, OSError, KeyError, subprocess.TimeoutExpired) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
