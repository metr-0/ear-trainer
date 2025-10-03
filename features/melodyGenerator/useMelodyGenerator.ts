import * as tf from "@tensorflow/tfjs";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";

const SEQ_LENGTH = 112;
const TEMPERATURE = 0.7;

const useMelodyGenerator = (modelUrl: string) => {
  const modelRef = useRef<tf.GraphModel | null>(null);
  const [ready, setReady] = useState(false);
  const sequenceRef = useRef<number[]>([]);

  useEffect(() => {
    setReady(false);
    (async () => {
      modelRef.current = await tf.loadGraphModel(modelUrl);
      reset([50]);
      generateNext();
      reset([]);
      setReady(true);
    })();
  }, [modelUrl]);

  const sampleWithTemperature = useCallback((logits: tf.Tensor1D, temperature: number) => {
    const adjusted = tf.div(logits, tf.scalar(temperature));
    const probs = tf.softmax(adjusted);
    const values = probs.dataSync();

    const cumSum: number[] = [];
    // @ts-ignore
    values.reduce((acc, v, i) => {
      cumSum[i] = acc + v;
      return cumSum[i];
    }, 0);

    const r = Math.random();
    const idx = cumSum.findIndex((c) => c > r);
    return idx === -1 ? values.length - 1 : idx;
  }, []);

  const generateNext = useCallback((range?: [number, number]) => {
    if (!modelRef.current || sequenceRef.current.length === 0) return null;

    let nextNote: number | null = null;

    tf.tidy(() => {
      const padded = [
        ...Array(Math.max(0, SEQ_LENGTH - sequenceRef.current.length)).fill(0),
        ...sequenceRef.current.slice(-SEQ_LENGTH),
      ];

      const input = tf.tensor2d([padded], [1, padded.length], "int32");

      const output = modelRef.current!.execute(
        { "input:0": input },
        "Identity:0"
      ) as tf.Tensor;

      const [, time, vocab] = output.shape;
      let logits = output
        .squeeze()
        .slice([time - 1, 0], [1, vocab])
        .squeeze() as tf.Tensor1D;

      if (range) {
        const [low, high] = range;
        const mask = tf.tensor1d(
          Array.from({ length: vocab }, (_, i) => (i >= low && i <= high ? 0 : -Infinity))
        );
        logits = tf.add(logits, mask);
      }

      nextNote = sampleWithTemperature(logits, TEMPERATURE);

      sequenceRef.current.push(nextNote);
    });

    return nextNote;
  }, [sampleWithTemperature]);

  const reset = useCallback((startNotes: number[] = []) => {
    sequenceRef.current = startNotes;
  }, []);

  const getLast2Notes = useCallback(() => {
    return [
      sequenceRef.current[sequenceRef.current.length - 2],
      sequenceRef.current[sequenceRef.current.length - 1]
    ]
  }, []);

  return useMemo(() => ({
    ready,
    getLast2Notes,
    generateNext,
    reset
  }), [ready, generateNext, reset, getLast2Notes]);
}

export default useMelodyGenerator;
