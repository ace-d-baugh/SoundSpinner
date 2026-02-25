// Sound Spinner - Fixed & Improved JS
// Fixes:
//   - Correct segment detection (pointer angle calculation)
//   - Sound plays exactly when wheel stops
//   - Spin lock prevents double-clicks
//   - Info panel no longer wipes spinner transform
//   - Set buttons disabled while spinning

'use strict';

// ---- DOM references ----
const spinner   = document.querySelector('.spinner');
const spinBtn   = document.getElementById('spin');
const btnOne    = document.getElementById('setOne');
const btnTwo    = document.getElementById('setTwo');
const btnThree  = document.getElementById('setThree');
const btnHidden = document.getElementById('hidden');
const infoIcon  = document.querySelector('.infoIcon');
const popupInfo = document.querySelector('.popupInfo');
const closeInfo = document.querySelector('.closeInfo');

// ---- State ----
let totalRotation = 0;   // cumulative degrees - never reset (keeps CSS transition smooth)
let isSpinning    = false;

// Must match --spin-duration in CSS (in milliseconds)
const SPIN_DURATION_MS = 5000;

// ---- Animal sets ----
// Index 0 = segment at 0-45deg (12 o'clock position), going clockwise
let currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];

// ---- Set switcher buttons ----
btnOne.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];
  changeImages(currentSet);
});

btnTwo.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['whale', 'lion', 'elephant', 'dinosaur', 'hippo', 'zebra', 'tiger', 'panda'];
  changeImages(currentSet);
});

btnThree.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['hyena', 'otter', 'owl', 'snake', 'bee', 'wolf', 'falcon', 'frog'];
  changeImages(currentSet);
});

btnHidden.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['penguin', 'wave', 'penguin', 'penguin', 'penguin', 'wave', 'penguin', 'penguin'];
  changeImages(currentSet);
});

// ---- Spin logic ----
spinBtn.addEventListener('click', function () {
  if (isSpinning) return;

  // Random extra rotation: 720-2160 degrees (2-6 full turns + random offset)
  var extraDeg = Math.ceil(Math.random() * 1440) + 720;
  totalRotation += extraDeg;

  // Apply rotation - CSS transition animates it smoothly
  spinner.style.transform = 'rotate(' + totalRotation + 'deg)';

  // Lock UI during spin
  isSpinning = true;
  spinBtn.disabled = true;

  // Play the correct animal sound when the wheel finishes
  setTimeout(function () {
    var finalAngle = totalRotation % 360;
    playSoundForAngle(finalAngle);
    isSpinning = false;
    spinBtn.disabled = false;
  }, SPIN_DURATION_MS);
});

/**
 * Determine which segment the fixed pointer (top/12-o'clock) lands on.
 *
 * Segment layout (CSS, 0deg = 12 o'clock, clockwise):
 *   Segment 0  (currentSet[0]):   0deg -  45deg
 *   Segment 1  (currentSet[1]):  45deg -  90deg
 *   Segment 2  (currentSet[2]):  90deg - 135deg
 *   ...and so on clockwise
 *
 * After rotating the wheel clockwise by rotatedDeg degrees, the segment
 * now under the top pointer originally sat at:
 *   pointerAngle = (360 - rotatedDeg % 360) % 360
 *
 * @param {number} rotatedDeg - total rotation modulo 360
 */
function playSoundForAngle(rotatedDeg) {
  var norm         = ((rotatedDeg % 360) + 360) % 360;
  var pointerAngle = (360 - norm) % 360;
  var segmentIndex = Math.floor(pointerAngle / 45) % 8;
  var animal       = currentSet[segmentIndex];

  console.log('[SoundSpinner] rotation:', rotatedDeg,
              '| pointer:', pointerAngle,
              '| segment:', segmentIndex,
              '| animal:', animal);

  var audio = new Audio('sounds/' + animal + '.mp3');
  audio.play().catch(function (err) {
    console.warn('Audio play failed (user gesture may be needed):', err);
  });
}

// ---- Update images when set changes ----
function changeImages(set) {
  var ids = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  ids.forEach(function (id, i) {
    var img = document.getElementById(id);
    img.src = 'img/' + set[i] + '.png';
    img.alt = set[i];
  });
}

// ---- Info panel toggle ----
// NOTE: does NOT touch spinner.style.transform - that would reset the wheel!
function openInfoPanel() {
  infoIcon.innerHTML = 'X';
  popupInfo.style.display = 'block';
}

function closeInfoPanel() {
  infoIcon.innerHTML = '&#9432;';
  popupInfo.style.display = 'none';
}

infoIcon.addEventListener('click', function () {
  if (popupInfo.style.display === 'none' || popupInfo.style.display === '') {
    openInfoPanel();
  } else {
    closeInfoPanel();
  }
});

if (closeInfo) {
  closeInfo.addEventListener('click', closeInfoPanel);
}
