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
import Physics, { resetPipes } from "./components/Physics";
import Floor from "./components/Floor";
import Roof from './components/Roof';
import Images from "./assets/Images";

interface Props {}

interface State {
  score: number;
  running: boolean;
}

class App extends Component<Props, State> {
  gameEngine: any;
  entities: any;

  constructor(props: Component<Props>) {
    super(props);

    this.state = {
      score: 0,
      running: true,
    };


    this.gameEngine = null
    this.entities = this.setupWorld()
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0.0;

    let character = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT / 2,
      Constants.CHARACTER_WIDTH,
      Constants.CHARACTER_HEIGHT
    );

    let floor1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
    );

    let floor2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
    );

    // TODO: look into how to add roof to game to disable chating

    let roof = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 50,
      Constants.MAX_WIDTH + 4,
      100,
      { isStatic: true }
    );

    Matter.World.add(world, [character, floor1, floor2]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      try {
        this.gameEngine.dispatch({ type: "game-over" });
      } catch (error) {
        console.log("error gameengine = null");
      }
    });

    return {
      physics: { engine: engine, world: world },
      character: { body: character, pose: 1, renderer: Character },
      floor1: { body: floor1, renderer: Floor },
      floor2: { body: floor2, renderer: Floor },
      roof: {body: roof, renderer: Roof},
    };
  };

  onEvent = (e: any) => {
    if (e.type === "game-over") {
      try {
        this.setState({
          running: false,
        });
        console.log("Game Over" + " " + "your score was: " + this.state.score);
      } catch (error) {
        console.log("something went wrong" + error);
      }
    } else if (e.type === "score") {
      try {
        this.setState({
          score: this.state.score + 1,
        });
      } catch (error) {
        console.log("Registration of score failed" + error);
      }
    }
  };

  reset = () => {
    resetPipes();
    this.gameEngine.swap(this.setupWorld());
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
          ref={(ref) => this.gameEngine = ref}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}
        >
          <StatusBar hidden={true} />
        </GameEngine>
        <Text style={styles.scoreTextInGame}>{this.state.score}</Text>
        {!this.state.running && (
          <TouchableOpacity onPress={this.reset} style={styles.btnFullscreen}>
            <View style={styles.fullscreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.scoreText}>
                Your score: {this.state.score}
              </Text>
              <Text style={styles.tryAgainText}>Try Again</Text>
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
    backgroundColor: "black",
    opacity: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    color: "white",
    fontSize: 48,
  },
  tryAgainText: {
    color: "white",
    fontSize: 48,
  },
  scoreText: {
    color: "white",
    fontSize: 48,
  },
  scoreTextInGame: {
    top: "10%",
    left: "40%",
    color: "black",
    fontSize: 120,
    fontWeight: "bold",
  },
  body: {
    textAlign: "center",
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
