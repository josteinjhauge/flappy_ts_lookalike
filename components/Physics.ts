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

export const resetPipes = (): void => {
    pipes = 0;
}

export const generatePipes = (): number[] => {
    let topPipeHeight = randomSpace(100, (Constants.MAX_HEIGHT / 2) - 100);
    let bottomPipeHeight = Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE - 50;

    let sizes = [topPipeHeight, bottomPipeHeight];

    if (Math.random() < 0.5) {
        sizes = sizes.reverse();
    }

    return sizes;
}

export const addPipesLocation = (x: number, world: Matter.World, entities: any): void => {
    let [pipe1Height, pipe2Height] = generatePipes();

    let pipeTopWidth = Constants.PIPE_WIDTH + 20;
    let pipeTopHeight = (pipeTopWidth / 205) * 95; // original image size is 205x95

    pipe1Height = pipe1Height - pipeTopHeight;

    let pipe1Top = Matter.Bodies.rectangle(
        x,
        pipe1Height + (pipeTopHeight / 2),
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true }
    );

    let pipe1 = Matter.Bodies.rectangle(
        x,
        pipe1Height / 2,
        Constants.PIPE_WIDTH,
        pipe1Height,
        { isStatic: true }
    );

    pipe2Height = pipe2Height - pipeTopHeight;

    let pipe2Top = Matter.Bodies.rectangle(
        x,
        Constants.MAX_HEIGHT - pipe2Height - 50 - (pipeTopHeight / 2),
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true }
    );

    let pipe2 = Matter.Bodies.rectangle(
        x,
        Constants.MAX_HEIGHT - (pipe2Height / 2) - 50,
        Constants.PIPE_WIDTH, pipe2Height,
        { isStatic: true }
    );

    Matter.World.add(world, [pipe1, pipe1Top, pipe2, pipe2Top]);

    entities['pipe' + (pipes + 1)] = {
        body: pipe1, renderer: Pipe, scored: false
    }

    entities['pipe' + (pipes + 2)] = {
        body: pipe2, renderer: Pipe, scored: false
    }

    entities['pipe' + (pipes + 1) + 'Top'] = {
        body: pipe1Top, renderer: PipeTop, scored: false
    }

    entities['pipe' + (pipes + 2) + 'Top'] = {
        body: pipe2Top, renderer: PipeTop, scored: false
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
                world.gravity.y = 1.2;
                addPipesLocation((Constants.MAX_WIDTH * 2) - (Constants.PIPE_WIDTH / 2), world, entities);
                addPipesLocation((Constants.MAX_WIDTH * 3) - (Constants.PIPE_WIDTH / 2), world, entities);
            }
            hadTouches = true;
            // Old method: Matter.Body.applyForce( bird, bird.position, {x: 0.00, y: -0.05});
            Matter.Body.setVelocity(character, {
                x: character.velocity.x,
                y: -8.5
            });
        }
    });

    Object.keys(entities).forEach(key => {
        if (key.indexOf('pipe') === 0 && entities.hasOwnProperty(key)) {
            Matter.Body.translate(entities[key].body, {
                x: -2,
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
                    addPipesLocation((Constants.MAX_WIDTH * 2) - (Constants.PIPE_WIDTH / 2), world, entities)

                    delete (entities['pipe' + (pipeIndex - 1) + 'Top']);
                    delete (entities['pipe' + (pipeIndex - 1)]);
                    delete (entities['pipe' + pipeIndex + 'Top']);
                    delete (entities['pipe' + pipeIndex]);
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
                    x: -2,
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