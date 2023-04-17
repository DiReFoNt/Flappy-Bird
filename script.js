window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#game-canvas'),
          ctx = canvas.getContext('2d'),
          gameContainer = document.querySelector('.game-container'),
          flappyImg = new Image();
          flappyImg.src = 'assets/image/flappy_dunk.png';

    // Game constant
    const flapSpeed = -4,
          birdWidth = 40,
          birdHeight = 30,
          pipeWidth = 50,
          pipeGap = 125;

    // Bird variables
    let birdX = 50,
        birdY = 50,
        birdVelocity = 0,
        birdAcceleration = 0.1;

    // Pipe variables
    let pipeX = 400,
        pipeY = canvas.height - 200;

    // score and highscore variables
    let scoreDiv = document.querySelector('.score-display'),
        score = 0,
        highScore = 0;
    
    // Check if our bird passes pipe
    let scored = false;

    // Control Bird
    document.body.onkeyup = (e) => {
        if (e.code == 'Space') {
            birdVelocity = flapSpeed;
        }
    }

    document.querySelector('.restart-button').addEventListener('click',()=>{
        hideEndMenu();
        resetGame();
        loop();
    });

    function increaseScore() {
        if(birdX > pipeX + pipeWidth && 
            (birdY < pipeY + pipeGap || 
            birdY + birdHeight > pipeY + pipeGap)&& !scored){
                score++;
                scoreDiv.innerHTML = score;
                scored = true;
        }

        if(birdX < pipeX + pipeWidth){
            scored = false;
        }
    }

    function collisionCheck() {
        // Create box Bird and Pipes
        const birdBox = {
            x: birdX,
            y: birdY,
            width: birdWidth,
            height: birdHeight
        }

        const topPipeBox = {
            x: pipeX,
            y: pipeY - pipeGap + birdHeight,
            width: pipeWidth,
            height: pipeY
        }

        const bottomPipeBox = {
            x: pipeX,
            y: pipeY + pipeGap + birdHeight,
            width: pipeWidth,
            height: canvas.height - pipeY - pipeGap
        }

        // Check colision with upper pipe box
        if (birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y) {
            return true;
        }

        // Check colision with lower pipe box
        if (birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width && birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
        }

        // Check boundaries
        if (birdY < 0 || birdY + birdHeight > canvas.height) {
            return true;
        }

        return false;
    }

    function hideEndMenu() {
        document.getElementById('end-menu').style.display = 'none';
        gameContainer.classList.remove('backdrop-blur');

    }

    function showEndMenu() {
        document.getElementById('end-menu').style.display = 'block';
        gameContainer.classList.add('backdrop-blur');
        document.querySelector('.end-score').innerHTML = score;

        if(highScore < score){
            highScore = score;
        }

        document.querySelector('.best-score').innerHTML = highScore;


    }

    function resetGame() {
        // Reset values
        birdX = 50,
        birdY = 50,
        birdVelocity = 0,
        birdAcceleration = 0.1;

        pipeX = 400,
        pipeY = canvas.height - 200;

        score = 0;
        scoreDiv.innerHTML = 0;
    }

    function endGame() {
        showEndMenu();
    }

    function loop() {
        // reset ctx
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bird
        ctx.drawImage(flappyImg, birdX, birdY);

        // Draw Pipes
        ctx.fillStyle = '#333';
        ctx.fillRect(pipeX, -100, pipeWidth, pipeY);
        ctx.fillRect(pipeX, pipeY + pipeGap, pipeWidth, canvas.height - pipeY);

        // Collision Check
        if (collisionCheck()) {
            endGame();
            return;
        }

        // Move pipes
        pipeX -= 3.0;
        if (pipeX < -50) {
            pipeX = 400;
            pipeY = Math.random() * (canvas.height - pipeGap) + pipeWidth;
        }

        // Gravity Bird
        birdVelocity += birdAcceleration;
        birdY += birdVelocity;

        increaseScore();
        requestAnimationFrame(loop);
    }

    loop();
});