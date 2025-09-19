import {Animated} from "react-native";
import {useRef, useState} from "react";
import Indicator from "@/components/games/base/indicator/Indicator";

const useIndicatorController = (scales: any) => {
  const duration = 100;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [correct, setCorrect] = useState(false);

  const show = (newCorrect: boolean) => {
    setCorrect(newCorrect);

    Animated.timing(slideAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const hide = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  }

  const View = () => <Indicator slideAnim={slideAnim} correct={correct} scales={scales} />;

  return { View, show, hide };
}

export default useIndicatorController;
