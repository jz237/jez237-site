import {unitNoise} from './vehicle-fire-profile';
export const EXPLOSION_CHANCE=.10;
/** One rare cosmetic fuel burst per damage episode; no per-frame lottery. */
export class VehicleThermalState {
  health = 100;
  heat = 0;
  smoke = 0;
  burst = 0;
  exploded = false;
  age = 0;
  criticalTime=0;
  private episode=0;
  private eligible=false;
  private assessed=false;
  private delay=12;
  constructor(health = 100,private seed=Math.random()) { this.health = health; }
  advance(health: number, dt: number, impactDamage = Math.max(0,this.health-health)) {
    if (!(dt > 0) || !Number.isFinite(dt)) return false;
    const repaired = health > this.health + 1;
    if (repaired) this.reset(health);
    health=Math.max(0,Math.min(100,Number.isFinite(health)?health:this.health));
    if(health<=20&&!this.assessed){
      this.assessed=true;this.eligible=unitNoise(this.seed+this.episode*1.173)<EXPLOSION_CHANCE;
      this.delay=8+unitNoise(this.seed+this.episode*1.173+4.71)*14;
    }
    if(health<=10&&this.heat>.65)this.criticalTime+=dt;
    const ignition = this.eligible&&!this.exploded&&health<=10&&this.criticalTime>=this.delay;
    this.health = health;
    if (ignition) { this.exploded = true; this.burst = 1; this.heat = Math.max(this.heat, .8); }
    else this.burst = Math.max(0, this.burst - dt * 1.65);
    const target = health < 24 ? .16 + .84 * (1 - Math.max(0, health) / 24) : 0;
    this.heat += (target - this.heat) * (1 - Math.exp(-dt * (target > this.heat ? 1.7 : 5)));
    this.smoke = Math.max(0, Math.min(1, (48 - health) / 40));
    this.age += dt;
    return ignition;
  }
  reset(health = 100) { this.health = health; this.heat = this.smoke = this.burst = this.age = this.criticalTime = 0; this.exploded = false;this.assessed=false;this.eligible=false;this.episode++; }
}
