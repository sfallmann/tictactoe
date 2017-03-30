
'use strict';

var X = 'X';
var O = 'O';
var WIN = 1;
var COMPUTER ='Computer';

function Board(){
  this.squares = (new Array(9)).fill(0);
}

function Player(name, shape) {
  this.name = name;
  this.shape = shape;
  this.squares = (new Array(9)).fill(0);
}

Player.prototype = {
  occupySquare: function occupySquare(position) {
    this.squares[position] = 1;
  } 
}

function ComputerPlayer(shape) {
  Player.call(this, COMPUTER, shape);
  this.opponent = this.shape === X ? O : X;
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.constructor = ComputerPlayer;

ComputerPlayer.prototype.chooseSquare = function chooseSquare(board) {

  var empty = emptyBoard(board);
  var position = null;
  

  if (empty) {
    return 8;
  }

  position = this.checkWinConditions(board);

  if (position === null) {
    return this.checkLossConditions(board);
  } else {
    return position;
  }

  return this.checkForPosition(board);

}

ComputerPlayer.prototype.checkWinConditions = function checkWinConditions(board) {

  for (var i = 0; i < 3; i++) {

    // Take win conditions - horizontal
    if (board.squares[i] === this.shape && board.squares[i + 1] === this.shape && !board.squares[i + 2]) {
      return i + 2;
    }

    if (board.squares[i + 1] === this.shape && board.squares[i + 2] === this.shape && !board.squares[i]) {
      return i;;
    }    

    if (board.squares[i] === this.shape && board.squares[i + 2] === this.shape && !board.squares[i + 1]) {
      return i + 1;
    }    

    // Take win conditions - vertical
    if (board.squares[i] === this.shape && board.squares[i + 3] === this.shape && !board.squares[i + 6]) {
      return i + 2;
    }

    if (board.squares[i + 3] === this.shape && board.squares[i + 6] === this.shape && !board.squares[i]) {
      return i;
    }    

    if (board.squares[i] === this.shape && board.squares[i + 6] === this.shape && !board.squares[i + 3]) {
      return i + 1;
    }

    // Take win conditions - diagonal
    if (board.squares[i] === this.shape && board.squares[i + 3] === this.shape && !board.squares[i + 6]) {
      return i + 2;
    }

    if (board.squares[i + 3] === this.shape && board.squares[i + 6] === this.shape && !board.squares[i]) {
      return i;
    }    

    if (board.squares[i] === this.shape && board.squares[i + 6] === this.shape && !board.squares[i + 3]) {
      return i + 1;
    }        
  } 
  return null; 
}

ComputerPlayer.prototype.checkLossConditions = function checkLossConditions(board) {

  for (var i = 0; i < 3; i++) {

    // Prevent loss conditions - horizontal
    if (board.squares[i] === this.opponent && board.squares[i + 1] === this.opponent && !board.squares[i + 2]) {
      return i + 2;
    }

    if (board.squares[i + 1] === this.opponent && board.squares[i + 2] === this.opponent && !board.squares[i]) {
      return i;;
    }    

    if (board.squares[i] === this.opponent && board.squares[i + 2] === this.opponent && !board.squares[i + 1]) {
      return i + 1;
    }    

    // Prevent loss conditions - vertical
    if (board.squares[i] === this.opponent && board.squares[i + 3] === this.opponent && !board.squares[i + 6]) {
      return i + 2;
    }

    if (board.squares[i + 3] === this.opponent && board.squares[i + 6] === this.opponent && !board.squares[i]) {
      return i;
    }    

    if (board.squares[i] === this.opponent && board.squares[i + 6] === this.opponent && !board.squares[i + 3]) {
      return i + 1;
    }

    // Prevent loss conditions - diagonal
    if (board.squares[i] === this.opponent && board.squares[i + 3] === this.opponent && !board.squares[i + 6]) {
      return i + 2;
    }

    if (board.squares[i + 3] === this.opponent && board.squares[i + 6] === this.opponent && !board.squares[i]) {
      return i;
    }    

    if (board.squares[i] === this.opponent && board.squares[i + 6] === this.opponent && !board.squares[i + 3]) {
      return i + 1;
    }        
  } 
  return null; 
}

ComputerPlayer.prototype.checkForPosition = function checkForPosition(board) {

  // Take corner positions
  if (board.squares[0] === this.shape && !board.squares[2]) {
    return 2;
  }

  if (board.squares[2] === this.shape && !board.squares[0]) {
    return 0;
  }

  if ((board.squares[0] === this.shape || board.squares[2] == this.shape) && !board.squares[6]) {
    return 6;
  }    

  if ((board.squares[0] === this.shape || board.squares[2] == this.shape) && !board.squares[8]) {
    return 8;
  }
 
  if (board.squares[6] === this.shape && !board.squares[8]) {
    return 8;
  }

  if (board.squares[8] === this.shape && !board.squares[6]) {
    return 6;
  }

  if ((board.squares[6] === this.shape || board.squares[8] == this.shape) && !board.squares[0]) {
    return 0;
  }    

  if ((board.squares[6] === this.shape || board.squares[8] == this.shape) && !board.squares[2]) {
    return 2;
  }  

  for (var i = 0; i < 9; i++) {
    if (!board.squares[i]){
      return i;
    }
  }
}


function Game(player1, player2) {
  
  this.board = new Board();
  
  this.player1 = player1;
  this.player2 = player2;
  
  this.currentPlayer = player1;

}

Game.prototype = {

  playTurn: function playTurn(position) {
    this.currentPlayer.occupySquare(position);
    this.board.squares[position] = this.currentPlayer.shape;
  },

  checkWin: function checkWin() {

    var squares = this.currentPlayer.squares;

    for (var i = 0; i < 3; i++) {   
      if (squares[i] && squares[i + 1] && squares[i + 2]){
        return WIN;
      }

      if (squares[i] && squares[i + 3] && squares[i + 6]){
        return WIN;
      }      
    }

    if (squares[0] && squares[4] && squares[8]) {
      return WIN;
    }

    if (squares[2] && squares[4] && squares[6]) {
      return WIN;
    }    

    this.currentPlayer === this.player1 
      ? this.currentPlayer = this.player2 : this.currentPlayer = this.player1;

    return 0;
  }
}

function emptyBoard(board){

  for (var i = 0; i < 9; i++){
    if (board.squares[i]) {
      return false;
    }
  }

  return true;
}