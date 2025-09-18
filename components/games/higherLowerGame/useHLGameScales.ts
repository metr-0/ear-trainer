import { useEffect, useState } from "react";
import {Dimensions, Image, ImageSourcePropType, Platform} from "react-native";

const LANE_IMAGES: ImageSourcePropType[] = [
  require("../../../assets/images/lanes/silk/silk1.png"),
  require("../../../assets/images/lanes/silk/silk2.png"),
  require("../../../assets/images/lanes/silk/silk3.png"),
];

const useHLGameScales = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const dividerHeight = Math.round(screenHeight * .007);
  const laneHeight = Math.round(screenHeight * .2);

  const countdownBar = {
    width: screenWidth * .5,
    height: screenHeight * .05
  }

  const player = {
    width: laneHeight - dividerHeight * 5,
    height: laneHeight - dividerHeight * 5
  }

  const [imageWidth, setImageWidth] = useState<number>(1);
  const [imageHeight, setImageHeight] = useState<number>(1);

  useEffect(() => {
    if (Platform.OS === "web") {
      // https://github.com/necolas/react-native-web/issues/1666
      // https://github.com/expo/expo/issues/10737
      setImageWidth(3072);
      setImageHeight(222);
    } else {
      const source = Image.resolveAssetSource(LANE_IMAGES[0]);
      setImageWidth(source.width);
      setImageHeight(source.height);
    }
  }, []);

  const laneWidth = imageWidth * (laneHeight / imageHeight);

  return {
    screen: { width: screenWidth, height: screenHeight },
    lane: { height: laneHeight, width: laneWidth, dividerHeight },
    laneImages: LANE_IMAGES,
    countdownBar, player
  };
};

export default useHLGameScales;
