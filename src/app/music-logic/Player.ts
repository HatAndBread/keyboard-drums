import { Player as TonePlayer, ToneAudioBuffer as Buff } from "tone";

export default class Player {
  player: TonePlayer;
  playing: boolean;
  playType: "LOOP" | "SINGLE" | "RAPID" | undefined;
  keyAssignment: string;
  buffer: Buff;
  randomize: boolean;
  constructor(
    keyAssignment: string,
    playType: "LOOP" | "SINGLE" | "RAPID" | undefined,
    buffer: Buff,
    playbackRate: number | undefined,
    volume: number | undefined,
    randomize: boolean | undefined
  ) {
    this.player = new TonePlayer().toDestination();
    this.playing = false;
    this.playType = playType;
    this.keyAssignment = keyAssignment;
    this.buffer = buffer;
    this.player.buffer = buffer;
    if (randomize) {
      this.randomize = randomize;
    } else {
      this.randomize = false;
    }
    if (playbackRate) {
      this.player.playbackRate = playbackRate;
    }
    if (volume) {
      this.player.volume.value = volume;
    }
    if (playType === "LOOP") {
      this.player.loop = true;
    }
  }
}
