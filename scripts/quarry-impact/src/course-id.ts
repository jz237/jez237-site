/** Persistent identities are independent of scenery, physics and browser APIs. */
export const COURSE_NAMES={
 'millbrook-canal-v1':'Millbrook Canal Circuit',
 'granite-pass-v1':'Granite Pass Rally',
 'kingswell-park-v1':'Kingswell Park Circuit',
 'copperfield-dunes-v1':'Copperfield Dunes Rally',
 'holloway-stadium-v1':'Holloway Stadium Circuit',
 'bramblebrook-reservoir-v1':'Bramblebrook Reservoir Rally',
 'saltmarsh-port-v1':'Saltmarsh Port Rallycross',
 'dunmere-farm-v1':'Dunmere Farm Circuit',
 'seabrook-coast-v1':'Seabrook Coast Circuit',
 'hazelwood-forest-v1':'Hazelwood Forest Rally',
 'westmere-club-v1':'Westmere Club Circuit',
 'harrowstone-ridge-v1':'Harrowstone Ridge',
 'willowbank-heath-v1':'Willowbank Heath Circuit',
 'sable-canyon-v1':'Sable Canyon Rallycross',
 'elmsworth-speedway-v1':'Elmsworth Speedway',
 'rookvale-yard-v1':'Rookvale Freight Yard',
 'fenwick-oval-v1':'Fenwick Banger Oval',
 'fenwick-eight-v1':'Fenwick Figure Eight',
 'alderwick-stunt-v1':'Alderwick Stunt Park',
 'millhaven-rally-v1':'Millhaven Rally Park',
 'merefield-airfield-v1':'Merefield Airfield',
 'dockside-loop-v1':'Dockside Loop',
 'fairground-scramble-v1':'Fairground Scramble',
 'pinecrest-ridge-v1':'Pinecrest Ridge',
 'quarry-v1':'Blackridge Quarry',
 'ironfield-figure-eight-v1':'Ironfield Raceway',
 'cinderbank-oval-v1':'Cinderbank Speedway',
 'bracken-rallycross-v1':'Bracken Rallycross',
 'ashford-autodrome-v1':'Ashford Autodrome',
 'redbank-jump-v1':'Redbank Jump Circuit',
} as const;
export type CourseId=keyof typeof COURSE_NAMES;
export const isCourseId=(value:unknown):value is CourseId=>typeof value==='string'&&Object.hasOwn(COURSE_NAMES,value);
/** Settings from earlier releases, or invalid saved choices, retain Quarry. */
export const resolveCourseId=(saved:unknown):CourseId=>isCourseId(saved)?saved:'quarry-v1';
