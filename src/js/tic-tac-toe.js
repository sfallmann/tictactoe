'use strict';

if(typeof require !== 'undefined'){
  var _ = require('lodash');
}

var DRAW = 'DRAW';
var CONTINUE = 'CONTINUE';

function createBoard(cols, rows) {
  var board = [], col;
  for (var i = 0; i < rows; i++) {
    col = [];
    for (var j = 0; j < cols; j++) {
      col.push('');
    }
    board.push(col);
  }
  return board;
}

function isBoardEmpty(board){
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (board[i][j]){
        return false;
      }
    }
  }
  return true;
}

function returnTile(x, y, token) {
  return {x: x, y: y, token: token}
}

function setTile(board, x, y, token) {
  board[x][y] = token;
  return returnTile(x, y, token);
}

function humanTurn(tile){
  return tile;
}

function computerTurn(state, computer, opponent){

  if (state.counter === 0){
    return {x: 0, y: 0}
  }

  var choice;

  miniMax(state, 0);

  return choice;
  
  function miniMax(state, depth) {
    var result = checkForWin(state.board, state.counter);
    if (result === computer){
      return 10 - depth;
    } else if (result === opponent) {
      return depth - 10;
    } else if (result === DRAW) {
      return 0;
    }

    depth++;

    var moves = [];
    var scores = [];
    var token = state.players[0].token;
    var newState;

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++){
        if (!state.board[x][y]) {
          newState = _.cloneDeep(state);
          newState.board[x][y] = token;
          newState.counter++;
          changePlayers(newState.players);

          scores.push(miniMax(newState, depth))
          moves.push({x: x, y: y});
        }
      }
    }
    if (token === computer){
      var maxValue = scores.reduce(function(acc, curr){
        return Math.max(acc, curr);
      });
      var maxIndex = scores.indexOf(maxValue);
      choice = moves[maxIndex];
      return scores[maxIndex];
    }

    if (token === opponent){
      var minValue = scores.reduce(function(acc, curr){
        return Math.min(acc, curr);
      });
      var minIndex = scores.indexOf(minValue);
      choice = moves[minIndex];
      return scores[minIndex];
    }  

  }
}

function createState(game){
  var state = {
    board: game.board.slice(),
    players: game.players.slice(),
    counter: game.counter
  }
  return state;
}


function checkForWin(board, counter) {

  for (var x = 0, y = 0; x < 3, y < 3; x++, y++) {
    if ((board[x][0] === board[x][1] && board[x][1] === board[x][2]) && board[x][0]){
      return board[x][0];
    }
    if ((board[0][y] === board[1][y] && board[1][y] === board[2][y]) && board[0][y]){
      return board[0][y];
    }   
  }

  if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) && board[0][0]){
    return board[0][0];
  } 

  if ((board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[0][2]){
    return board[0][2];
  } 

  if (counter === 9){
    return DRAW;
  }

  return CONTINUE;
}

function changePlayers(players){
  var player = players.pop();
  players.unshift(player);
}

var TicTacToe = function TicTacToe(p1, p2) {

  var counter = 0;
  var board = createBoard(3, 3);

  return {
    counter: counter,
    players: [p1, p2],
    board: createBoard(3, 3),
    turn: function turn(x, y){
      var tile;
      var token = this.players[0].token
      var type = this.players[0].type;
      if (type === 'computer'){
        var opponent = this.players[1].token;
        var result = computerTurn(createState(this), token, opponent);
        x = result.x;
        y = result.y;
      }
      tile = setTile(this.board, x, y, token)
      this.counter++;
      changePlayers(this.players)
      return tile;
    }
  }
}


var player1 = {
  name: 'Sean',
  token: 'O',
  type: 'computer'
};
var player2 = {
  name: 'Michelle',
  token: 'X',
  type: 'computer'
}
/*
var game = TicTacToe(player1, player2);
var over = false
while(!over){
  
  console.log(game.turn());
  console.log(game.board);
  var result = checkForWin(game.board, game.counter);
  console.log(result)
  if(result !== CONTINUE){
    over = true;
  }

}
*/

