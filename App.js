import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';

import Constants from './components/Constants';
import Charecter from './components/Charecter';
import Wall from './components/Wall';
import Physics from './components/Physics';

export const randomSpace = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const makePipes = () => {
  let topPipeSize = randomSpace(100, (Constants.MAX_HEIGHT / 2) - 100);
  let bottomPipeSize = Constants.MAX_HEIGHT - topPipeSize - Constants.GAP_SIZE;
  let sizes = [topPipeSize, bottomPipeSize];

  if(Math.random() < 0.5){
    sizes = sizes.reverse();
  }
  return sizes;
};


export default class App extends Component {
  constructor(props){
    super(props);
    this.gameEngine = null;
    this.entities = this.setupWorld();

    this.state = {
      score: 0,
      running: true
    }
  }

  // add function to increment score
  incrementScore = () => {
    while(this.state.running = true){

    }
    this.setState({
      score: this.state.score + 1
    })
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;

    let charecter = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2, 50, 50, {
      render: {
        sprite: {
          texture: 'assets/rarkanin.png'
        }
      }
    });

    let floor = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50, { isStatic: true });
    let roof = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true });

    let [pipe1Size, pipe2Size] = makePipes();
    let pipe1 = Matter.Bodies.rectangle( Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), pipe1Size / 2, Constants.PIPE_WIDTH, pipe1Size, {isStatic: true});
    let pipe2 = Matter.Bodies.rectangle( Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe2Size / 2), Constants.PIPE_WIDTH, pipe2Size, {isStatic: true});

    let [pipe3Size, pipe4Size] = makePipes();
    let pipe3 = Matter.Bodies.rectangle( Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), pipe3Size / 2, Constants.PIPE_WIDTH, pipe3Size, {isStatic: true});
    let pipe4 = Matter.Bodies.rectangle( Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe4Size / 2), Constants.PIPE_WIDTH, pipe4Size, {isStatic: true});

    Matter.World.add(world,[charecter, floor, roof, pipe1, pipe2, pipe3, pipe4]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
        this.gameEngine.dispatch({type: 'game-over'});
    });

    return {
      physics: {engine: engine, world: world },
      charecter: {body: charecter, size: [50, 50], color: 'blue', renderer: Charecter},
      floor: {body: floor, size: [Constants.MAX_WIDTH, 50], color: 'red', renderer: Wall },
      roof: {body: roof, size: [Constants.MAX_WIDTH, 50], color: 'red', renderer: Wall },
      pipe1: {body: pipe1, size: [Constants.PIPE_WIDTH, pipe1Size], color: 'red', renderer: Wall },
      pipe2: {body: pipe2, size: [Constants.PIPE_WIDTH, pipe2Size], color: 'red', renderer: Wall },
      pipe3: {body: pipe3, size: [Constants.PIPE_WIDTH, pipe3Size], color: 'red', renderer: Wall },
      pipe4: {body: pipe4, size: [Constants.PIPE_WIDTH, pipe4Size], color: 'red', renderer: Wall },
    }
  }

  onEvent = (e) => {
    if(e.type === 'game-over'){
      this.setState({
        running: false
      })
      try{
        console.log('Game Over' + ' ' + 'your score was: ' + this.state.score)
      }catch(e){
        console.log.error('something went wrong' + e)
      }
      
    }
  }

  reset = () => {
      this.gameEngine.swap(this.setupWorld())
      this.setState({
        running: true
      })
  }

  render(){
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => {this.gameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities} 
          score={this.state.score}>
          <StatusBar hidden={true}/>
          <Text style={styles.scoreTextInGame}>{this.state.score}</Text>
        </GameEngine>
        {!this.state.running && <TouchableOpacity onPress={this.reset} style={styles.btnFullscreen}>
            <View style={styles.fullscreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.scoreText}>Your score: {this.state.score}</Text>
            </View>
          </TouchableOpacity>}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  btnFullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameOverText: {
    color: 'white',
    fontSize: 48
  },
  scoreText: {
    color: 'white',
    fontSize: 48
  },
  scoreTextInGame: {
    top: '10%',
    left: '40%',
    color: 'black',
    fontSize: 120,
    fontWeight: 'bold',
  },
  body: {
    textAlign: 'center'
  }
});
