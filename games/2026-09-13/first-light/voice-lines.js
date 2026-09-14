// Ray's lines: a laconic local fishing buddy who says less than he knows. Every event has at
// least three variants so nothing repeats back to back (the fleet voice bar), and each variant is
// a short clip at assets/voice/<event>-<n>.mp3. Pure module; voice.js picks and plays.
export const RAY={
 bite:["There he is.","Take. Take.","That's a bite.","He's on it."],
 missed_early:["Too quick. Let him eat it.","Pulled it away. Give him a second.","Patience. Let him turn with it."],
 missed_late:["He spat it.","Gone. That one was ours to lose.","Should have set on that one."],
 hooked:["Fish on.","Got him.","Stay tight, stay tight.","Good hookset."],
 jump:["Bow to him.","Rod down, he's coming up.","Jumper. Give him the tip."],
 slack:["Keep it tight.","Tight line, he's shaking.","Don't give him slack."],
 overload:["Ease off, you'll break him off.","That drag's screaming. Let him run.","Too much. Back off."],
 broke_off:["Broke off. That was too much on that line.","Gone. Line couldn't take it.","Snap. Re-tie and go again."],
 threw_hook:["Threw the hook.","He shook it. Keep it tight next time.","Lost him on the shake."],
 bitten_off:["Bit off. Something with teeth.","Clean cut. That's a pickerel, or worse.","Teeth. Tie on the wire."],
 landed_young:["Little one. They all count.","Small, but he ate.","That's a start."],
 landed_common:["That's a keeper.","Nice fish.","Good one. Look at him.","Solid."],
 landed_trophy:["Now that's a fish.","Look at the shoulders on that one.","Trophy. Get a picture.","That's the one you came for."],
 landed_legend:["That's him. That's the Ridge Fish.","You'll be telling this one for years.","Fish of a lifetime, right there."],
 first_species:["First of those for the book.","New one for the journal.","Haven't seen one of those today. Write it down."],
 personal_best:["That's your best one.","Personal best. Right there.","Biggest yet."],
 follow:["He's following. Keep it moving.","Follower. Figure-eight at the boat.","Don't stop it. He's right behind it."],
 snagged:["Snagged. Give it slack, then snap it.","Hung up. Bow to it and pop it.","Wood. Slack line, then snap."],
 snag_freed:["Came free.","There it goes.","Got it back."],
 snag_lost:["Lost that one to the wood.","Buried. Tie on another.","That's the lake's now."],
 check_line:["Check your line. It's frayed.","Run your fingers up that line. Re-tie.","That line's been through wood. Re-tie it."],
 retied:["Fresh line.","Good. Tied on.","Re-tied. Go again."],
 unlock:["That earned you something in the box.","New rig in the tackle box.","Box just got bigger."],
 weather_turning:["Pressure's dropping. They'll feed ahead of it.","Front coming. Fish it hard now.","Glass is falling. Good time to be here."],
 skunked:["Sun's going. They win some days.","Not every morning has a fish in it.","Skunked. The lake keeps its secrets."],
 bait_showing:["Bait's up. Nervous water there.","See that? Shiners on top.","Something's pushing bait. Get a cast in there."]
};
// which line wins when two events land in the same breath
export const PRIORITY={landed_legend:10,landed_trophy:9,personal_best:9,first_species:8,landed_common:7,landed_young:7,broke_off:8,bitten_off:8,threw_hook:8,hooked:7,snag_lost:6,snagged:6,snag_freed:5,jump:6,overload:6,slack:4,bite:5,missed_early:5,missed_late:5,follow:5,check_line:3,retied:3,unlock:6,weather_turning:2,skunked:2,bait_showing:1};
export function lineFile(event,n){return `assets/voice/${event}-${n+1}.mp3`;}
export function allClips(){const out=[];for(const ev in RAY)RAY[ev].forEach((text,i)=>out.push({event:ev,n:i,text,file:lineFile(ev,i)}));return out;}
