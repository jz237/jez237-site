import type {Sound} from './audio';
import type {Vehicle} from './vehicle';
/** Rebuild loop/history state after a seek or pause, so discontinuous replay
 * positions cannot produce false shifts, landings or stale live-car audio. */
export class ReplayAudioTransport {
 private active=false;
 constructor(private readonly sound:Pick<Sound,'ready'|'attach'|'clearCars'|'pause'>){}
 sync(playing:boolean,seeking:boolean,cars:Vehicle[]):boolean{
  const next=playing&&!seeking&&this.sound.ready;
  if(next!==this.active){
   if(next){this.sound.attach(cars);void this.sound.pause(false);}
   else{void this.sound.pause(true);this.sound.clearCars();}
   this.active=next;
  }
  return next;
 }
 reset(){this.active=false;void this.sound.pause(true);this.sound.clearCars();}
}
