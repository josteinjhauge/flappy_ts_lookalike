import { Dimensions } from "react-native";

const screen = Dimensions.get("window");

const Constants = {
  MAX_WIDTH: screen.width,
  MAX_HEIGHT: screen.height,
  FLOOR_HEIGHT: 72,
  CEILING_HEIGHT: 20,
  GAP_SIZE: Math.min(210, Math.max(155, screen.height * 0.24)),
  PIPE_WIDTH: Math.min(90, screen.width * 0.22),
  CHARACTER_WIDTH: 50,
  CHARACTER_HEIGHT: 41,
  PIPE_SPEED: 2.7,
  FLAP_VELOCITY: -8.5,
};

export default Constants;