import {useWindowDimensions} from "react-native";

const useScales = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const screen = { width: screenWidth, height: screenHeight };

  const countdownBar = {
    width: screen.width * .5,
    height: screen.height * .05
  }

  const indicator = {
    width: screen.width,
    height: screen.height * .07,
    slide: screen.height * .3
  }

  const player = {
    width: screen.height * .17,
    height: screen.height * .17,
    slide: screen.height * .207,
    sway: screen.height * .005,
    particle: {
      size: screen.height * (.03 + Math.random() * .01),
      speed: screen.width // * (.2 + Math.random() * .01)
    }
  }

  // hardcode cause:
  // https://github.com/necolas/react-native-web/issues/1666
  // https://github.com/expo/expo/issues/10737
  const laneImage = {
    width: 3072,
    height: 222
  };

  const lane = {
    width: laneImage.width * (Math.round(screen.height * .2) / laneImage.height),
    height: Math.round(screen.height * .2),
    dividerHeight: Math.round(screen.height * .007)
  };

  const countdown = {
    fontSize: screenHeight * .1
  };

  const obstacles = {
    height: screen.height * .47,
    width: screen.height * .284,
    offset: {
      topY: -screen.height * .765,
      bottomY: screen.height * .295,
      x: -screen.height * .142
    },
    slide: {
      y: screen.height * .207,
      x: screen.width
    }
  };

  const score = {
    topMargin: screen.height * .02,
    leftMargin: screen.height * .04,
    width: screen.width,
    fontSize: Math.min(screen.height * .08, screen.width * .06),
    imgSize: Math.min(screen.height * .08, screen.width * .06)
  };

  return {
    screen, lane, countdown,
    countdownBar, player, indicator,
    obstacles, score
  };
};

export default useScales;
