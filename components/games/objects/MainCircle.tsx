import {Circle} from "react-native-svg";
import React from "react";

export type MainCircleEntity = {

};

export default function MainCircle({ x, y }: { x: number; y: number }) {
  return <Circle cx={x} cy={y} r={MEASURE * 0.1} fill="blue" />
};
