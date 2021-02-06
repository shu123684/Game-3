const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// border of the cvs
cvs.style.border = "1px solid #0ff";

// Line thickness 
ctx.lineWidth = 3;

// GameVar
var paddleWidth  = 100;
var paddleMarginBottom  = 50
var paddleHeight = 20;
var life = 3
var ballRadius = 8;
var leftArrow = false;
var rightArrow = false;


// Paddle
var paddle = {
    x: cvs.width/2 - paddleWidth/2,
    y: cvs.height - paddleMarginBottom - paddleHeight,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5,
}

function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle =  "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Control the paddle
document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }
 });
 document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
 });

// Move Paddke
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x +=paddle.dx;
    }else if(leftArrow && paddle.x > 0 ){
        paddle.x -= paddle.dx
    }
}

// Create the ball
var ball ={
    x: cvs.width/2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 4,
    dx : 3 * (Math.random() * 2 -1),
    dy: -3,
}

// Draw the ball
function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x ,ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05"
    ctx.fill();

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

// Move the Ball
function moveBall(){
    ball.x +=ball.dx;
    ball.y +=ball.dy;
}

var brick = {
    row : 3,
    column: 5,
    width : 55,
    height: 20,
    offSetLeft : 20,
    offSetTop : 20, 
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}

let bricks = [];
function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; r < brick.column; c++){
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true,
            }
        }
    }
}

// createBricks();

// // draw the bricks
// function drawBricks(){
//     for(let r = 0; r < brick.row; r++){       
//         for(let c = 0; r < brick.column; c++){
//             let b = bricks[r][c]
//             if(b.status){
//                 ctx.fillStyle = brick.fillColor;
//                 ctx.fillRect(b.x, b.y, brick.width, brick.height);

//                 ctx.strokeStyle = brick.strokeColor;    
//                 ctx.strokeRect(b.x, b.y, brick.width, brick.height);
//             }
//         }
//     }
// }

// func draw
function draw(){
    drawPaddle();
    
    drawBall(); 

    // drawBricks()
}

// Ball and Collison 
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx  = -ball.dx;
    }

    if(ball.y - ball.radius < 0){
        ball.dy =  -ball.dy;
    }

    if(ball.y + ball.radius > cvs.height){
        life--;
        resetBall();
    }
}
// Reset the ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 -1);
    ball.dy= -3;
}

function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        // PLAY SOUND
        // PADDLE_HIT.play();
        
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// func update
function update(){
    movePaddle();

    moveBall();

    ballWallCollision();

    ballPaddleCollision()
}

// Game Loop
function loop(){
    ctx.drawImage(bgImg, 0, 0);

    draw();
    update();

    requestAnimationFrame(loop);
}
loop();

