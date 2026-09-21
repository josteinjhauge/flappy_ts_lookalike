import Matter from 'matter-js';
import Constants from './Constants';
import Pipe from './Pipe';
import PipeTop from './PipeTop';

let tick = 0;
let pose = 1;
let pipes = 0;

export const randomSpace = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const resetPhysics = (): void => {
    tick = 0;
    pose = 1;
    pipes = 0;
}

export const generatePipes = (): number[] => {
    const playableHeight = Constants.MAX_HEIGHT - Constants.FLOOR_HEIGHT;
    const minimumPipeHeight = 80;
    const maximumTopHeight = playableHeight - Constants.GAP_SIZE - minimumPipeHeight;
    const topPipeHeight = randomSpace(minimumPipeHeight, maximumTopHeight);
    const bottomPipeHeight = playableHeight - topPipeHeight - Constants.GAP_SIZE;

    return [topPipeHeight, bottomPipeHeight];
}

export const addPipesLocation = (x: number, world: Matter.World, entities: any): void => {
    const [topHeight, bottomHeight] = generatePipes();
    const pipeTopWidth = Constants.PIPE_WIDTH + 20;
    const pipeTopHeight = (pipeTopWidth / 205) * 95;
    const pipe1Height = topHeight - pipeTopHeight;

    const pipe1Top = Matter.Bodies.rectangle(
        x,
        topHeight - pipeTopHeight / 2,
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true, label: "pipe" }
    );

    const pipe1 = Matter.Bodies.rectangle(
        x,
        pipe1Height / 2,
        Constants.PIPE_WIDTH,
        pipe1Height,
        { isStatic: true, label: "pipe" }
    );

    const pipe2Height = bottomHeight - pipeTopHeight;
    const floorTop = Constants.MAX_HEIGHT - Constants.FLOOR_HEIGHT;

    const pipe2Top = Matter.Bodies.rectangle(
        x,
        floorTop - bottomHeight + pipeTopHeight / 2,
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true, label: "pipe" }
    );

    const pipe2 = Matter.Bodies.rectangle(
        x,
        floorTop - pipe2Height / 2,
        Constants.PIPE_WIDTH,
        pipe2Height,
        { isStatic: true, label: "pipe" }
    );

    Matter.World.add(world, [pipe1, pipe1Top, pipe2, pipe2Top]);

    entities['pipe' + (pipes + 1)] = {
        body: pipe1, renderer: Pipe
    }

    entities['pipe' + (pipes + 2)] = {
        body: pipe2, renderer: Pipe, scored: false
    }

    entities['pipe' + (pipes + 1) + 'Top'] = {
        body: pipe1Top, renderer: PipeTop
    }

    entities['pipe' + (pipes + 2) + 'Top'] = {
        body: pipe2Top, renderer: PipeTop
    }

    pipes += 2;
}

interface PhysicsProps {
    touches: any[];
    time: { delta: number };
    dispatch: (action: { type: string }) => void;
}

const Physics = (entities: any, { touches, time, dispatch }: PhysicsProps): any => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let character = entities.character.body;

    // Move character
    let hadTouches = false;
    touches.filter(t => t.type === "press").forEach(t => {
        if (!hadTouches) {
            if (world.gravity.y === 0.0) {
                world.gravity.y = 1.15;
                addPipesLocation(Constants.MAX_WIDTH + Constants.PIPE_WIDTH, world, entities);
                addPipesLocation(Constants.MAX_WIDTH * 1.75 + Constants.PIPE_WIDTH, world, entities);
            }
            hadTouches = true;
            // Old method: Matter.Body.applyForce( bird, bird.position, {x: 0.00, y: -0.05});
            Matter.Body.setVelocity(character, {
                x: character.velocity.x,
                y: Constants.FLAP_VELOCITY
            });
        }
    });

    Object.keys(entities).forEach(key => {
        if (key.indexOf('pipe') === 0 && entities.hasOwnProperty(key)) {
            Matter.Body.translate(entities[key].body, {
                x: -Constants.PIPE_SPEED,
                y: 0
            });

            if (key.indexOf('Top') === -1 && parseInt(key.replace('pipe', '')) % 2 === 0) {
                let pipeIndex = parseInt(key.replace('pipe', ''));

                // add Score counter logic
                if (entities[key].body.position.x < entities.character.body.position.x && !entities[key].scored) {
                    entities[key].scored = true;
                    dispatch({ type: 'score' })
                }

                if (entities[key].body.position.x <= -1 * (Constants.PIPE_WIDTH / 2)) {
                    addPipesLocation(Constants.MAX_WIDTH * 1.5, world, entities)

                    const staleKeys = [
                        'pipe' + (pipeIndex - 1) + 'Top',
                        'pipe' + (pipeIndex - 1),
                        'pipe' + pipeIndex + 'Top',
                        'pipe' + pipeIndex,
                    ];
                    staleKeys.forEach(staleKey => {
                        Matter.World.remove(world, entities[staleKey].body);
                        delete entities[staleKey];
                    });
                }
            }

        } else if (key.indexOf("floor") === 0) {
            if (entities[key].body.position.x <= -1 * (Constants.MAX_WIDTH / 2)) {
                Matter.Body.setPosition(entities[key].body, {
                    x: Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
                    y: entities[key].body.position.y
                });
            } else {
                Matter.Body.translate(entities[key].body, {
                    x: -Constants.PIPE_SPEED,
                    y: 0
                });
            }
        }
    });
    Matter.Engine.update(engine, time.delta);

    // animation of character
    tick += 1;
    if (tick % 5 === 0) {
        pose = pose + 1;
        if (pose > 3) {
            pose = 1;
        }
        entities.character.pose = pose;
    }

    return entities;
};

export default Physics;