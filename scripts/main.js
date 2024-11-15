import { Vector } from './vector.js';
import { Platform } from './platform.js';
import { Ball } from './ball.js';
import { Block } from './block.js';

const mainWidth = document.getElementById('gameBackground').clientWidth;
const mainHeight = document.getElementById('gameBackground').clientHeight;
const skinBall = document.getElementById('ball');
const platskin = document.getElementById('platform');
const endline = document.getElementById('dashedLine');

let ball = new Ball(new Vector(mainWidth / 2 - 7, mainHeight - 200), new Vector(1, -1).normalize(), 7, 6, skinBall);
let platform = new Platform(new Vector(mainWidth / 2 - 30, mainHeight - 100), 60, 6, platskin);
let blocks = [];

function createBlocks() {
    const blockWidth = 40;
    const blockHeight = 16;

    const startX = 17.5;
    const startY = 10;
    const numCols = Math.floor(mainWidth / (blockWidth + 10));
    const numRows = Math.floor(mainHeight / 2 / (blockHeight + 10)) - 2;

    for (let j = 0; j < numRows; j++)
    {
        for (let i = 0; i < numCols; i++)
        {
            let block = new Block( new Vector(startX + i * (blockWidth + 10), startY + j * (blockHeight + 10)), blockWidth, blockHeight, 33, 33, 34, 'menu');
            blocks.push(block);
        }
    }
}

function platformMove()
{
    platform.position.x = ball.position.x + ball.radius - (platform.width / 2);
}

function checkBallBlocksCollision() 
{
    for (let block of blocks) 
    {

        if (ball.position.x + ball.radius * 2 >= block.position.x && ball.position.x <= block.position.x + block.width &&
            ball.position.y + ball.radius * 2 >= block.position.y && ball.position.y <= block.position.y + block.height) 
        {
            
            let distanceTop = Math.abs(ball.position.y + ball.radius * 2 - block.position.y);
            let distanceBottom = Math.abs(ball.position.y - (block.position.y + block.height));
            let distanceLeft = Math.abs(ball.position.x + ball.radius * 2 - block.position.x);
            let distanceRight = Math.abs(ball.position.x - (block.position.x + block.width));

            let minDistance = Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight);

            if (minDistance === distanceTop) 
            {
                ball.direction.y *= -1;
                ball.position.y = block.position.y - ball.radius * 2 - 1;
            } 
            else if (minDistance === distanceBottom) 
            {
                ball.direction.y *= -1; 
                ball.position.y = block.position.y + block.height + 1;
            } 
            else if (minDistance === distanceLeft)
            {
                ball.direction.x *= -1; 
                ball.position.x = block.position.x - ball.radius * 2 - 1;
            } 
            else if (minDistance === distanceRight) 
            {
                ball.direction.x *= -1; 
                ball.position.x = block.position.x + block.width + 1;
            }

            block.hp -= 1;

            if(block.hp === 0)
            {
                blocks.splice(blocks.indexOf(block), 1);
                block.skin.remove();
            }
            break;
        }
    }
}

    function checkCollision()
    {
        if (ball.position.x <= 0 || ball.position.x + ball.radius * 2 >= mainWidth) 
        {
            ball.direction.x *= -1;
        }
        
        if (ball.position.y <= 0) 
        {
            ball.direction.y *= -1;
        }
    
        if (
            ball.position.y + ball.radius * 2 >= platform.position.y &&
            ball.position.x + ball.radius >= platform.position.x &&
            ball.position.x <= platform.position.x + platform.width
        ) 
        {
            let randDir = Math.random();
            if (randDir < 0.5)
            {
                ball.direction.x *= -1;
            }
            ball.direction.y *= -1;
        }
    }

function animate() 
{
    checkCollision();
    if((ball.direction.equals(new Vector(1,1).normalize()) || 
       ball.direction.equals(new Vector(-1,1).normalize()) ||
       ball.direction.equals(new Vector(1,-1).normalize()) ||
       ball.direction.equals(new Vector(-1,-1).normalize())))
    {
        ball.position = new Vector(mainWidth / 2 - 7, mainHeight - 200);
        ball.direction = new Vector(1, -1);
    }
    ball.move();
    platformMove();
    checkBallBlocksCollision();
    platform.draw();    
    ball.draw();
    for(let block of blocks)
    {
        block.draw();
    }
    requestAnimationFrame(animate);
}

createBlocks();
animate();

window.GoToGame = function() {
    let input = document.getElementById('playerName');
    let name = input.value;

    localStorage.setItem('name', name);
    window.location.href = 'html/game.html';
}


window.openInstruction = function() {
    document.getElementById("instructionModal").style.display = "flex";
}

window.closeInstruction = function() {
    document.getElementById("instructionModal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target === document.getElementById("instructionModal")) {
        closeInstruction();
    }
};

