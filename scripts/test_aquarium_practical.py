#!/usr/bin/env python3
"""Acceptance checks for the expanded, practical-first preview."""
from pathlib import Path
from collections import Counter, defaultdict
import json
import unittest
import xml.etree.ElementTree as ET
from aquarium_editorial import word_count, background_date, plain_date, related_stories, TAGS, tags_markup, showroom_markup, validate, KINDS, FACT_LABELS, facts_markup
from copy import deepcopy
import re
from aquarium_home import checklist_markup

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'newsletter'
STORIES=json.loads((OUT/'stories.json').read_text())
CHECK=json.loads((OUT/'checklist.json').read_text())
DRAWINGS=json.loads((OUT/'illustrations.json').read_text())
EXPANSION={'clean-filter-media-without-replacing-the-biofilter','read-and-record-aquarium-water-tests','trim-stem-plants-and-replant-cuttings','top-off-with-freshwater-change-with-saltwater','match-coral-placement-to-local-flow','choose-marine-fish-for-adult-life'}
ORIGINAL={'a-new-home-for-coral','a-greener-kind-of-aquarium','how-fish-find-their-crowd','behind-captive-bred-fish','little-cups-big-potential','when-coral-spawns'}

NS={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
def edition_pages():
    pages=[OUT/'index.html'];n=2
    while (OUT/'page'/str(n)/'index.html').is_file():
        pages.append(OUT/'page'/str(n)/'index.html');n+=1
    return pages

class PracticalTests(unittest.TestCase):
    def test_six_new_complete_articles_and_balance(self):
        # Daily stories may be added; the pilot's twelve (six of each) stay as a minimum.
        self.assertGreaterEqual(len(STORIES),12)
        counts=Counter(s['category'] for s in STORIES)
        self.assertEqual(set(counts),{'freshwater','reef'})
        self.assertTrue(counts['freshwater']>=6 and counts['reef']>=6,counts)
        slugs={s['slug'] for s in STORIES}
        self.assertTrue(ORIGINAL<=slugs and EXPANSION<=slugs)
        new=[s for s in STORIES if s['slug'] in EXPANSION]
        self.assertEqual(len(new),6)
        for s in STORIES:
            self.assertNotIn('?',s['title'])
            self.assertNotIn('verification_notes',s)
        for s in new:
            self.assertGreaterEqual(word_count(s),250)
            self.assertGreaterEqual(len(s['references']),3)
            self.assertNotIn('?',s['title'])
            self.assertEqual(s['kind'],'Practical guide')
            self.assertNotIn('verification_notes',s)

    def test_news_first_lead_and_simple_labels(self):
        self.assertLessEqual({s['kind'] for s in STORIES},KINDS)
        self.assertLessEqual({'Practical guide','Research','Conservation news','Species profile'},{s['kind'] for s in STORIES})
        # News first: research and conservation stories make up a real share, and news leads the edition's top three.
        news=[s for s in STORIES if s['kind'] in {'Research','Conservation news'}]
        self.assertGreaterEqual(len(news),len(STORIES)//3)
        self.assertTrue(any(s['kind'] in {'Research','Conservation news'} for s in STORIES[:3]))
        html=(OUT/'index.html').read_text()
        label={'Practical guide':'Read the practical guide','Species profile':'Read the profile'}.get(STORIES[0]['kind'],'Read the story')
        self.assertIn(f'href="stories/{STORIES[0]["slug"]}/">{label}',html)
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
        self.assertGreaterEqual(len(DRAWINGS),3)
        for d in DRAWINGS:
            svg=ET.parse(OUT/'images'/d['filename']).getroot()
            self.assertEqual(svg.attrib['viewBox'],f'0 0 {d["width"]} {d["height"]}')
            self.assertTrue(d['alt'])
            self.assertIsNotNone(svg.find('{http://www.w3.org/2000/svg}title'))
            self.assertNotIn('<script',(OUT/'images'/d['filename']).read_text())
        self.assertGreaterEqual(sum(bool(s.get('diagram')) for s in STORIES),1)
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

    def test_topic_tags(self):
        for s in STORIES:
            self.assertTrue(s['tags'] and len(s['tags'])==len(set(s['tags'])),s['slug'])
            self.assertLessEqual(set(s['tags']),set(TAGS),s['slug'])
        used=Counter(t for s in STORIES for t in s['tags'])
        self.assertEqual(set(used),set(TAGS),used)  # every topic has at least one story
        self.assertGreater(sum(len(s['tags'])>1 for s in STORIES),0)
        bad=deepcopy(STORIES[0]);bad['tags']=['Snails']
        with self.assertRaises(AssertionError):validate(bad)
        bad=deepcopy(STORIES[0]);bad['tags']=[]
        with self.assertRaises(AssertionError):validate(bad)
        html=(OUT/'index.html').read_text()
        for name,key in TAGS.items():
            self.assertIn(f'data-tag-filter="{key}"',html)
        for s in STORIES:
            self.assertIn(f'data-tags="{" ".join(TAGS[t] for t in s["tags"])}"',html)
            page=(OUT/'stories'/s['slug']/'index.html').read_text()
            self.assertIn(tags_markup(s),page)

    def test_showroom_links_are_occasional_quiet_lines(self):
        rooms=[s for s in STORIES if s.get('showroom')]
        self.assertGreaterEqual(len(rooms),1)
        self.assertLessEqual(len(rooms),max(3,len(STORIES)//4))  # occasional, never most stories
        for s in rooms:
            line=showroom_markup(s)
            self.assertTrue(line.startswith('<p class="showroom-line">') and line.count('<a ')==1)
            self.assertIn('href="https://thehiddenreef.net/showroom/',line)
            page=(OUT/'stories'/s['slug']/'index.html').read_text()
            self.assertIn(line,page)
            self.assertIn(line,(OUT/'index.html').read_text())
        bad=deepcopy(rooms[0]);bad['showroom']['path']='/showroom/not-a-room/'
        with self.assertRaises(AssertionError):validate(bad)
        bad=deepcopy(rooms[0]);bad['showroom']['path']='https://example.com/showroom/biowheel/'
        with self.assertRaises(AssertionError):validate(bad)
        for s in STORIES:
            if not s.get('showroom'):
                self.assertNotIn('showroom-line',(OUT/'stories'/s['slug']/'index.html').read_text())

    def test_share_link_markup(self):
        for s in STORIES:
            page=(OUT/'stories'/s['slug']/'index.html').read_text()
            url=f'https://jez237.com/newsletter/stories/{s["slug"]}/'
            self.assertEqual(page.count(f'data-copy-link="{url}"'),1)
            self.assertIn(f'<a class="share-url" href="{url}">',page)
        html=(OUT/'index.html').read_text()
        self.assertEqual(html.count('data-copy-link='),len(STORIES))
        for bad in ['addthis','sharethis','facebook.com/sharer','twitter.com/intent','platform.twitter','connect.facebook']:
            self.assertNotIn(bad,html.lower())

    def test_structured_data_and_social_tags(self):
        def blocks(html):
            found=re.findall(r'<script type="application/ld\+json">(.*?)</script>',html,re.S)
            return [json.loads(b) for b in found]
        for s in STORIES:
            html=(OUT/'stories'/s['slug']/'index.html').read_text()
            data=blocks(html);self.assertEqual(len(data),1,s['slug']);d=data[0]
            url=f'https://jez237.com/newsletter/stories/{s["slug"]}/'
            self.assertEqual(d['@context'],'https://schema.org')
            self.assertIn(d['@type'],{'Article','NewsArticle'})
            self.assertEqual(d['headline'],s['title']);self.assertLessEqual(len(d['headline']),110)
            self.assertEqual(d['datePublished'],s['published'])
            self.assertEqual(d['dateModified'],s.get('modified',s['published']))
            self.assertEqual(d['url'],url)
            self.assertTrue(d['image'] and all(i.startswith('https://jez237.com/newsletter/images/') for i in d['image']))
            for i in d['image']:
                self.assertTrue((OUT/'images'/i.rsplit('/',1)[1]).is_file())
            self.assertEqual(d['author']['name'],'Jez237')
            self.assertEqual(d['publisher']['@type'],'Organization');self.assertEqual(d['publisher']['name'],'Jez237')
            self.assertTrue(d['publisher']['logo']['url'].startswith('https://'))
            self.assertIn(f'<link rel="canonical" href="{url}">',html)
            self.assertIn('<meta name="twitter:card" content="summary_large_image">',html)
            og=re.search(r'<meta property="og:image" content="([^"]+)">',html).group(1)
            self.assertTrue(og.startswith('https://jez237.com/newsletter/images/') and not og.endswith('.svg'))
            self.assertTrue((OUT/'images'/og.rsplit('/',1)[1]).is_file())
            self.assertIn('<meta property="og:type" content="article">',html)
            self.assertNotIn('noindex',html)
        listed=[]
        for n,f in enumerate(edition_pages(),1):
            html=f.read_text();data=blocks(html);self.assertEqual(len(data),1);d=data[0]
            self.assertEqual(d['@type'],'CollectionPage');self.assertEqual(d['mainEntity']['@type'],'ItemList')
            self.assertEqual(d['url'],'https://jez237.com/newsletter/'+('' if n==1 else f'page/{n}/'))
            listed+=d['mainEntity']['itemListElement']
            self.assertIn('<meta name="twitter:card" content="summary_large_image">',html)
        self.assertEqual([i['url'] for i in listed],[f'https://jez237.com/newsletter/stories/{s["slug"]}/' for s in STORIES])
        self.assertEqual([i['position'] for i in listed],list(range(1,len(STORIES)+1)))

    def test_sitemap_lastmod_current(self):
        root=ET.parse(ROOT/'sitemap.xml').getroot();ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
        mods={u.find('s:loc',ns).text:u.find('s:lastmod',ns).text for u in root.findall('s:url',ns)}
        newest=max(s.get('modified',s['published']) for s in STORIES)
        self.assertEqual(mods['https://jez237.com/newsletter/'],newest)
        for s in STORIES:
            self.assertEqual(mods[f'https://jez237.com/newsletter/stories/{s["slug"]}/'],s.get('modified',s['published']))

    def test_species_profiles_have_sourced_facts(self):
        profiles=[s for s in STORIES if s['format']=='profile']
        self.assertGreaterEqual(len(profiles),1)
        for s in profiles:
            self.assertEqual(s['kind'],'Species profile')
            self.assertEqual([f['label'] for f in s['facts']],FACT_LABELS)
            ids={r['id'] for r in s['references']}
            for f in s['facts']:
                self.assertTrue(f['refs'] and set(f['refs'])<=ids,(s['slug'],f['label']))
            page=(OUT/'stories'/s['slug']/'index.html').read_text()
            self.assertIn('<p class="glance-title">At a glance</p>',page)
            for f in s['facts']:self.assertIn(f'<dt>{f["label"]}</dt><dd><strong>',page)
            self.assertIn(facts_markup(s,reader=True),(OUT/'index.html').read_text())
        bad=deepcopy(profiles[0]);bad['facts'][1]['value']='24–30°C'
        with self.assertRaises(AssertionError):validate(bad)
        bad=deepcopy(profiles[0]);bad['facts'][0]['refs']=[]
        with self.assertRaises(AssertionError):validate(bad)
        for s in STORIES:
            if s['format']!='profile':self.assertNotIn('glance-box',(OUT/'stories'/s['slug']/'index.html').read_text())

    def test_every_story_has_its_own_image(self):
        # Each story's image must show its subject, and no image may be used on more than one story.
        uses=Counter([s['image'] for s in STORIES]+[s['diagram'] for s in STORIES if s.get('diagram')])
        self.assertEqual({k:v for k,v in uses.items() if v>1},{})
        self.assertEqual(len({s['image'] for s in STORIES}),len(STORIES))
        photos=json.loads((OUT/'photo-credits.json').read_text())
        credited={p['filename'] for p in photos}
        for s in STORIES:
            self.assertTrue(s['image'] in credited or s['image'].endswith('.svg'),s['slug'])
            self.assertTrue(s['caption'],s['slug'])
        # No orphan credit records: every credited photo appears in a story or on the homepage.
        home=(OUT/'index.html').read_text()
        for name in credited:
            self.assertTrue(name in uses or f'images/{name}' in home,name)
        cards=[]
        for f in edition_pages():
            html=f.read_text();grid=html[html.index('<div id="story-grid"'):html.index('id="filter-pager"')]
            cards+=re.findall(r'<article class="story[^>]*>.*?<img src="(?:\./|\.\./\.\./)images/([^"]+)"',grid,re.S)
        self.assertEqual(len(cards),len(STORIES));self.assertEqual(len(set(cards)),len(STORIES))

    def test_pagination(self):
        pages=edition_pages();per=10
        self.assertEqual(len(pages),-(-len(STORIES)//per))
        seen=[]
        for n,f in enumerate(pages,1):
            html=f.read_text()
            grid=html[html.index('<div id="story-grid"'):html.index('id="filter-pager"')]
            slugs=re.findall(r'<h3><a href="(?:\./|\.\./\.\./)stories/([a-z0-9-]+)/">',grid)
            self.assertLessEqual(len(slugs),per,f)            # never more than 10 cards on a page
            self.assertEqual(slugs,[s['slug'] for s in STORIES[(n-1)*per:n*per]],f)  # newest first
            seen+=slugs
            canon='https://jez237.com/newsletter/'+('' if n==1 else f'page/{n}/')
            self.assertIn(f'<link rel="canonical" href="{canon}">',html)
            if n>1:
                self.assertIn(f'<title>Aquarium News, page {n}</title>',html)
                self.assertNotIn('class="cover',html);self.assertNotIn('id="daily-check"',html)
            # Every pagination link resolves to a generated page.
            pager=re.search(r'id="static-pager".*?</nav>',html,re.S).group(0)
            for href in re.findall(r'href="([^"]+)"',pager):
                target=(f.parent/href/'index.html').resolve()
                self.assertTrue(target.is_file(),(f,href))
            # All stories reachable from any page for filters and the reader.
            self.assertEqual(html.count('data-card-template='),len(STORIES))
            self.assertEqual(html.count('data-reader-template='),len(STORIES))
        self.assertEqual(sorted(seen),sorted(s['slug'] for s in STORIES))  # each story on exactly one page
        self.assertEqual(len(seen),len(set(seen)))
        home=(OUT/'index.html').read_text()
        self.assertIn('class="cover',home);self.assertIn('id="daily-check"',home)
        mods={u.find('s:loc',NS).text for u in ET.parse(ROOT/'sitemap.xml').getroot().findall('s:url',NS)}
        for n in range(2,len(pages)+1):self.assertIn(f'https://jez237.com/newsletter/page/{n}/',mods)
        self.assertFalse((OUT/'page'/str(len(pages)+1)).exists())

    def test_freshwater_balance(self):
        fresh=[s for s in STORIES if s['category']=='freshwater']
        plants=[s for s in fresh if s['tags']==['Plants'] or s['tags'][0]=='Plants']
        self.assertLessEqual(len(plants),len(fresh)*0.4,[s['slug'] for s in plants])
        for tag in ['Fish','Shrimp & snails','Ponds']:
            self.assertTrue(any(tag in s['tags'] for s in fresh),tag)

if __name__=='__main__':
    unittest.main(verbosity=2)
