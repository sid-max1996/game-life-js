class Board {
  constructor(countY, width, height, indexes = []) {
    this.map = new Map();
    for (const index of indexes) {
      this.map.set(index, true);
    }
    this.width = width;
    this.height = height;
    this.countY = countY;
  }

  clear() {
    this.map.clear();
    for (let i = 0; i < this.countY.length; i++) {
      this.countY[i] = 0;
    }
  }

  _checkCoords(x, y) {
    if (x < 0 || x >= this.width) {
      throw new Error(`x > width x: ${x} width: ${this.width}`);
    }
    if (y < 0 || y >= this.height) {
      throw new Error(`y > height y: ${y} height: ${this.height}`);
    }
  }

  index(x, y) {
    return y * this.width + x;
  }

  set(x, y, value) {
    if (![0, 1].includes(value)) {
      throw new Error('value must be 1 or 0');
    }
    this._checkCoords();
    const index = this.index(x, y);
    const prevValue = this.map.has(index) ? 1 : 0;
    if (value === 1 && prevValue === 0) {
      this.countY[y] += 1;
      this.map.set(index, true);
    } else if (value === 0 && prevValue === 1) {
      this.countY[y] -= 1;
      this.map.delete(index);
    }
  }

  get(x, y) {
    this._checkCoords();
    const index = this.index(x, y);
    return this.map.has(index) ? 1 : 0;
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
    for (let y = startY; y < endY; y++) {
      const upY = decreaseCoord(y, maxY);
      const downY = increaseCoord(y, maxY);
      // Optimization skip lines where there is no life
      if (this.countY[y] === 0 && this.countY[upY] === 0 && this.countY[downY] === 0) {
        continue;
      }
      for (let x = 0; x < this.width; x++) {
        let neighborCount = 0;
        const rightX = decreaseCoord(x, maxX);
        const leftX = increaseCoord(x, maxX);
        if (this.get(rightX, y) === 1) neighborCount++;
        if (this.get(rightX, downY) === 1) neighborCount++;
        if (this.get(rightX, upY) === 1) neighborCount++;
        if (this.get(x, downY) === 1) neighborCount++;
        if (this.get(x, upY) === 1) neighborCount++;
        if (this.get(leftX, y) === 1) neighborCount++;
        if (this.get(leftX, downY) === 1) neighborCount++;
        if (this.get(leftX, upY) === 1) neighborCount++;
        const curValue = this.get(x, y);
        // if (![0, 1].includes(curValue)) {
        //   throw new Error(`value must be 1 or 0 ${curValue} x ${x} y ${y} startY ${startY} endY ${endY}`);
        // }
        let newValue = curValue
        if (curValue === 1 && (neighborCount < 2 || neighborCount > 3)) {
          newValue = 0;
        }
        if (curValue === 0 && neighborCount === 3) {
          newValue = 1;
        }
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
