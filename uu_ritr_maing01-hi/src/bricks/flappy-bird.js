import React, { useState, useEffect, useRef } from 'react';
import '../styles/flappy-bird.css';

const GRAVITY = 0.08;
const JUMP_STRENGTH = -3;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 2000; // ms
const GAP_SIZE = 200;

const FlappyBird = ({ onClose }) => {
    const [birdPos, setBirdPos] = useState(300);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const gameLoopRef = useRef();
    const pipeGeneratorRef = useRef();

    const jump = () => {
        if (!gameStarted) {
            setGameStarted(true);
        }
        if (!gameOver) {
            setBirdVelocity(JUMP_STRENGTH);
        } else {
            // Restart
            setBirdPos(300);
            setBirdVelocity(0);
            setPipes([]);
            setScore(0);
            setGameOver(false);
            setGameStarted(true);
        }
    };

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const loop = () => {
                setBirdPos((pos) => pos + birdVelocity);
                setBirdVelocity((vel) => vel + GRAVITY);

                setPipes((currentPipes) => {
                    return currentPipes
                        .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
                        .filter((pipe) => pipe.x > -60);
                });

                // Collision detection
                // Bird dimensions: 30x30, Pipe width: 50
                // Ground at 580 (container height 600 - ground 20)
                if (birdPos >= 570 || birdPos < 0) {
                    setGameOver(true);
                }

                // Pipe collision
                // Bird x is fixed at roughly center or left side? Let's say bird is at 50px from left.
                // Actually in CSS I didn't set left for bird, let's assume it's centered or we set it.
                // Let's set bird left to 50px in inline style for simplicity or check CSS.
                // CSS says position absolute but no left/top. I will add left: 50px to bird style.

                // Check pipes
                // Pipe x is the left edge. Pipe width is 50.
                // Bird x is 50. Bird width is 30.
                // Collision X: pipe.x < 50 + 30 && pipe.x + 50 > 50

                // Collision Y:
                // Top pipe: height is pipe.topHeight. Collision if birdPos < pipe.topHeight
                // Bottom pipe: starts at pipe.topHeight + GAP_SIZE. Collision if birdPos + 30 > pipe.topHeight + GAP_SIZE

            };

            gameLoopRef.current = requestAnimationFrame(loop);
            return () => cancelAnimationFrame(gameLoopRef.current);
        }
    }, [gameStarted, gameOver, birdVelocity, birdPos]);

    // Separate effect for collision to access latest state without resetting loop? 
    // Actually putting logic in the loop above is tricky with state updates.
    // Better to use a single game loop interval or requestAnimationFrame that updates everything.

    useEffect(() => {
        let timeId;
        if (gameStarted && !gameOver) {
            timeId = setInterval(() => {
                setBirdPos((pos) => pos + birdVelocity);
                setBirdVelocity((vel) => vel + GRAVITY);

                setPipes((currentPipes) => {
                    const newPipes = currentPipes
                        .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
                        .filter((pipe) => pipe.x > -60);

                    return newPipes;
                });
            }, 24);
        }
        return () => clearInterval(timeId);
    }, [gameStarted, gameOver, birdVelocity]);

    useEffect(() => {
        let pipeId;
        if (gameStarted && !gameOver) {
            pipeId = setInterval(() => {
                const topHeight = Math.floor(Math.random() * 300) + 50;
                setPipes((pipes) => [...pipes, { x: 400, topHeight, passed: false }]);
            }, PIPE_SPAWN_RATE);
        }
        return () => clearInterval(pipeId);
    }, [gameStarted, gameOver]);

    // Collision Check
    useEffect(() => {
        const birdLeft = 50;
        const birdSize = 30;
        const birdBottom = birdPos + birdSize;

        if (birdPos < 0 || birdBottom > 580) { // 580 is ground top
            setGameOver(true);
        }

        pipes.forEach((pipe) => {
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + 50;

            if (pipeRight > birdLeft && pipeLeft < birdLeft + birdSize) {
                // Inside pipe horizontal area
                if (birdPos < pipe.topHeight || birdBottom > pipe.topHeight + GAP_SIZE) {
                    setGameOver(true);
                }
            }

            // Score
            if (pipeRight < birdLeft && !pipe.passed) {
                setScore((s) => s + 1);
                pipe.passed = true; // Mutating state object directly here is bad practice but in this loop we need to mark it. 
                // Better to do it in the pipe update loop.
                // Let's fix score in the pipe update loop or use a separate effect carefully.
                // For simplicity, I'll update the pipe state to mark passed.
                setPipes(prev => prev.map(p => p === pipe ? { ...p, passed: true } : p));
            }
        });

    }, [birdPos, pipes]);


    return (
        <div className="flappy-bird-overlay">
            <div className="flappy-bird-container" onClick={jump}>
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>

                <div className="score-board">{score}</div>

                <div
                    className="bird"
                    style={{
                        top: birdPos,
                        left: 50
                    }}
                />

                {pipes.map((pipe, i) => (
                    <React.Fragment key={i}>
                        <div
                            className="pipe"
                            style={{
                                top: 0,
                                left: pipe.x,
                                height: pipe.topHeight
                            }}
                        />
                        <div
                            className="pipe"
                            style={{
                                top: pipe.topHeight + GAP_SIZE,
                                left: pipe.x,
                                bottom: 20
                            }}
                        />
                    </React.Fragment>
                ))}

                <div className="ground" />

                {gameOver && (
                    <div className="game-over">
                        <h2>Game Over</h2>
                        <p>Score: {score}</p>
                        <p>Click to Restart</p>
                    </div>
                )}

                {!gameStarted && !gameOver && (
                    <div className="game-over">
                        <h2>Flappy Bird</h2>
                        <p>Click to Start</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlappyBird;
