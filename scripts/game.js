import { Vector } from './vector.js';
import { Platform } from './Platform.js';
import { Ball } from './ball.js';
import { Block } from './block.js';
import { Patterns } from './Patterns.js';

class Game {
    constructor(container, infbar, platskin, ballskin, endline, patternType = 'rectangle', diff = 'easy') {
        this.container = container;
        this.infbar = infbar;
        this.platskin = platskin;
        this.ballskin = ballskin;
        this.endline = endline;
        this.patternType = patternType;
        this.containerWidth = this.container.clientWidth;
        this.containerHeight = this.container.clientHeight;
        this.endlinePosition = this.endline.offsetTop + this.endline.clientHeight;
        this.GreenBlock;
        this.YellowBlock;
        this.RedBlock;
        this.ballspeed = 4;
        this.diff = diff;        
        this.setComplexity(this.diff);
        this.platform = new Platform(
            new Vector(this.containerWidth / 2 - 30, this.containerHeight - 80),
            60, 
            6, 
            this.platskin
        );
        this.ball = new Ball(
            new Vector(this.containerWidth / 2 - 7, this.containerHeight / 2 - 10 + 200),
            new Vector(1, -1).normalize(),
            7, 
            this.ballspeed, 
            this.ballskin
        );
        this.blocks = [];
        this.score = 0;
        this.controlMethod = 'keyboard';

        this.lastHitBlockIndex = -1;
        this.time;
    }

    init() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                this.platform.movingRight = true;
            } else if (event.key === 'ArrowLeft') {
                this.platform.movingLeft = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowRight') {
                this.platform.movingRight = false;
            } else if (event.key === 'ArrowLeft') {
                this.platform.movingLeft = false;
            }
        });

        this.container.addEventListener('mousemove', (event) => {
            if (this.controlMethod === 'mouse') {
                const mouseX = event.clientX - this.container.getBoundingClientRect().left;
                this.platform.position.x = Math.min(
                    this.containerWidth - this.platform.width,
                    Math.max(0, mouseX - this.platform.width / 2)
                );
                this.platform.draw();
            }
        });

        this.container.addEventListener('touchstart', (event) => {
            this.touchStartX = event.touches[0].clientX;
        });

        this.container.addEventListener('touchmove', (event) => {
            const touchX = event.touches[0].clientX;
            const deltaX = touchX - this.touchStartX;
            
            if (Math.abs(deltaX) > 10) {
                this.platform.position.x += deltaX;
                this.platform.position.x = Math.min(
                    this.containerWidth - this.platform.width,
                    Math.max(0, this.platform.position.x)
                );
                this.touchStartX = touchX;
                this.platform.draw();
            }
        });
        if(this.diff === 'hard')
        {
            this.controlMethod = 'mouse';
        }
        this.createBlocks();
        this.startTimer();
    }

    createBlocks() {
        const blockWidth = 40;
        const blockHeight = 16;
        const patterns = new Patterns();

        const startY = 10;
        const maxRows = Math.floor(this.containerHeight / 2 / (blockHeight + 10));
        const patternWidth = Math.floor(this.containerWidth / (blockWidth + 10));

        let pattern;
        const space = Math.floor(Math.random() * 3) + 1;
        switch (this.patternType) {
            case 'unique':
                pattern = patterns.createUniquePattern(patternWidth, maxRows);
                break;
            case 'rectangle':
                pattern = patterns.createRectanglePattern(patternWidth, maxRows);
                break;
            case 'column':
                const colomnWidth = Math.floor(Math.random() * 3) + 1;
                pattern = patterns.createColumnPattern(patternWidth, maxRows, colomnWidth, space);
                break;
            case 'zigzag':
                const rowsWidth = Math.floor(Math.random() * 3) + 1;
                pattern = patterns.createZigzagPattern(patternWidth, rowsWidth, maxRows/(rowsWidth+space), space);
                break;
            case 'pyramid':
            default:
                pattern = patterns.createPyramidPattern(patternWidth);
                break;
        }

        for (let row = 0; row < pattern.length; row++) {
            const currentRow = pattern[row];

            for (let col = 0; col < currentRow.length; col++) {
                if (currentRow[col] === 1) {
                    let block = new Block(
                        new Vector(17.5 + col * (blockWidth + 10), startY + row * (blockHeight + 10)), blockWidth, blockHeight, this.GreenBlock, this.YellowBlock, this.RedBlock, 'containergame');
                    this.blocks.push(block);
                }
            }
        }
    }


    checkBallBlocksCollision() 
    {
        let blocksToRemove = [];
        let hasCollision = false;
    
        for (let block of this.blocks) 
        {
            if (block === this.lastHitBlock) 
            {
                continue;
            }
    
            if (this.ball.position.x + this.ball.radius * 2 >= block.position.x && 
                this.ball.position.x <= block.position.x + block.width &&
                this.ball.position.y + this.ball.radius * 2 >= block.position.y && 
                this.ball.position.y <= block.position.y + block.height) 
            {
                this.lastHitBlock = block;
                hasCollision = true;
    
                let distanceTop = Math.abs(this.ball.position.y + this.ball.radius * 2 - block.position.y);
                let distanceBottom = Math.abs(this.ball.position.y - (block.position.y + block.height));
                let distanceLeft = Math.abs(this.ball.position.x + this.ball.radius * 2 - block.position.x);
                let distanceRight = Math.abs(this.ball.position.x - (block.position.x + block.width));
    
                let minDistance = Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight);
    
                if (minDistance === distanceTop) 
                {
                    this.ball.direction.y *= -1;
                    this.ball.position.y = block.position.y - this.ball.radius * 2 - 1;
                } 
                else if (minDistance === distanceBottom) 
                {
                    this.ball.direction.y *= -1; 
                    this.ball.position.y = block.position.y + block.height + 1;
                } 
                else if (minDistance === distanceLeft)
                {
                    this.ball.direction.x *= -1; 
                    this.ball.position.x = block.position.x - this.ball.radius * 2 - 1;
                } 
                else if (minDistance === distanceRight) 
                {
                    this.ball.direction.x *= -1; 
                    this.ball.position.x = block.position.x + block.width + 1;
                }
    
                block.hp -= 1;
                if (block.hp === 0) 
                {
                    blocksToRemove.push(block);
                    this.score += block.value;
                    block.skin.remove();
                }
    
                break;
            }
        }
    
        for (let block of blocksToRemove) 
        {
            const index = this.blocks.indexOf(block);
            if (index > -1) 
            {
                this.blocks.splice(index, 1);
            }
        }
    
        if (!hasCollision) 
        {
            this.lastHitBlock = null;
        }
    }

    updateScoreDisplay() {
        const scoreText = document.getElementById('score');
        scoreText.innerText = this.score;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
    
            document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    stopTimer() {
        this.time = document.getElementById('timer').innerText;
        clearInterval(this.timerInterval);
    }

    stopGame() 
    {
        document.getElementById("gameTime").textContent = this.time;
        document.getElementById("gameScore").textContent = this.score;

        let playerName = localStorage.getItem('name') || 'Гравець';
        document.getElementById('playerNameDisplay').textContent = `Ім'я: ${playerName}`;

        let gameResultMessage = (this.blocks.length === 0) ? 'Вітаємо! Ви виграли!' : 'На жаль, ви програли. Спробуйте знову!';
        document.getElementById('gameResult').textContent = gameResultMessage;
        document.getElementById('gameResult').style.fontSize = '14px';

        if(this.blocks.length === 0)
        {
        overgameMusicSrc.src = "../audio/TF2 Victory - Sound Effect HD.mp3";
        overgameMusic.load();
        }

        document.getElementById("resultModal").style.display = "block";

        backgroundMusic.pause();
        musicSVG.src = "../img/volume-xmark-svgrepo-com.svg";       
        overgameMusic.play();
    }

    animate() {
        if (this.controlMethod === 'keyboard') {
            if (this.platform.movingRight) {
                this.platform.moveRight(this.containerWidth);
            }
            if (this.platform.movingLeft) {
                this.platform.moveLeft();
            }
        }
        this.checkBallBlocksCollision();
        this.ball.move();
        const gameStop = this.ball.checkCollision(this.containerWidth, this.containerHeight, this.endlinePosition, this.platform);
        for (let block of this.blocks)
        {
            block.draw();
        }

        this.platform.draw();
        this.ball.draw();
        this.updateScoreDisplay();
        if (gameStop || this.blocks.length === 0) {
            this.stopTimer();
            this.stopGame();
            return;
        } 
        else 
        {
            requestAnimationFrame(() => this.animate());
        }
    }

    setComplexity(diff)
    {
        if(diff === 'easy')
        {
            this.controlMethod = 'mouse';
            this.GreenBlock = 50;
            this.YellowBlock = 35;
            this.RedBlock = 15;
            this.ballspeed = 3;
        }
        else if(diff === 'medium')
        {
            this.controlMethod = 'keyboard';
            this.GreenBlock = 30;
            this.YellowBlock = 40;
            this.RedBlock = 30;
            this.ballspeed = 4.3;
        }
        else
        {
            this.controlMethod = 'keyboard';
            this.GreenBlock = 15;
            this.YellowBlock = 35;
            this.RedBlock = 50;
            this.ballspeed = 6.5;
        }
    }

    applySettings()
    {
        this.ball.skin.style.transform = "translateX(0%)";
    }

    startGame()
    {
        this.init();
        this.animate();
    }
}

const backgroundMusic = document.getElementById('backgroundMusic');
const musicSVG = document.getElementById('musicSVG');
const overgameMusic = document.getElementById('overgameMusic')
const overgameMusicSrc = document.getElementById('overgameMusicSrc');

document.addEventListener('DOMContentLoaded', () => {
    const infbar = document.getElementById('InformatioBar');
    const platskin = document.getElementById('platform');
    const contgame = document.getElementById('containergame');
    const ballskin = document.getElementById('ball');
    const endline = document.getElementById('dashedLine');


    const audioButton = document.getElementById('audioButton');
    let isPlaying = false;
    audioButton.addEventListener('click', () => {
        if (isPlaying) {
            backgroundMusic.pause();
            musicSVG.src = "../img/volume-xmark-svgrepo-com.svg";
        } else {
            backgroundMusic.play();
            musicSVG.src = "../img/volume-max-svgrepo-com.svg"; 
        }
        isPlaying = !isPlaying;
    });
    
    
    const patternTypeSelect = document.getElementById('patternType');
    const startGameButton = document.getElementById('startGameButton');

    let patternType = 'rectangle';

    const patternOptions = document.querySelectorAll('.pattern-option');

    patternOptions.forEach(option => {
        option.addEventListener('click', function() {            
            const selectedPattern = this.getAttribute('data-pattern');
            patternOptions.forEach(item => item.classList.remove('active'));
            this.classList.add('active');            

            localStorage.setItem('selectedPattern', selectedPattern);            
        });
    });

    let diff;

    window.changeFocusColor = function() 
    {    
        
        const select = document.getElementById('difficulty');
        if (select.value === 'easy') 
        {
            select.style.borderColor = '#00ff00';
            select.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.6)';
            diff = 'easy';
        } 
        else if (select.value === 'medium') 
        {
            select.style.borderColor = '#ffff00';
            select.style.boxShadow = '0 4px 8px rgba(255, 255, 0, 0.6)';
            diff = 'medium';
        } 
        else if (select.value === 'hard') {
            select.style.borderColor = '#ff0000';
            select.style.boxShadow = '0 4px 8px rgba(255, 0, 0, 0.6)';
            diff = 'hard';
        }
    };
    
    document.getElementById('difficulty').addEventListener('input', changeFocusColor);
    startGameButton.addEventListener('click', () => 
    {
        const game = new Game(contgame, infbar, platskin, ballskin, endline, localStorage.getItem('selectedPattern'), diff);
        game.startGame();
        document.getElementById('settings').style.display = 'none';
        document.getElementById('bgsett').style.display = 'none';
    });

});