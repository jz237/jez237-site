import {boardLayouts} from '../hardware-layout.mjs';
export const chipRoles:Record<string,string>={
 '6809E':'The main processor executes Defender’s program and updates the game state. The E variant uses externally supplied clock phases from the board timing circuitry.',
 '4116':'Each device holds 16,384 one-bit locations. The three banks of eight chips total 48 KiB of dynamic RAM; all 24 packages are modeled.',
 '5101':'256 × 4-bit CMOS memory retains bookkeeping and settings with battery support. The three AA cells are part of the documented original arrangement.',
 '7641':'A 512 × 8-bit decoder PROM. The drawing specifies Decoder 3 at 3E and Decoder 2 at 3K. These are separate from the game program ROMs.',
 '6821':'A Peripheral Interface Adapter provides two eight-bit ports and control/interrupt lines. Its role depends on this board: controls on the interface board, peripheral commands on the ROM board, or digital audio output on the sound board.',
 '6808 / 02':'The dedicated sound processor executes a separate sound program. The drawing permits the 6808/6802 configuration; this exhibit does not claim a particular supplier or production date.',
 '6810':'128 × 8-bit static RAM provides working storage for the sound program.',
 '1408 DAC':'The eight-bit digital-to-analog converter turns the PIA’s numeric output into an analog signal for the audio amplifier. It does not itself compose the sounds.',
 'SOUND ROM':'The original sound program occupies IC12. The publicly deployed exhibit contains newly synthesized sound, not the original 2,048-byte sound ROM.',
 'TDA2002':'The analog power amplifier drives the 8-ohm speaker from the DAC-derived audio signal. The sound processor and DAC create the waveform; this stage supplies the power to move the cone.',
 '7805':'A linear regulator supplies the sound board’s regulated +5 V rail. It is separate from the main cabinet’s D8359 supply.',
 'UNUSED':'IC5 is deliberately unpopulated in the documented red-label ROM configuration.',
 '74LS257':'A quad two-input multiplexer selects between digital inputs. On the interface board, these devices participate in reading the switch inputs.',
 '4049':'A CMOS hex inverter provides six signal-inverting channels on the input interface.',
};
type Layout={title:string;sheet:number;width:number;height:number;chips:{ref:string;family:string;pins:number;u:number;v:number;rotation?:number;empty?:boolean}[]};
export function chipLayout(id:string):Layout|undefined{const layout=(boardLayouts as Record<string,Layout>)[id==='logic'?'cpu':id];return id==='sound'?{...layout,chips:[...layout.chips,{ref:'IC1',family:'TDA2002',pins:5,u:.642,v:.184},{ref:'IC8',family:'7805',pins:3,u:.86,v:.5}]}:layout;}
export function chipNote(id:string,ref:string){const chip=chipLayout(id)?.chips.find(c=>c.ref===ref);if(!chip)return undefined;return {...chip,text:chipRoles[chip.family]|| (chip.family.startsWith('ROM ')?'Program ROM position in the red-label assembly. Position and socket are modeled from the drawing; no proprietary ROM contents are included.':'Documented component family and reference position from the Williams assembly drawing. Its full connection details are available in the linked factory schematic.')};}
