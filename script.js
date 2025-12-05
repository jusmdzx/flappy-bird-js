// Seleção de elementos
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

// Variáveis de controle
let birdTop = window.innerHeight / 2;
let gravity = 2;
let jumpHeight = 40;
let score = 0;
let time = 0;
let pipes = [];

// Atualiza a posição do pássaro
function fall() {
    birdTop += gravity;
    bird.style.top = `${birdTop}px`;

    // Detecta colisão com o topo ou chão
    if (birdTop <= 0 || birdTop >= window.innerHeight) {
        endGame();
    }

    // Detecta colisões com os canos
    pipes.forEach((pipe) => {
        const pipeRect = pipe.getBoundingClientRect();
        const birdRect = bird.getBoundingClientRect();

        if (
            birdRect.right > pipeRect.left &&
            birdRect.left < pipeRect.right &&
            birdRect.top < pipeRect.bottom &&
            birdRect.bottom > pipeRect.top
        ) {
            endGame();
        }

        // Atualiza a pontuação se o pássaro passar pelo cano
        if (pipeRect.right < birdRect.left && !pipe.passed) {
            score++;
            pipe.passed = true; // Marca o cano como "já passado"
            scoreElement.textContent = `Score: ${score}`;
        }
    });
}

// Faz o pássaro "pular"
function jump() {
    birdTop -= jumpHeight;
    if (birdTop < 0) birdTop = 0; // Impede que o pássaro saia do topo
    bird.style.top = `${birdTop}px`;
}

// Termina o jogo
function endGame() {
    alert(`Game Over! Final Score: ${score} | Time: ${time}s`);
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    location.reload(); // Reinicia o jogo
}

// Atualiza o tempo na tela
function updateTime() {
    time++;
    timeElement.textContent = `Time: ${time}s`;
}

// Gera canos com alturas e espaçamentos aleatórios
function generatePipes() {
    const pipeGap = 200; // Espaço entre os canos
    const minHeight = 50;
    const maxHeight = window.innerHeight - pipeGap - 50;

    const topPipeHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    const bottomPipeHeight = window.innerHeight - topPipeHeight - pipeGap;

    // Cano superior
    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe', 'top');
    topPipe.style.height = `${topPipeHeight}px`;
    topPipe.style.right = '0';
    gameContainer.appendChild(topPipe);

    // Cano inferior
    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.height = `${bottomPipeHeight}px`;
    bottomPipe.style.right = '0';
    gameContainer.appendChild(bottomPipe);

    // Adiciona os canos ao array para detecção de colisão
    pipes.push(topPipe, bottomPipe);

    // Remove os canos fora da tela
    setTimeout(() => {
        topPipe.remove();
        bottomPipe.remove();
        pipes = pipes.filter((pipe) => pipe !== topPipe && pipe !== bottomPipe);
    }, 3000); // Tempo de vida dos canos (igual à duração da animação)
}

// Evento para o salto
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// Inicia os loops do jogo e do tempo
const gameInterval = setInterval(fall, 20);
const pipeInterval = setInterval(generatePipes, 2000); // Gera novos canos a cada 2 segundos
const timeInterval = setInterval(updateTime, 1000);