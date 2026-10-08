/** Persistent identities are independent of scenery, physics and browser APIs. */
export const COURSE_NAMES={
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
