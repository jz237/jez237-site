import {transmissionGearLabel} from './transmission';
/** Canvas instruments scale as one unit and never change game/control state. */
export function drawInstruments(canvas:HTMLCanvasElement,speed:number,rpm:number,gear:number,health:number){
 const c=canvas.getContext('2d')!;const w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);
 const cx=w/2,cy=h*.50,r=w*.43,start=Math.PI*.78,sweep=Math.PI*1.44;
 const gradient=c.createRadialGradient(cx,cy,0,cx,cy,r);gradient.addColorStop(0,'rgba(19,24,23,.76)');gradient.addColorStop(1,'rgba(19,24,23,.32)');
 c.fillStyle=gradient;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fill();
 c.strokeStyle='#e4e6dfb0';c.lineWidth=2.6;c.beginPath();c.arc(cx,cy,r,start,start+sweep);c.stroke();
 for(let i=0;i<=40;i++){
  const a=start+sweep*i/40,major=i%5===0,inner=r-(major?17:7);c.strokeStyle=i>=35?'#e5634d':'#e1e4db';c.lineWidth=major?2:1.2;
  c.beginPath();c.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.stroke();
  if(major){c.font='19px Arial';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#e1e4db';c.fillText(String(i/5),cx+Math.cos(a)*(r-32),cy+Math.sin(a)*(r-32));}
 }
 c.strokeStyle=health<25?'#e76d4d':'#e8ebdf';c.lineWidth=6;c.beginPath();c.arc(cx,cy,r-7,start,start+sweep*Math.min(1,rpm/8000));c.stroke();
 c.fillStyle='#f5f4e9';c.textAlign='center';c.textBaseline='alphabetic';c.font='italic 900 82px Arial';c.fillText(String(Math.round(Math.abs(speed)*3.6)),cx,cy+34);
 c.font='15px Arial';c.fillStyle='#cbd0c7';c.fillText('KM/H',cx,cy+60);
 c.strokeStyle='#bbc2b9';c.lineWidth=1.5;c.strokeRect(cx-24,cy+76,48,44);c.font='bold 30px Arial';c.fillStyle='#f2f3e8';c.fillText(transmissionGearLabel(gear),cx,cy+108);
 c.font='10px Arial';c.fillStyle='#acb6aa';c.fillText('ABS     TCS     ESC',cx,cy+142);
 for(let i=0;i<3;i++){c.fillStyle=i===2?'#ddc555':'#86bf63';c.fillRect(cx-66+i*48,cy+149,37,4);}
}
