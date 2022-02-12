class Game {
  constructor(canvas, iterEl, width, height, fieldSize) {
    this.started = false;
    this.iterCount = 0;
    this.canvas = canvas;
    this.iterEl = iterEl;
    this.ctx = this.canvas.getContext('2d');
    this.fieldSize = fieldSize;
    this.board = new Board(new Array(width * height).fill(0), width, height);
    this._setCanvasSize();
  }

  _setCanvasSize() {
    this._clear();
    canvas.width = this.fieldSize * this.board.width;
    canvas.height = this.fieldSize * this.board.height;
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _drawField(x, y) {
    this.ctx.fillRect(x * this.fieldSize, y * this.fieldSize, this.fieldSize, this.fieldSize);
  }

  _draw() {
    this._clear();
    for (let x = 0; x < this.board.width; x++) {
      for (let y = 0; y < this.board.height; y++) {
        if (this.board.get(x, y) === 1) {
          this._drawField(x, y);
        }
      }
    }
  }

  firstSet(x, y, value) {
    this.board.set(x, y, value);
    this._drawField(x, y);
  }

  async _doGameIteration() {
    this.iterCount += 1;
    this.iterEl.innerHTML = this.iterCount;
    
    // let t0 = performance.now();
    let changes = [];
    if (this.threads) {
      changes = await doMainIteration(this.board, this.threads);
    } else {
      changes = this.board.doIteration(0, this.board.height)
    }
    // console.log(`Field check iteration ${this.iterCount} took ${performance.now() - t0} milliseconds.`);

    // console.log(`Changes len ${changes.length} iteration ${this.iterCount}`);
    if (!changes.length) return;

    this.board.applyChanges(changes);

    // t0 = performance.now();
    this._draw();
    // console.log(`Draw board iteration ${this.iterCount} took ${performance.now() - t0} milliseconds.`);
    
    if (!this.started) return;
    this.timer = setTimeout(this._doGameIteration.bind(this), 300);
  }

  async start() {
    if (this.started) return;
    this.started = true;
    if (window.Worker) {
      const threadCount =  window.navigator.hardwareConcurrency;
      this.threads = await createThreads('js/worker.js', this.board, threadCount);
    }
    this._doGameIteration();
  }

  stop() {
    if (!this.started) return;
    this.started = false;
    this.iterCount = 0;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.threads) {
      for (const thread of this.threads) {
        thread.terminate();
      }
      this.threads = null;
    }
    this._clear();
    this.iterEl.innerHTML = 0;
  }
}
