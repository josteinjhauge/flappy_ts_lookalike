import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

import Constants from "./components/Constants";
import Character from "./components/Character";
import Physics, { resetPhysics } from "./components/Physics";
import Floor from "./components/Floor";
import Roof from "./components/Roof";
import Images from "./assets/Images";

interface Props {}

interface State {
  score: number;
  running: boolean;
}

class App extends Component<Props, State> {
  gameEngine: any;
  entities: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      score: 0,
      running: true,
    };

    this.gameEngine = null;
    this.entities = this.setupWorld();
  }

  setupWorld = () => {
    const engine = Matter.Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 0, scale: 0.001 },
    });
    const world = engine.world;
    world.gravity.y = 0.0;

    const character = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 0.3,
      Constants.MAX_HEIGHT / 2,
      Constants.CHARACTER_WIDTH,
      Constants.CHARACTER_HEIGHT,
      { label: "bird" }
    );

    const floorY = Constants.MAX_HEIGHT - Constants.FLOOR_HEIGHT / 2;
    const floor1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      floorY,
      Constants.MAX_WIDTH + 4,
      Constants.FLOOR_HEIGHT,
      { isStatic: true, label: "floor" }
    );

    const floor2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2,
      floorY,
      Constants.MAX_WIDTH + 4,
      Constants.FLOOR_HEIGHT,
      { isStatic: true, label: "floor" }
    );

    const roof = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      -Constants.CEILING_HEIGHT / 2,
      Constants.MAX_WIDTH,
      Constants.CEILING_HEIGHT,
      { isStatic: true, label: "ceiling" }
    );

    Matter.World.add(world, [character, floor1, floor2, roof]);

    Matter.Events.on(engine, "collisionStart", () => {
      if (this.state.running && this.gameEngine) {
        this.gameEngine.dispatch({ type: "game-over" });
      }
    });

    return {
      physics: { engine, world },
      character: { body: character, pose: 1, renderer: Character },
      floor1: { body: floor1, renderer: Floor },
      floor2: { body: floor2, renderer: Floor },
      roof: { body: roof, renderer: Roof },
    };
  };

  onEvent = (e: any) => {
    if (e.type === "game-over") {
      this.setState({ running: false });
    } else if (e.type === "score") {
      this.setState((state) => ({ score: state.score + 1 }));
    }
  };

  reset = () => {
    resetPhysics();
    this.entities = this.setupWorld();
    this.gameEngine.swap(this.entities);
    this.setState({
      running: true,
      score: 0,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={Images.background}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />
        <GameEngine
          ref={(ref) => {
            this.gameEngine = ref;
          }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}
        >
          <StatusBar hidden={true} />
        </GameEngine>
        <View pointerEvents="none" style={styles.hud}>
          <Text style={styles.scoreTextInGame}>{this.state.score}</Text>
          {this.state.running && (
            <Text style={styles.instructionText}>Tap to fly</Text>
          )}
        </View>
        {!this.state.running && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Play again"
            activeOpacity={0.9}
            onPress={this.reset}
            style={styles.btnFullscreen}
          >
            <View style={styles.fullscreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.scoreText}>
                Your score: {this.state.score}
              </Text>
              <Text style={styles.tryAgainText}>Tap to try again</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  btnFullscreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  fullscreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    color: "white",
    fontSize: 44,
    fontWeight: "800",
  },
  tryAgainText: {
    color: "#f7df1e",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 28,
  },
  scoreText: {
    color: "white",
    fontSize: 28,
    marginTop: 12,
  },
  hud: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scoreTextInGame: {
    color: "white",
    fontSize: 64,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.55)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 2,
  },
  instructionText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
  },
});

export default App;
