#!/usr/bin/env python3
"""Acceptance checks for the expanded, practical-first preview."""
from pathlib import Path
from collections import Counter, defaultdict
import json
import unittest
import xml.etree.ElementTree as ET
from aquarium_editorial import word_count, background_date, plain_date, related_stories
from aquarium_home import checklist_markup

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'newsletter'
STORIES=json.loads((OUT/'stories.json').read_text())
CHECK=json.loads((OUT/'checklist.json').read_text())
DRAWINGS=json.loads((OUT/'illustrations.json').read_text())
ORIGINAL={'a-new-home-for-coral','a-greener-kind-of-aquarium','how-fish-find-their-crowd','behind-captive-bred-fish','little-cups-big-potential','when-coral-spawns'}

class PracticalTests(unittest.TestCase):
    def test_six_new_complete_articles_and_balance(self):
        self.assertEqual(len(STORIES),12)
        self.assertEqual(Counter(s['category'] for s in STORIES),{'freshwater':6,'reef':6})
        new=[s for s in STORIES if s['slug'] not in ORIGINAL]
        self.assertEqual(len(new),6)
        for s in new:
            self.assertGreaterEqual(word_count(s),250)
            self.assertGreaterEqual(len(s['references']),3)
            self.assertNotIn('?',s['title'])
            self.assertEqual(s['kind'],'Practical guide')
            self.assertNotIn('verification_notes',s)

    def test_practical_lead_and_simple_labels(self):
        self.assertEqual(STORIES[0]['kind'],'Practical guide')
        self.assertEqual({s['kind'] for s in STORIES},{'Practical guide','Research','Conservation news'})
        html=(OUT/'index.html').read_text()
        self.assertIn(f'href="stories/{STORIES[0]["slug"]}/">Read the practical guide',html)
        self.assertIn('Earlier research',html)
        self.assertNotIn('Source: Evergreen guide',html)
        self.assertNotIn('class="reader-date">Background:',html)
        for s in STORIES:
            page=(OUT/'stories'/s['slug']/'index.html').read_text()
            self.assertIn(background_date(s), page)
            self.assertNotIn('no publication date shown', page)

    def test_dates_and_related_stories(self):
        html=(OUT/'index.html').read_text()
        newest=max(s['published'] for s in STORIES)
        self.assertIn(f'Updated <time datetime="{newest}">{plain_date(newest)}</time>',html)
        self.assertNotIn('Prepared November 1, 2026',html)
        for s in STORIES:
            rel=related_stories(s,STORIES)
            self.assertEqual(len(rel),min(3,len(STORIES)-1))
            self.assertNotIn(s,rel)
            same=[r for r in rel if r['category']==s['category']]
            self.assertEqual(rel[:len(same)],same)
            page=(OUT/'stories'/s['slug']/'index.html').read_text()
            self.assertIn(f'<time datetime="{s["published"]}">{plain_date(s["published"])}</time>',page)
            for r in rel:
                self.assertIn(f'<a href="../{r["slug"]}/">',page)
        # Same category fills first; the other category only fills a shortfall.
        tiny=[{'slug':'a','category':'reef'},{'slug':'b','category':'freshwater'},{'slug':'c','category':'reef'},{'slug':'d','category':'freshwater'}]
        self.assertEqual([r['slug'] for r in related_stories(tiny[0],tiny)],['c','b','d'])
        self.assertEqual(related_stories(tiny[0],tiny[:1]),[])

    def test_tissue_culture_image_and_original_diagrams(self):
        tissue=next(s for s in STORIES if s['slug']=='little-cups-big-potential')
        self.assertEqual(tissue['image'],'tissue-culture-steps.svg')
        self.assertEqual(len(DRAWINGS),3)
        for d in DRAWINGS:
            svg=ET.parse(OUT/'images'/d['filename']).getroot()
            self.assertEqual(svg.attrib['viewBox'],f'0 0 {d["width"]} {d["height"]}')
            self.assertTrue(d['alt'])
            self.assertIsNotNone(svg.find('{http://www.w3.org/2000/svg}title'))
            self.assertNotIn('<script',(OUT/'images'/d['filename']).read_text())
        self.assertEqual(sum(bool(s.get('diagram')) for s in STORIES),2)
        credits=(OUT/'credits.html').read_text()
        self.assertIn('not photographs',credits)
        self.assertIn('AI-assisted diagrams',credits)

    def test_complete_checklist_without_script_or_disclosure(self):
        html=checklist_markup(CHECK)
        visible=html.split('<details')[0]
        self.assertEqual(len(CHECK['items']),4)
        for item in CHECK['items']:
            self.assertIn(item['text'],visible)
        self.assertNotIn('<script',html)
        # Compact, plain layout: no decorative icons, eyebrow or em-dash copy.
        self.assertEqual(visible.count('<svg'),0)
        self.assertNotIn('eyebrow',visible)
        self.assertNotIn('—',visible)
        self.assertEqual(visible.count('<li>'),4)
        self.assertIn(CHECK['note'],visible)
        self.assertIn(CHECK['source_note'],html.split('<details')[1])
        self.assertIn('id="daily-check"',(OUT/'index.html').read_text())

    def test_homepage_and_article_source_budgets(self):
        budgets=defaultdict(int)
        for s in STORIES:
            refs={r['id']:r['url'] for r in s['references']}
            for b in s['blocks']:
                for rid in b.get('refs',[]):
                    budgets[refs[rid]]+=word_count({'blocks':[b]})
        refs={r['id']:r['url'] for r in CHECK['references']}
        for item in CHECK['items']:
            for rid in item['refs']:
                budgets[refs[rid]]+=word_count({'blocks':[{'type':'p','text':item['text']}]})
        self.assertTrue(all(n<=200 for n in budgets.values()),dict(budgets))

if __name__=='__main__':
    unittest.main(verbosity=2)
