const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const countdownDisplay = document.getElementById('countdown');
const highScoreDisplay = document.getElementById('high-score');
const backgroundMusic = document.getElementById('background-music');
const smashSound = document.getElementById('smash-sound');

const diamondTypes = [
		{ type: 'regular', points: 1, image: "https://assets.codepen.io/5804361/1.png?format=auto" },
		{ type: 'rare', points: 5, image: "https://assets.codepen.io/5804361/3.png?format=auto" },
		{ type: 'super-rare', points: 10, image: "https://assets.codepen.io/5804361/2.png?format=auto" }
];

const decoys = [
		{ type: 'decoy', points: -2, image: "assets/decoy.jpeg" }
];

backgroundMusic.volume = 0.3;
smashSound.volume = 1.0;

let timeUp = false;
let score = 0;
let highScore = 0;
let lastHole;
let countdown;

window.startGame = function () {
    timeUp = false;
    score = 0;
    updateScoreBoard();
		startCountdown();
		countdownDisplay.textContent = 30;
    popUp();
    backgroundMusic.currentTime = 0; // Start from the beginning each game
    backgroundMusic.play();
}

function startCountdown() {
    let timeRemaining = 30;
    countdown = setInterval(() => {
        timeRemaining--;
        countdownDisplay.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(countdown); // Stop countdown at 0
						countdownDisplay.textContent = '0';
						timeUp = true;
						endGame();
        }
    }, 1000); // Update every second
}

function smash(diamond) {
		if (timeUp) return;
	
    const hammer = diamond.parentNode.querySelector('.hammer');
    hammer.classList.add('smash');
    setTimeout(() => hammer.classList.remove('smash'), 300);

		if (smashSound) {
    		smashSound.currentTime = 0; // Rewind to start for quick consecutive plays
    		smashSound.play();
		}
	
		let points = parseInt(diamond.dataset.points, 10);
		if (isNaN(points)) points = 0;
		score += points;
		scoreBoard.style.color = score >= 0 ? 'green' : 'red';
	
		if (points < 0) {
				scoreBoard.classList.add('warning');
				setTimeout(() => scoreBoard.classList.remove('warning'), 500);
		}
		
		updateScoreBoard();
	
		const pointsFloat = diamond.parentNode.querySelector('.points-float');
		if (pointsFloat) {
				console.log(`Floating points: ${points}`); // Debugging line
				pointsFloat.textContent = points > 0 ? `+${points}` : points;
				pointsFloat.style.color = points > 0 ? 'green' : 'red';
    		
				pointsFloat.style.opacity = '1';
				pointsFloat.style.transform = 'translate(-50%, -50%)';
			
        void pointsFloat.offsetWidth; 
				pointsFloat.classList.add('active');
			
				setTimeout(() => {
            pointsFloat.style.opacity = '0';
						pointsFloat.classList.remove('active');
        }, 1000);
			
				// pointsFloat.addEventListener('animationed', () => {
				// 		pointsFloat.classList.remove('active');
				// }, { once: true });
		}
	
    diamond.classList.add('smashed');
    diamond.parentNode.classList.remove('up');
	
		const shards = diamond.parentNode.querySelectorAll('.shard');
    shards.forEach(shard => {
        shard.classList.add('active');
        setTimeout(() => shard.classList.remove('active'), 500);
    });

    const bursts = diamond.parentNode.querySelectorAll('.burst');
    bursts.forEach(burst => {
        burst.classList.add('active');
        setTimeout(() => burst.classList.remove('active'), 300);
    });
	
		setTimeout(() => {
			diamond.classList.remove('smashed');
		}, 300);
}

function popUp() {
		if (timeUp) return;
		
    let hole = randomHole(holes);
	
		let diamond = hole.querySelector('.diamond');
		diamond.classList.remove('smashed', 'active');
		
		let item = Math.random() < 0.8
				? diamondTypes[Math.floor(Math.random() * diamondTypes.length)]
				: decoys[Math.floor(Math.random() * decoys.length)];
	
		diamond.dataset.points = item.points;
		diamond.dataset.type = item.type;
		diamond.style.backgroundImage = `url(${item.image})`;
	
		let time = randomTime(600,1000);
    
		hole.classList.add('up');

    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) popUp();
    }, time);
}

function updateScoreBoard() {
    scoreBoard.textContent = score;
		scoreBoard.style.color = score >= 0 ? 'green' : 'red';
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    let hole;
    do {
        const index = Math.floor(Math.random() * holes.length);
        hole = holes[index];
    } while (hole === lastHole);
    lastHole = hole;
    return hole;
}

function endGame() {
    timeUp = true;
		clearInterval(countdown);
		countdownDisplay.textContent = '0';
		updateScoreBoard();
		backgroundMusic.pause();
	
		if (score > highScore) {
			highScore = score;
			highScoreDisplay.textContent = highScore;
			
		score = 0;
			updateScoreBoard();
		}
}