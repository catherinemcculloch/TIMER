// === MAIN TIMER LOGIC ===

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const modeLabel = document.getElementById("mode-label");
const sessionLog = document.getElementById("session-log");
const editMinutesInput = document.getElementById("edit-minutes");
const editSecondsInput = document.getElementById("edit-seconds");
const applyTimeBtn = document.getElementById("apply-time-btn");

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

let totalSeconds = FOCUS_MINUTES * 60;
let remaining = totalSeconds;
let interval = null;
let isRunning = false;
let isFocus = true;
let elapsedSeconds = 0;
let chimeTriggered = false;

startBtn.addEventListener("click", function () {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  elapsedSeconds = 0;
  chimeTriggered = false;

  interval = setInterval(function () {
    remaining--;
    elapsedSeconds++;
    updateDisplay();

    // Play chime after 5 minutes
    if (elapsedSeconds === 300 && !chimeTriggered) {
      playChime();
      chimeTriggered = true;
    }

    if (remaining <= 0) {
      clearInterval(interval);
      isRunning = false;
      logSession(isFocus ? "Focus" : "Break", isFocus ? FOCUS_MINUTES : BREAK_MINUTES);

      // switch mode
      isFocus = !isFocus;
      remaining = (isFocus ? FOCUS_MINUTES : BREAK_MINUTES) * 60;
      totalSeconds = remaining;
      modeLabel.textContent = isFocus ? "Focus" : "Break";
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }, 1000);
});

pauseBtn.addEventListener("click", function () {
  clearInterval(interval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

resetBtn.addEventListener("click", function () {
  clearInterval(interval);
  isRunning = false;
  isFocus = true;
  remaining = FOCUS_MINUTES * 60;
  totalSeconds = remaining;
  elapsedSeconds = 0;
  chimeTriggered = false;
  modeLabel.textContent = "Focus";
  updateDisplay();
  syncInputs();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

applyTimeBtn.addEventListener("click", function () {
  if (isRunning) return;
  applyTime();
});

function updateDisplay() {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  timerEl.textContent = pad(m) + ":" + pad(s);
}

function syncInputs() {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  editMinutesInput.value = m;
  editSecondsInput.value = s;
}

function applyTime() {
  var minutes = parseInt(editMinutesInput.value) || 0;
  var seconds = parseInt(editSecondsInput.value) || 0;

  // Clamp values
  minutes = Math.max(0, Math.min(99, minutes));
  seconds = Math.max(0, Math.min(59, seconds));

  // Update state
  remaining = minutes * 60 + seconds;
  totalSeconds = remaining;

  // Update inputs and display
  editMinutesInput.value = minutes;
  editSecondsInput.value = seconds;
  updateDisplay();
}

function playChime() {
  try {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var now = audioContext.currentTime;

    // Create oscillator for the chime
    var osc = audioContext.createOscillator();
    var gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    // Double chime - two tones
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(1000, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    // AudioContext not available, fail silently
  }
}
