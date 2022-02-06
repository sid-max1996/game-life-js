class Thread {
  constructor(script, info) {
    this.worker = new Worker(script);
    this.info = info;
  }

  async doOperation(data) {
    if (!this.worker) {
      throw new Error('Worker was terminated');
    }
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        resolve(e.data);
      }
  
      this.worker.onerror = (err) => {
        reject(err);
      }

      this.worker.postMessage(data);
    });
  }

  terminate() {
    if (!this.worker) {
      throw new Error('Worker was terminated');
    }
    this.worker.terminate();
    this.worker = null;
  }
  
}
