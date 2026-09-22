import practice from "./native-courses/practice.json" with { type: "json" };
import beginner from "./native-courses/beginner.json" with { type: "json" };
import intermediate from "./native-courses/intermediate.json" with { type: "json" };
import aerial from "./native-courses/aerial.json" with { type: "json" };
import silly from "./native-courses/silly.json" with { type: "json" };
import ultimate from "./native-courses/ultimate.json" with { type: "json" };
import practiceRoutes from "./native-courses/practice-routes.json" with { type: "json" };
import { CAMPAIGN_ORDER, COURSE_TIME, amigaCourseRules } from "./rules.mjs";

const boards = [practice, beginner, intermediate, aerial, silly, ultimate];
const descriptions = [
  "Training slopes, moving steps and banked downhill bends.",
  "Split towers, black marbles, curling slinkies and three blue pipe passages.",
  "Acid patrols, split paths, an orange pipe and a traveling wave.",
  "Crossed rails, hammers, vacuums, retracting pegs and a hinged paddle.",
  "An uphill race through miniatures, the red transfer and purple birds.",
  "Divided rooms, acid patrols and disappearing finish paths.",
];
const palettes = [
  ["#be3e35", "#be3e35", "#d98a38", "#d8bd49", "#d8bd49", "#be3e35"],
  ["#235474", "#259bc9", "#38cce3", "#265478"],
  ["#166275", "#203d53", "#258d9a", "#203d53"],
  ["#be3e35", "#d8bd49", "#b64238", "#d98a38"],
  ["#928097", "#c3b7c6", "#665773", "#ded2dd"],
  ["#c6aa3c", "#766b37", "#e0cd60", "#b49d34"],
];

// These definitions contain recovered board geometry and newly authored
// physical actors. See NATIVE-CAMPAIGN.md for incomplete encounters and routes.
// Return isolated definitions: editor, replay and demo selection can mutate them.
export function nativeCourse(id) {
  const index = CAMPAIGN_ORDER.indexOf(id);
  if (index < 0) throw Error(`Unknown native campaign course: ${id}`);
  return {
    ...structuredClone(boards[index]),
    id,
    revision: 100,
    name: `${id[0].toUpperCase()}${id.slice(1)} Race`,
    subtitle: descriptions[index],
    category: "campaign",
    courseNumber: index + 1,
    parity: "native-integration",
    color: palettes[index][0],
    sidePalette: [...palettes[index]],
    musicCue: id,
    time: COURSE_TIME[id],
    rules: amigaCourseRules(id),
    route: id === "practice" ? structuredClone(practiceRoutes[0]) : [],
    ...(id === "practice"
      ? { playerRoutes: structuredClone(practiceRoutes) }
      : {}),
    checkpoints: [],
    markings: [],
    demoReady: id === "practice",
  };
}

export const campaignCourses = () => CAMPAIGN_ORDER.map(nativeCourse);
export const practiceCourse = () => nativeCourse("practice");
