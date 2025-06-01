let container = document.querySelector('.container');
let spinner = document.querySelector('.spinner');
let spin = document.getElementById('spin');
let btnOne = document.getElementById('setOne');
let btnTwo = document.getElementById('setTwo');
let btnThree = document.getElementById('setThree');
let btnHidden = document.getElementById('hidden');
let rotations = 0;
let degrees = 0;
var currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];
let infoIcon = document.querySelector('.infoIcon');
let popupInfo = document.querySelector('.popupInfo');

btnOne.onclick = function () {
	currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];
	changeImages(currentSet);
};

btnTwo.onclick = function () {
	currentSet = ['whale', 'lion', 'elephant', 'dinosaur', 'hippo', 'zebra', 'tiger', 'panda'];
	changeImages(currentSet);
};

btnThree.onclick = function () {
	currentSet = ['hyena', 'otter', 'owl', 'snake', 'bee', 'wolf', 'falcon', 'frog'];
	changeImages(currentSet);
};

btnHidden.onclick = function () {
	currentSet = ['penguin', 'wave', 'penguin', 'penguin', 'penguin', 'wave', 'penguin', 'penguin'];
	changeImages(currentSet);
};

spin.onclick = function () {
	rotations += Math.ceil(Math.random() * 720) + 720;
	spinner.style.transform = 'rotate(' + rotations + 'deg)';
	degrees = rotations % 360;
	makeSound(degrees);
};

function makeSound(degrees) {
	setTimeout(function () {
		if (degrees <= 45) {
			var audio = new Audio('sounds/' + currentSet[7] + '.mp3');
			audio.play();
		} else if (degrees <= 90) {
			var audio = new Audio('sounds/' + currentSet[6] + '.mp3');
			audio.play();
		} else if (degrees <= 135) {
			var audio = new Audio('sounds/' + currentSet[5] + '.mp3');
			audio.play();
		} else if (degrees <= 180) {
			var audio = new Audio('sounds/' + currentSet[4] + '.mp3');
			audio.play();
		} else if (degrees <= 225) {
			var audio = new Audio('sounds/' + currentSet[3] + '.mp3');
			audio.play();
		} else if (degrees <= 270) {
			var audio = new Audio('sounds/' + currentSet[2] + '.mp3');
			audio.play();
		} else if (degrees <= 315) {
			var audio = new Audio('sounds/' + currentSet[1] + '.mp3');
			audio.play();
		} else {
			var audio = new Audio('sounds/' + currentSet[0] + '.mp3');
			audio.play();
		}
	}, 5000); // 5 seconds
}

function changeImages(currentSet) {
	document.getElementById('one').src = 'img/' + currentSet[0] + '.png';
	document.getElementById('two').src = 'img/' + currentSet[1] + '.png';
	document.getElementById('three').src = 'img/' + currentSet[2] + '.png';
	document.getElementById('four').src = 'img/' + currentSet[3] + '.png';
	document.getElementById('five').src = 'img/' + currentSet[4] + '.png';
	document.getElementById('six').src = 'img/' + currentSet[5] + '.png';
	document.getElementById('seven').src = 'img/' + currentSet[6] + '.png';
	document.getElementById('eight').src = 'img/' + currentSet[7] + '.png';
}

infoIcon.onclick = function () {
	if (infoIcon.innerHTML == 'X') {
		infoIcon.innerHTML = '&#9432;';
		popupInfo.style = 'display: none;';
		spinner.style = 'display: block;';
		spin.style = 'display: block;';
	} else {
		infoIcon.innerHTML = 'X';
		popupInfo.style = 'display: block;';
		spinner.style = 'display: none;';
		spin.style = 'display: none;';	}
};
