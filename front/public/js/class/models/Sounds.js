export class Sounds {
  constructor() {
    this.sounds = {
      dubStep: new Audio("/assets/sounds/dubStep.mp3")
    };

    // optionnel : réglages globaux
    this.sounds.dubStep.volume = 0.5;
  }

  play(name) {
    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    sound.currentTime = 0; // rejoue depuis le début
    sound.play().catch(err => {
      console.error("Audio play error:", err);
    });
  }
}
