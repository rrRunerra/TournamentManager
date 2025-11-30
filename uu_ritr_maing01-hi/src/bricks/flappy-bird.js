import React, { useState, useEffect, useRef } from 'react';
import '../styles/flappy-bird.css';
import importLsi from "../lsi/import-lsi.js";
import { Lsi } from "uu5g05";

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
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const gameLoopRef = useRef();

    useEffect(() => {
        const savedHighScore = localStorage.getItem('flappyHighScore');
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore, 10));
        }
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappyHighScore', score);
        }
    }, [score, highScore]);

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
                if (birdPos >= 570 || birdPos < 0) {
                    setGameOver(true);
                }
            };

            gameLoopRef.current = requestAnimationFrame(loop);
            return () => cancelAnimationFrame(gameLoopRef.current);
        }
    }, [gameStarted, gameOver, birdVelocity, birdPos]);

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
                pipe.passed = true;
                setPipes(prev => prev.map(p => p === pipe ? { ...p, passed: true } : p));
            }
        });

    }, [birdPos, pipes]);


    return (
        <div className="flappy-bird-overlay">
            <div className="flappy-bird-container" onClick={jump}>
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>

                <div className="score-board">
                    <div>{score}</div>
                    <div className="high-score"><Lsi import={importLsi} path={["FlappyBird", "best"]} />: {highScore}</div>
                </div>

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
                        <h2><Lsi import={importLsi} path={["FlappyBird", "gameOver"]} /></h2>
                        <p><Lsi import={importLsi} path={["FlappyBird", "score"]} />: {score}</p>
                        <p><Lsi import={importLsi} path={["FlappyBird", "best"]} />: {highScore}</p>
                        <p><Lsi import={importLsi} path={["FlappyBird", "clickToRestart"]} /></p>
                    </div>
                )}

                {!gameStarted && !gameOver && (
                    <div className="game-over">
                        <h2>Flappy Bird</h2>
                        <p><Lsi import={importLsi} path={["FlappyBird", "best"]} />: {highScore}</p>
                        <p><Lsi import={importLsi} path={["FlappyBird", "clickToStart"]} /></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlappyBird;

