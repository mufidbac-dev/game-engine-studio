export class VehiclePhysics {
  constructor(config = {}) {
    this.speed = 0;
    this.maxSpeed = config.maxSpeed || 42;
    this.acceleration = config.acceleration || 24;
    this.friction = config.friction || 6;
    this.heading = 0;
  }
  accelerate(throttle, dt = 0.016) {
    this.speed = Math.min(this.maxSpeed, this.speed + throttle * this.acceleration * dt);
  }
  brake(amount, dt = 0.016) {
    this.speed = Math.max(0, this.speed - amount * this.acceleration * 1.5 * dt);
  }
  steer(angle, dt = 0.016) {
    this.heading += angle * dt * (this.speed > 0.5 ? 2.2 : 0);
  }
  update(dt) {
    if (this.speed > 0) {
      this.speed = Math.max(0, this.speed - this.friction * dt);
    }
  }
  getSpeed() {
    return this.speed;
  }
}

export class RacingTemplate {
  constructor() {
    this.name = 'racing';
    this.title = 'Racing / Arcade Track';
    this.description = 'High-speed arcade rover physics, checkpoint gates, lap timer, and AI rival racers.';
    this.vehicle = new VehiclePhysics();
  }
  async init(ctx) {
    this.ctx = ctx;
  }
  start() {}
  update(dt) {
    this.vehicle.update(dt);
  }
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}
