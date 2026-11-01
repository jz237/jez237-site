#!/usr/bin/env python3
"""Editorial structure, source-budget and safe-rendering regression checks."""
from collections import defaultdict
from copy import deepcopy
import json
from pathlib import Path
import unittest
from aquarium_editorial import render, validate, word_count

STORIES=json.loads((Path(__file__).resolve().parents[1]/'newsletter/stories.json').read_text())

class EditorialTests(unittest.TestCase):
    def test_complete_varied_articles(self):
        self.assertEqual(len(STORIES),12)
        structures={tuple(b['type'] for b in s['blocks']) for s in STORIES}
        self.assertGreaterEqual(len(structures),4)
        lengths=[word_count(s) for s in STORIES]
        self.assertTrue(all(250<=n<=650 for n in lengths),lengths)
        self.assertGreaterEqual(max(lengths)-min(lengths),150)
        self.assertTrue(any(b['type']=='list' for s in STORIES for b in s['blocks']))
        for s in STORIES:
            validate(s)
            self.assertGreaterEqual(len(s['references']),2)
            self.assertNotIn('verification_notes',s)

    def test_source_budgets_across_edition(self):
        budgets=defaultdict(int)
        for s in STORIES:
            refs={r['id']:r['url'] for r in s['references']}
            for block in s['blocks']:
                for rid in block.get('refs',[]):
                    budgets[refs[rid]]+=word_count({'blocks':[block]})
        # Conservatively charge the full multi-source block to each reference.
        self.assertTrue(all(n<=200 for n in budgets.values()),dict(budgets))

    def test_quiet_endnotes_and_fallback(self):
        for s in STORIES:
            modal=render(s,reader=True);standalone=render(s)
            self.assertNotIn('Optional further reading',modal)
            self.assertNotIn('What this means for your aquarium',modal)
            self.assertNotIn('read the full',modal.lower())
            self.assertIn('data-reference="reader-',modal)
            self.assertIn(f'id="reader-{s["slug"]}-sources"><summary>',modal)
            self.assertIn(f'id="article-{s["slug"]}-sources" open><summary>',standalone)

    def test_text_is_escaped(self):
        sample=deepcopy(STORIES[0])
        sample['blocks'][0]['text']='<script>alert("untrusted")</script>'
        html=render(sample)
        self.assertNotIn('<script>',html)
        self.assertIn('&lt;script&gt;',html)

    def test_invalid_references_fail_closed(self):
        sample=deepcopy(STORIES[0]);sample['references'][0]['url']='javascript:alert(1)'
        with self.assertRaises(AssertionError):validate(sample)
        sample=deepcopy(STORIES[0]);sample['blocks'][0]['refs']=['missing']
        with self.assertRaises(AssertionError):validate(sample)

if __name__=='__main__':
    unittest.main(verbosity=2)
