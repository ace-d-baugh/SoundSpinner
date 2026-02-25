// Sound Spinner - Fixed & Improved JS
// Fixes:
//   - Correct segment detection (pointer angle calculation)
//   - Sound plays exactly when wheel stops
//   - Spin lock prevents double-clicks
//   - Info panel no longer wipes spinner transform
//   - Set buttons disabled while spinning
//   - Animal images moved outside spinner (always upright)
//   - Increased randomness, no two consecutive same segments

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
let totalRotation   = 0;   // cumulative degrees - never reset (keeps CSS transition smooth)
let isSpinning      = false;
let lastSegment     = -1;  // track last landed segment to avoid repeats

// Must match --spin-duration in CSS (in milliseconds)
const SPIN_DURATION_MS = 5000;

// ---- Animal sets ----
// Index 0 = segment at 0-45deg (12 o'clock position), going clockwise
let currentSet = ['turkey', 'horse', 'sheep', 'cat', 'duck', 'dog', 'rooster', 'cow'];

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

  // Pick a target segment that is different from the last one
  var targetSegment = lastSegment;
  while (targetSegment === lastSegment) {
    targetSegment = Math.floor(Math.random() * 8);
  }

  // Calculate a target angle that lands in the middle of the target segment
  // Segment midpoints: 22.5, 67.5, 112.5 ... 337.5 degrees
  // When wheel rotates by X degrees, pointer sees angle (360 - X%360)%360
  // So to land on segment S (midpoint = S*45 + 22.5), we need:
  //   (360 - X%360)%360 = S*45 + 22.5  =>  X%360 = (360 - S*45 - 22.5 + 360)%360
  var segmentMidAngle  = targetSegment * 45 + 22.5;
  var targetRemainder  = (360 - segmentMidAngle + 360) % 360;

  // Add a small random jitter within the segment (+/- 18 degrees) so it
  // doesn't always land dead-center, making it feel more natural
  var jitter = (Math.random() - 0.5) * 36;  // -18 to +18 degrees
  targetRemainder = (targetRemainder + jitter + 360) % 360;

  // Choose a random number of full rotations (3 to 9 full spins)
  var fullSpins = (Math.floor(Math.random() * 7) + 3) * 360;

  // Calculate extra degrees needed beyond current totalRotation
  var currentRemainder = totalRotation % 360;
  var degreesNeeded = (targetRemainder - currentRemainder + 360) % 360;
  if (degreesNeeded < 45) degreesNeeded += 360; // ensure minimum spin
  var extraDeg = fullSpins + degreesNeeded;

  totalRotation += extraDeg;

  // Apply rotation - CSS transition animates it smoothly
  spinner.style.transform = 'rotate(' + totalRotation + 'deg)';

  // Lock UI during spin
  isSpinning  = true;
  spinBtn.disabled = true;

  // Play the correct animal sound when the wheel finishes
  setTimeout(function () {
    var finalAngle   = totalRotation % 360;
    var norm         = ((finalAngle % 360) + 360) % 360;
    var pointerAngle = (360 - norm) % 360;
    var segmentIndex = Math.floor(pointerAngle / 45) % 8;
    var animal       = currentSet[segmentIndex];

    console.log('[SoundSpinner] rotation:', finalAngle,
                '| pointer:', pointerAngle,
                '| segment:', segmentIndex,
                '| animal:', animal);

    var audio = new Audio('sounds/' + animal + '.mp3');
    audio.play().catch(function (err) {
      console.warn('Audio play failed (user gesture may be needed):', err);
    });

    lastSegment      = segmentIndex;
    isSpinning       = false;
    spinBtn.disabled = false;
  }, SPIN_DURATION_MS);
});

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
