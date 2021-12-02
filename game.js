const sprites = new Image()
sprites.src = 'sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const hitSound = new Audio()
hitSound.src = 'sounds/hit.wav'

const jumpSound = new Audio()
jumpSound.src = 'sounds/pulo.wav'


const gameOverSound = new Audio()
gameOverSound.src = 'sounds/caiu.wav'

frames = 0

////// COMPONENTS //////

// BACKGROUND
const back = {
	Xi: 115,  // posição inical de recorte
	Yi: 0,
	w: 551, // tamanho do recorte
	h: 204,
	Xp: 0,  // posição de colagem
	Yp: canvas.height -200, 
	draw() {
		ctx.fillStyle = '#70c5ce' // cor de fundo
		ctx.fillRect(0, 0, canvas.width, canvas.height)  //aplica a cor por todo o fundo
		ctx.drawImage(
		sprites, 
		back.Xi, back.Yi,
		back.w, back.h,
		back.Xp, back.Yp,
		back.w, back.h,  //dimenções da colagem
		)
	}
}


// FLOOR
const floor = {
	Xi: 0,  // posição inical de recorte
	Yi: 610,
	w: 600, // tamanho do recorte
	h: 111,
	Xp: 0,  // posição de colagem
	Yp: canvas.height - 111,
	moving() {
		floor.Xp -= 2
		if (floor.Xp <= - 112) {
			floor.Xp = 0
		}
	},
	draw() {
		ctx.drawImage(
		sprites, 
		floor.Xi, floor.Yi,
		floor.w, floor.h,
		floor.Xp, floor.Yp,
		floor.w, floor.h, //dimenções da colagem
		)
	} 

}

// MESSAGE GET READY
const messageGetReady = {
	Xi: 380,  // posição inical de recorte
	Yi: 232,
	w: 173, // tamanho do recorte
	h: 151,
	Xp: canvas.width/2 - 173/2,  // posição de colagem
	Yp: canvas.height/2 - 151/2,
	draw() {
		ctx.drawImage(
		sprites, 
		messageGetReady.Xi, messageGetReady.Yi,
		messageGetReady.w, messageGetReady.h,
		messageGetReady.Xp, messageGetReady.Yp,
		messageGetReady.w, messageGetReady.h, //dimenções da colagem
		)
	} 

}

// SCOREBOARD

const scoreBoard = {
	Xi: 123,  // posição inical de  recorte
	Yi: 278,
	w: 226, // tamanho do recorte
	h: 180,
	Xp: canvas.width/2 - 226/2,  // posição de colagem
	Yp: canvas.height/2 - 180/2,
	score: 30,

	draw() {
		ctx.drawImage(
		sprites, 
		scoreBoard.Xi, scoreBoard.Yi,
		scoreBoard.w, scoreBoard.h,
		scoreBoard.Xp, scoreBoard.Yp,
		scoreBoard.w, scoreBoard.h, //dimenções da colagem
		)
	}

}

// GAMEOVER 

const gameOver = {
	Xi: 142,  // posição inical de recorte
	Yi: 234,
	w: 190, // tamanho do recorte
	h: 39,
	Xp: canvas.width/2 - 190/2,  // posição de colagem
	Yp: canvas.height/2 - 270/2,

	draw() {
		ctx.drawImage(
		sprites, 
		gameOver.Xi, gameOver.Yi,
		gameOver.w, gameOver.h,
		gameOver.Xp, gameOver.Yp,
		gameOver.w, gameOver.h, //dimenções da colagem
		)
	}

}

// MEDAL

const medal = {
	Xi: 603,  // posição inical de recorte
	Yi: 500,
	w: 44, // tamanho do recorte
	h: 44,
	Xp: 73,  // posição de colagem
	Yp: canvas.height/2 - 46,
	draw() {
		ctx.drawImage(
		sprites, 
		medal.Xi, medal.Yi,
		medal.w, medal.h,
		medal.Xp, medal.Yp,
		medal.w, medal.h, //dimenções da colagem
		)
	},
	result() {
		if (scoreBoard.score >= 100) {
			medal.Yi = 231
		}else if (scoreBoard.score >= 75) {
			medal.Yi = 275
		}else if (scoreBoard.score >= 50) {
			medal.Yi = 319
		}else if (scoreBoard.score >= 25){
			medal.Yi = 363
		}

	}

}


// BIRD
const bird = {
	Xi: 0,  // posição inical de recorte
	Yi: 0,
	w: 35, // tamanho do recorte
	h: 24,
	Xp: 10,  // posição de colagem
	Yp: 50,
	fallTime: 0,
	gravity() {
		bird.fallTime += 1
		bird.Yp += Math.pow(bird.fallTime,0.4)
	},
	flapWings() {
		if (frames % 5 == 0) {
			bird.Yi += 26
		}
		if (bird.Yi == 78) {
			bird.Yi = 0
		}

	},
	draw() {
		ctx.drawImage( 
		sprites, 
		bird.Xi, bird.Yi,
		bird.w, bird.h,
		bird.Xp, bird.Yp,
		bird.w, bird.h,  //dimenções da colagem
		)
	},
	jump() {
		jumpSound.play()
		bird.Yp -= 50
		bird.fallTime = 3


	},
	collison() {
		//colisão com chão
		if (bird.Yp >= (canvas.height - floor.h - 15)) { 
			hitSound.play()
			changeScreen(screens.gameOver)
		}
	},
	startScreen() {
		bird.Yp = canvas.height/2
	},

}

////// END COMPONENTS //////

////// SCREENS //////

let screenOn = {}	
function changeScreen(newScreen){
	screenOn = newScreen
}

const screens = {
	game: {
		draw() {
		// desenha
		back.draw()
		floor.draw()
		bird.draw()
		

		},
		efects() {
		bird.gravity() 
		bird.flapWings()
		floor.moving()
		bird.collison()

		},
		click() {
			bird.jump()
		}
	},
	start: {
		draw() {
		// desenha
		back.draw()
		floor.draw()
		bird.draw()
		bird.startScreen()
		messageGetReady.draw()

		},
		efects() {
		bird.flapWings()
		floor.moving()

		},
		click() {
			changeScreen(screens.game)
			bird.jump()
		}
		
	},
	gameOver: {
		draw() {
		// desenha
		gameOver.draw()
		scoreBoard.draw()
		medal.draw()
		medal.result()
		},
		efects() {

		},
		click() {
			changeScreen(screens.start)
		}
	}
}

////// END SCREENS //////


//// LOOP ////



function loop() {
	screenOn.draw()
	screenOn.efects()
	requestAnimationFrame(loop)
	frames += 1
}

//// END LOOP ////


window.addEventListener('click',function(){
	if (screenOn.click) {
		screenOn.click()
	}
})

changeScreen(screens.start)

loop()