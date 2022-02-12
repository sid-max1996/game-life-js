importScripts('board.js');

let board = null;

onmessage = async (e) => {
  const { operation } = e.data;
  switch(operation) {
    case 'setBoard':
      const { countY, width, height, indexes } = e.data;
      board = createBoard(countY, width, height, indexes);
      postMessage(null);
      break;
    case 'doSubIteration':
      const subChanges = doSubIteration(board);
      postMessage(subChanges);
      break;
    case 'doSubChanges':
      // Главный поток изменяет первую и последнюю строчки
      doSubChanges(board, e.data.changes);
      postMessage(null);
      break;
    default:
      throw Error('unknown operation');
  }
};

function createBoard(arr, countY, width, height, indexes) {
  return new Board(arr, countY, width, height, indexes);
}

function doSubIteration(board) {
  // Не обрабатываем первую и последнюю строки
  const changes = board.doIteration(1, board.height - 1);
  board.applyChanges(changes);
  return changes;
}

function doSubChanges(board, changes) {
  board.applyChanges(changes);
}
