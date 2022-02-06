class Board {
  constructor(arr, width, height) {
    if (arr.length !== width * height) {
      throw new Error(`Board arr wrong length: width * height ${arr.length} !== ${width * height}`);
    }
    this.arr = arr;
    this.width = width;
    this.height = height;
  }

  _checkCoords(x, y) {
    if (x < 0 || x >= this.width) {
      throw new Error(`x > width x: ${x} width: ${this.width}`);
    }
    if (y < 0 || y >= this.height) {
      throw new Error(`y > height y: ${y} height: ${this.height}`);
    }
  }

  set(x, y, value) {
    if (![0, 1].includes(value)) {
      throw new Error('value must be 1 or 0');
    }
    this._checkCoords();
    this.arr[y * this.width + x] = value;
  }

  get(x, y) {
    this._checkCoords();
    return this.arr[y * this.width + x];
  }

  doIteration(startY, endY) {
    if (startY < 0 || endY > this.height) {
      throw new Error(`startY < 0 startY: ${startY} or endY > board.height
        endY ${endY} board height ${this.height}`);
    }
    const maxX = this.width - 1;
    const maxY = this.height - 1;

    const decreaseCoord = (coord, maxCoord) => {
      return coord === 0 ? maxCoord : coord - 1;
    }
  
    const increaseCoord = (coord, maxCoord) => {
      return coord === maxCoord ? 0 : coord + 1;
    }

    let changes = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = startY; y < endY; y++) {
        let neighborCount = 0;
        const upX = decreaseCoord(x, maxX);
        const downX = increaseCoord(x, maxX);
        const leftY = decreaseCoord(y, maxY);
        const rightY = increaseCoord(y, maxY);
        if (this.get(upX, y) === 1) neighborCount++;
        if (this.get(upX, rightY) === 1) neighborCount++;
        if (this.get(upX, leftY) === 1) neighborCount++;
        if (this.get(x, rightY) === 1) neighborCount++;
        if (this.get(x, leftY) === 1) neighborCount++;
        if (this.get(downX, y) === 1) neighborCount++;
        if (this.get(downX, rightY) === 1) neighborCount++;
        if (this.get(downX, leftY) === 1) neighborCount++;
        const curValue = this.get(x, y);
        if (![0, 1].includes(curValue)) {
          throw new Error(`value must be 1 or 0 ${curValue} x ${x} y ${y} startY ${startY} endY ${endY}`);
        }
        const newValue = neighborCount >= 2 && neighborCount <= 3 ? 1 : 0;
        if (curValue !== newValue) {
          changes.push({x, y, value: newValue});
        }
      }
    }
    return changes;
  }

  applyChanges(changes) {
    for (const { x, y, value } of changes) {
      this.set(x, y, value);
    }
  }
}
