export class Sounds {
  constructor() {
    this.sounds = {
      dubStep: new Audio("/public/assets/sounds/dubStep.mp3")
    };

    this.sounds.dubStep.volume = 0.5;
  }

  play(name) {
    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    sound.currentTime = 0;
    sound.play().catch(console.error);
  }

  stop(name) {
    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    sound.pause();
    sound.currentTime = 0;
  }
}
