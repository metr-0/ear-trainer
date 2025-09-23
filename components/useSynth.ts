import {useEffect, useRef} from "react";
import * as Tone from "tone";

function generateNoteMap(): Record<number, string> {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const map: Record<number, string> = {};

  for (let midi = 0; midi <= 127; midi++) {
    const octave = Math.floor(midi / 12) - 1;
    map[midi] = notes[midi % 12] + octave;
  }

  return map;
}

const NOTE_MAP = generateNoteMap();

export default function useSynth() {
  const synthRef = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth as any, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.5,
        release: 1,
      },
    } as any).toDestination();

    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const playNote = (note: number, duration: string = "8n") => {
    synthRef.current?.triggerAttackRelease(NOTE_MAP[note], duration);
  };

  return { playNote };
}
