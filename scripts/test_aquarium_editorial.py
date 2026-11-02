#!/usr/bin/env python3
"""Editorial structure, source-budget and safe-rendering regression checks."""
from collections import defaultdict
from copy import deepcopy
import json
from pathlib import Path
import unittest
from aquarium_editorial import render, validate, word_count, FORMATS
import re

STORIES=json.loads((Path(__file__).resolve().parents[1]/'newsletter/stories.json').read_text())

class EditorialTests(unittest.TestCase):
    def test_complete_varied_articles(self):
        # Daily publishing adds stories; the twelve-story pilot is the floor.
        self.assertGreaterEqual(len(STORIES),16)
        # Shapes rotate: many distinct block structures, no two neighbours share a format.
        structures={tuple((b['type'],bool(b.get('ordered'))) for b in s['blocks']) for s in STORIES}
        self.assertGreaterEqual(len(structures),min(len(STORIES)-2,12))
        formats=[s['format'] for s in STORIES]
        self.assertGreaterEqual(len(set(formats)),7,formats)
        for a,b in zip(formats,formats[1:]):self.assertNotEqual(a,b,formats)
        # The sidebar box is the exception, not the default.
        self.assertLessEqual(sum(any(b['type']=='aside' for b in s['blocks']) for s in STORIES),len(STORIES)//4)
        for s in STORIES:
            validate(s)
            lo,hi=FORMATS[s['format']]
            self.assertTrue(lo<=word_count(s)<=hi,(s['slug'],s['format'],word_count(s)))
            self.assertGreaterEqual(len(s['references']),1 if s['format']=='brief' else 2,s['slug'])
            self.assertNotIn('verification_notes',s)
        self.assertTrue(any(b['type']=='list' and b.get('ordered') for s in STORIES for b in s['blocks']))

    def test_us_units(self):
        # Metric values appear only beside a US conversion (gallons, °F, inches, fluid ounces).
        metric=re.compile(r'\b\d[\d.,]*(?:–\d[\d.,]*)?[- ]?(?:liters?|litres?|L|°C|cm|mm|milliliters?|ml)\b')
        us=re.compile(r'gallons?|gal\b|°F|inch|\bin\b|fluid ounces?|feet')
        for s in STORIES:
            texts=[s['title'],s['dek']]+[x for b in s['blocks'] for x in ([b.get('text','')]+b.get('items',[]))]
            for text in texts:
                for sentence in re.split(r'(?<=[.!?])\s+',text):
                    if metric.search(sentence):self.assertRegex(sentence,us,(s['slug'],sentence))
                self.assertNotRegex(text,r'\d\s*°C(?![^()]*\))(?!.*°F)',s['slug'])

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
