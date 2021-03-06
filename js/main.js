const canvas = document.getElementById('canvas');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const fieldSizeInput = document.getElementById('fieldSizeInput');
const resizeBoardBtn = document.getElementById('resizeBoardBtn');
const startGameBtn = document.getElementById('startGameBtn');
const stopGameBtn = document.getElementById('stopGameBtn');
const iterNumSpan = document.getElementById('iterNumSpan');

let boardWidth = 300;
let boardHeight = 300;
let fieldSize = 5;

// Sets default values in size inputs
widthInput.value = boardWidth;
heightInput.value = boardHeight;
fieldSizeInput.value = fieldSize;

window.game = new Game(canvas, iterNumSpan, boardWidth, boardHeight, fieldSize);

// Resize board btn handler 
resizeBoardBtn.addEventListener('click', () => {
  if (window.game.started) return;
  boardWidth = Number(widthInput.value);
  boardHeight = Number(heightInput.value);
  fieldSize = Number(fieldSizeInput.value);
  window.game = new Game(canvas, iterNumSpan, boardWidth, boardHeight, fieldSize);
});

const disableControls = [widthInput, heightInput, fieldSizeInput, resizeBoardBtn, startGameBtn];
// Start game btn handler 
startGameBtn.addEventListener('click', () => {
  disableControls.forEach(control => control.disabled = true);
  window.game.start();
});

// Stop game btn handler 
stopGameBtn.addEventListener('click', () => {
  disableControls.forEach(control => control.disabled = false);
  window.game.stop();
});

// Setting up starting positions
canvas.addEventListener('click', event => {
  if (window.game.started) return;
  const { offsetX, offsetY } = event;
  const x = Math.floor(offsetX / fieldSize);
  const y = Math.floor(offsetY / fieldSize);
  window.game.toogle(x, y);
});
