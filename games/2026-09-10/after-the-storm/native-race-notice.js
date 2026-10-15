// A high-resolution text view of canonical source warning values. The host
// sends these discrete fields to Player2; this helper owns no timer or rule.
export function nativeRaceNotice(racer){
 if(racer.nativeBoundaryFrames>=0)return 'RETURN TO COURSE · '+Math.ceil(racer.nativeBoundaryFrames/20);
 if(racer.nativeWrongWay)return 'WRONG WAY · TURN BACK';
 return '';
}
/** Read-only counterpart of source i1 status priority for the online result
 * label. Finish flags precede DQ; equal finished record times are a tie. */
export function nativeRaceDisplayWinner([first,second]){
 const a=first.finishTime!==null,b=second.finishTime!==null;
 if(a&&b)return first.finishTime===second.finishTime?null:first.finishTime<second.finishTime?first:second;
 if(a||b)return a?first:second;
 if(first.dq&&second.dq)return null;
 return first.dq?second:second.dq?first:null;
}
