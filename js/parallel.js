async function createThreads(workerScript, board, threadCount) {
  const threads = [];
  const rowCount = Math.trunc(board.height / threadCount);
  for (let tI = 0; tI < threadCount; tI++) {
    const startInd = tI * rowCount;
    const endInd = startInd + rowCount - 1;
    const sliceArr = board.arr.slice(startInd * board.width, (endInd + 1) * board.width);
    const thread = new Thread(workerScript, { startInd, endInd });
    if (sliceArr.length !== rowCount * board.width) {
      throw new Error('createThreads sliceArr len !== rowCount');
    }
    await thread.doOperation({
      operation: 'setBoard',
      arr: sliceArr,
      width: board.width,
      height: rowCount
    });
    threads.push(thread);
  }
  return threads;
}

async function doMainIteration(board, threads) {
  const changes = [];
  const promises = [];
  for (let tI = 0; tI < threads.length; tI++) {
    const thread = threads[tI];
    
    const promise = thread.doOperation({
      operation: 'doSubIteration'
    });
    promises.push(promise);
  }
  const threadChanges = await Promise.all(promises);
  for (let tI = 0; tI < threads.length; tI++) {
    const thread = threads[tI];
    // Обработка первой и последней строчки потока
    const subChanges = [];
    const startInd = thread.info.startInd;
    const firstThreadRowChanges = board.doIteration(startInd, startInd + 1);
    changes.push(...firstThreadRowChanges);
    for (const change of firstThreadRowChanges) {
      subChanges.push({ x: change.x, y: change.y - startInd, value: change.value });
    }
    const endInd = thread.info.endInd;
    const lastThreadRowChanges = board.doIteration(endInd, endInd + 1);
    changes.push(...lastThreadRowChanges);
    for (const change of lastThreadRowChanges) {
      subChanges.push({ x: change.x, y: change.y - startInd, value: change.value });
    }
    await thread.doOperation({
      operation: 'doSubChanges',
      changes: subChanges
    });
    // Обработка результатов от потока
    const threadChange = threadChanges[tI];
    for (const change of threadChange) {
      change.y += startInd;
    }
    changes.push(...threadChange);
  }

  const threadCount = threads.length;
  const rowCount = Math.trunc(board.height / threadCount);
  const threadsRowCount = rowCount * threadCount;
  if (threadsRowCount < board.height - 1) {
    const endRowsChanges = board.doIteration(threadsRowCount, board.height);
    changes.push(...endRowsChanges);
  }
  
  board.applyChanges(changes);
  return changes;
}

