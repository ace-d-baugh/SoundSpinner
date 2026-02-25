// Sound Spinner - Fixed & Improved JS
// Features:
//   - Ferris wheel effect: images orbit with wheel but always face upright
//   - Correct segment detection
//   - Sound plays exactly when wheel stops
//   - Spin lock prevents double-clicks
//   - Info panel does not reset wheel
//   - Smarter randomness: no consecutive repeat segments

'use strict';

// ---- DOM references ----
const spinner     = document.querySelector('.spinner');
const spinBtn     = document.getElementById('spin');
const btnOne      = document.getElementById('setOne');
const btnTwo      = document.getElementById('setTwo');
const btnThree    = document.getElementById('setThree');
const btnHidden   = document.getElementById('hidden');
const infoIcon    = document.querySelector('.infoIcon');
const popupInfo   = document.querySelector('.popupInfo');
const closeInfo   = document.querySelector('.closeInfo');
const imageDivs   = document.querySelectorAll('.spinner .images');

// ---- State ----
let totalRotation = 0;    // cumulative degrees
let isSpinning    = false;
let lastSegment   = -1;

// Must match --spin-duration in CSS
const SPIN_DURATION_MS = 5000;

// ---- Animal sets ----
let currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];

// Apply initial counter-rotation (0 deg) to all images
updateImageCounterRotation(0);

// ---- Set switcher buttons ----
btnOne.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];
  lastSegment = -1;
  changeImages(currentSet);
});

btnTwo.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['whale', 'lion', 'elephant', 'dinosaur', 'hippo', 'zebra', 'tiger', 'panda'];
  lastSegment = -1;
  changeImages(currentSet);
});

btnThree.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['hyena', 'otter', 'owl', 'snake', 'bee', 'wolf', 'falcon', 'frog'];
  lastSegment = -1;
  changeImages(currentSet);
});

btnHidden.addEventListener('click', function () {
  if (isSpinning) return;
  currentSet = ['penguin', 'wave', 'penguin', 'penguin', 'penguin', 'wave', 'penguin', 'penguin'];
  lastSegment = -1;
  changeImages(currentSet);
});

// ---- Spin logic ----
spinBtn.addEventListener('click', function () {
  if (isSpinning) return;

  // Pick a target segment different from the last one
  var targetSegment = lastSegment;
  while (targetSegment === lastSegment) {
    targetSegment = Math.floor(Math.random() * 8);
  }

  // Calculate angle to land at midpoint of target segment + jitter
  var segmentMidAngle = targetSegment * 45 + 22.5;
  var targetRemainder = (360 - segmentMidAngle + 360) % 360;
  var jitter          = (Math.random() - 0.5) * 36;  // +/- 18 deg
  targetRemainder     = (targetRemainder + jitter + 360) % 360;

  // Random full spins: 3-9 complete rotations
  var fullSpins       = (Math.floor(Math.random() * 7) + 3) * 360;

  // Degrees needed to reach target from current position
  var currentRemainder = totalRotation % 360;
  var degreesNeeded    = (targetRemainder - currentRemainder + 360) % 360;
  if (degreesNeeded < 45) degreesNeeded += 360;
  var extraDeg = fullSpins + degreesNeeded;

  totalRotation += extraDeg;

  // Spin the wheel
  spinner.style.transform = 'rotate(' + totalRotation + 'deg)';

  // FERRIS WHEEL: counter-rotate all images by -totalRotation
  // Each image's CSS transform is: rotate(SEG_ANGLE) translateY(-dist) rotate(-SEG_ANGLE) rotate(var(--counter-rot))
  // Setting --counter-rot = -totalRotation cancels the spinner's rotation,
  // keeping the image upright while it orbits around the center.
  updateImageCounterRotation(-totalRotation);

  // Lock UI
  isSpinning       = true;
  spinBtn.disabled = true;

  // Sound + unlock when wheel stops
  setTimeout(function () {
    var norm         = ((totalRotation % 360) + 360) % 360;
    var pointerAngle = (360 - norm) % 360;
    var segmentIndex = Math.floor(pointerAngle / 45) % 8;
    var animal       = currentSet[segmentIndex];

    console.log('[SoundSpinner] rotation:', totalRotation,
                '| pointer:', pointerAngle,
                '| segment:', segmentIndex,
                '| animal:', animal);

    var audio = new Audio('sounds/' + animal + '.mp3');
    audio.play().catch(function (err) {
      console.warn('Audio play failed:', err);
    });

    lastSegment      = segmentIndex;
    isSpinning       = false;
    spinBtn.disabled = false;
  }, SPIN_DURATION_MS);
});

/**
 * Set the CSS --counter-rot custom property on every .images div.
 * The CSS transform chain uses this variable to keep images upright:
 *   rotate(SEG) translateY(-d) rotate(-SEG) rotate(var(--counter-rot))
 * When --counter-rot == -spinner_rotation, the net image rotation == 0 (upright).
 */
function updateImageCounterRotation(deg) {
  imageDivs.forEach(function (div) {
    div.style.setProperty('--counter-rot', deg + 'deg');
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
