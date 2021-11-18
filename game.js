console.log('space invaders JS')

const sprites = new Image()
sprites.src = 'sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

t = 0 // tempo 


////// COMPONENTS //////

// BACKGROUND
const back = {
	Xi: 115,  // posição inical de recorte
	Yi: 0,
	w: 551, // tamanho do recorte
	h: 204,
	Xp: 0,  // posição de colagem
	Yp: canvas.height - 111 - 203, 
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
		// const repe = 201 / 2
		// const mov = floor.Xp - 2
		// floor.Xp = mov % repe // VER A MATEMATICA POR TRAS 
		floor.Xp -= 2
		if (floor.Xp == -28) {
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

// SCOREboard

const scoreBoard = {
	Xi: 123,  // posição inical de recorte
	Yi: 241,
	w: 226, // tamanho do recorte
	h: 180,
	Xp: canvas.width/2 - 226/2,  // posição de colagem
	Yp: canvas.height/2 - 180/2,
	score: 80,

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
	w: 33, // tamanho do recorte
	h: 23,
	Xp: 10,  // posição de colagem
	Yp: 50,
	gravity() {
		//if (bird.Yp <= (canvas.height - floor.h - 23)) {
		bird.Yp += 1.62*Math.pow(t/25,2)/2 //graviade da lua com tempo letargico
		//}
	},
	flyng() {
		if (t%4 == 0){
			bird.Yi += 26
		}
		if (bird.Yi == 78){
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
		bird.Yp -= 30
		t = 5
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
		// efeitos 
		bird.gravity() 
		bird.flyng()
		floor.moving()

		},
		click() {
			bird.jump()
			t = 0
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
		// efeitos
		bird.flyng()
		floor.moving()

		},
		click() {
			changeScreen(screens.game)
			t = 0
		}
		
	},
	gameOver: {
		draw() {
		// desenha
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
	t += 1 // tempo passando 
	screenOn.draw()
	screenOn.efects()
	requestAnimationFrame(loop)
	if (bird.Yp >= (canvas.height - floor.h - 10)) {
		changeScreen(screens.gameOver)
	}
}

//// END LOOP ////

window.addEventListener('click',function(){
	if (screenOn.click) {
		screenOn.click()
	}
	
})

changeScreen(screens.start)

loop()