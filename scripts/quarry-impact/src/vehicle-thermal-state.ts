/** Cosmetic fire lifecycle; never feeds health, handling, scoring or authority. */
export class VehicleThermalState {
  health = 100;
  heat = 0;
  smoke = 0;
  burst = 0;
  exploded = false;
  age = 0;
  constructor(health = 100) { this.health = health; }
  advance(health: number, dt: number, impactDamage = Math.max(0,this.health-health)) {
    if (!(dt > 0) || !Number.isFinite(dt)) return false;
    const repaired = health > this.health + 1;
    if (repaired) this.reset(health);
    const ignition = !this.exploded && this.health > 0 && health <= 0 && impactDamage >= 14;
    this.health = health;
    if (ignition) { this.exploded = true; this.burst = 1; this.heat = Math.max(this.heat, .8); }
    else this.burst = Math.max(0, this.burst - dt * 2.5);
    const target = health < 24 ? .16 + .84 * (1 - Math.max(0, health) / 24) : 0;
    this.heat += (target - this.heat) * (1 - Math.exp(-dt * (target > this.heat ? 1.7 : 5)));
    this.smoke = Math.max(0, Math.min(1, (48 - health) / 40));
    this.age += dt;
    return ignition;
  }
  reset(health = 100) { this.health = health; this.heat = this.smoke = this.burst = this.age = 0; this.exploded = false; }
}
