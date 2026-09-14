// NOAA solar position (Meeus-derived), metres/degrees, no dependencies. Used for the sky, lighting,
// shadows and the sunrise/sunset clock. World frame: +x east, +z south, +y up.
const RAD=Math.PI/180,DEG=180/Math.PI;
export const NOCKAMIXON={lat:40.463,lon:-75.237,name:'Lake Nockamixon, Bucks County PA'};
export function solarParams(ms){
 const jd=ms/86400000+2440587.5,T=(jd-2451545)/36525;
 const L0=((280.46646+T*(36000.76983+T*.0003032))%360+360)%360;
 const M=357.52911+T*(35999.05029-.0001537*T);
 const e=.016708634-T*(.000042037+.0000001267*T);
 const C=Math.sin(M*RAD)*(1.914602-T*(.004817+.000014*T))+Math.sin(2*M*RAD)*(.019993-.000101*T)+Math.sin(3*M*RAD)*.000289;
 const trueLong=L0+C,omega=125.04-1934.136*T,appLong=trueLong-.00569-.00478*Math.sin(omega*RAD);
 const obliq0=23+(26+(21.448-T*(46.815+T*(.00059-T*.001813)))/60)/60,obliq=obliq0+.00256*Math.cos(omega*RAD);
 const declination=Math.asin(Math.sin(obliq*RAD)*Math.sin(appLong*RAD))*DEG;
 const y=Math.tan(obliq/2*RAD)**2;
 const eqTime=4*DEG*(y*Math.sin(2*L0*RAD)-2*e*Math.sin(M*RAD)+4*e*y*Math.sin(M*RAD)*Math.cos(2*L0*RAD)-.5*y*y*Math.sin(4*L0*RAD)-1.25*e*e*Math.sin(2*M*RAD));
 return {declination,eqTime};
}
function refraction(el){let r;if(el>85)r=0;else if(el>5){const t=Math.tan(el*RAD);r=58.1/t-.07/(t*t*t)+.000086/(t**5);}else if(el>-.575)r=1735+el*(-518.2+el*(103.4+el*(-12.79+el*.711)));else r=-20.772/Math.tan(el*RAD);return r/3600;}
// Elevation and azimuth in degrees. Azimuth is clockwise from north.
export function sunPosition(ms,lat=NOCKAMIXON.lat,lon=NOCKAMIXON.lon){
 const {declination,eqTime}=solarParams(ms);
 const minutes=((ms/60000)%1440+1440)%1440;
 let tst=(minutes+eqTime+4*lon)%1440;if(tst<0)tst+=1440;
 const ha=tst/4<0?tst/4+180:tst/4-180;
 const cosZ=Math.min(1,Math.max(-1,Math.sin(lat*RAD)*Math.sin(declination*RAD)+Math.cos(lat*RAD)*Math.cos(declination*RAD)*Math.cos(ha*RAD)));
 const zenith=Math.acos(cosZ)*DEG,trueElevation=90-zenith;
 let azimuth;const denom=Math.cos(lat*RAD)*Math.sin(zenith*RAD);
 if(Math.abs(denom)<1e-9)azimuth=180;else{const a=Math.acos(Math.min(1,Math.max(-1,(Math.sin(lat*RAD)*Math.cos(zenith*RAD)-Math.sin(declination*RAD))/denom)))*DEG;azimuth=ha>0?(a+180)%360:(540-a)%360;}
 return {elevation:trueElevation+refraction(trueElevation),trueElevation,azimuth,declination,hourAngle:ha};
}
// Unit vector toward the sun in the world frame (+x east, +z south, +y up).
export function sunDirection(ms,lat,lon){const s=sunPosition(ms,lat,lon),el=s.elevation*RAD,az=s.azimuth*RAD;return {x:Math.cos(el)*Math.sin(az),y:Math.sin(el),z:-Math.cos(el)*Math.cos(az),elevation:s.elevation,azimuth:s.azimuth};}
// Sunrise, solar noon and sunset (ms since epoch) for the UTC calendar day of the instant given.
// For the eastern United States the UTC day and the local day coincide from 04:00 UTC onward.
export function sunEvents(ms,lat=NOCKAMIXON.lat,lon=NOCKAMIXON.lon){
 const dayStart=Math.floor(ms/86400000)*86400000;
 const noonGuess=dayStart+(720-4*lon)*60000,{declination,eqTime}=solarParams(noonGuess);
 const noon=dayStart+(720-4*lon-eqTime)*60000;
 const cosHA=Math.cos(90.833*RAD)/(Math.cos(lat*RAD)*Math.cos(declination*RAD))-Math.tan(lat*RAD)*Math.tan(declination*RAD);
 if(cosHA>1)return {noon,sunrise:null,sunset:null,polarNight:true};
 if(cosHA<-1)return {noon,sunrise:null,sunset:null,midnightSun:true};
 const ha=Math.acos(cosHA)*DEG;
 return {noon,sunrise:noon-ha*4*60000,sunset:noon+ha*4*60000};
}
