/**
 * Keyframe timeline player for camera, object, and dialogue cutscenes.
 */
export class CutscenePlayer {
  /**
   * @param {import('../../core/Engine.js').Engine} engine
   * @param {import('../events/EventBus.js').EventBus} eventBus
   */
  constructor(engine, eventBus) {
    this.engine = engine;
    this.eventBus = eventBus;
    this.tracks = [];
    this.duration = 0;
    this.currentTime = 0;
    this.playing = false;
  }

  load(cutsceneJSON) {
    this.tracks = cutsceneJSON?.tracks || [];
    this.duration = cutsceneJSON?.duration || 5.0;
    this.currentTime = 0;
  }

  play() {
    this.playing = true;
    this.currentTime = 0;
    this.eventBus?.emit('cutscene:started');
  }

  pause() {
    this.playing = false;
  }

  stop() {
    this.playing = false;
    this.currentTime = 0;
    this.eventBus?.emit('cutscene:stopped');
  }

  skip() {
    this.currentTime = this.duration;
    this._applyAtTime(this.duration);
    this.stop();
  }

  update(dt) {
    if (!this.playing) return;
    this.currentTime = Math.min(this.duration, this.currentTime + dt);
    this._applyAtTime(this.currentTime);
    if (this.currentTime >= this.duration) {
      this.stop();
    }
  }

  _applyAtTime(t) {
    const cam = this.engine?.getCamera?.();
    for (const track of this.tracks) {
      if (track.type === 'camera' && cam && track.keyframes?.length >= 2) {
        const [k0, k1] = track.keyframes;
        const alpha = Math.max(0, Math.min(1, (t - k0.time) / Math.max(0.001, k1.time - k0.time)));
        cam.position.set(
          k0.value[0] + (k1.value[0] - k0.value[0]) * alpha,
          k0.value[1] + (k1.value[1] - k0.value[1]) * alpha,
          k0.value[2] + (k1.value[2] - k0.value[2]) * alpha
        );
      }
    }
  }

  isPlaying() {
    return this.playing;
  }
}
