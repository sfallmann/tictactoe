
'use strict';

var X = 'X';
var O = 'O';
var WIN = 'WIN';
var NOWIN = "NOWIN";
var DRAW = "DRAW";

var COMPUTER ='Computer';



function Board(){
  this.squares = [];
  
  for (var i = 0; i < 9; i++){
     this.squares[i] = '';
  }
}


function Player(name, shape) {
  this.name = name;
  this.shape = shape;
}


Player.prototype = {
  occupySquare: function occupySquare(board) {
    board.squares[this.getMove()] = this.shape;
  } 
}

Player.prototype.getMove = function getMove(position) {
  return position;
}

function ComputerPlayer(name, shape) {
  this.name = name;
  this.shape = shape;
  this.opponent = this.shape === X ? O : X;
}

ComputerPlayer.prototype = {};

ComputerPlayer.prototype.occupySquare = function occupySquare(board) {

  var empty = emptyBoard(board);
  var position = null;
  
  if (empty) {
    board.squares[8] = this.shape;
    return 8;
  }

  position = this.checkWinConditions(board);
  console.log(position)
  if (position) {
    board.squares[position] = this.shape;
    console.log(position)
    return position;
  }
  
  position = this.checkLossConditions(board);

  if (position) {
    board.squares[position] = this.shape;
    console.log(position)
    return position;
  }

  position = this.checkForPosition(board);


  board.squares[position] = this.shape;
  console.log(position);
  return position;

}

ComputerPlayer.prototype.checkWinConditions = function checkWinConditions(board) {

  for (var i = 0; i < 7; i += 3) {

    // Take win conditions - horizontal
    if (board.squares[i] === this.shape && board.squares[i + 1] === this.shape && board.squares[i + 2] === '') {
      return i + 2;
    }

    if (board.squares[i + 1] === this.shape && board.squares[i + 2] === this.shape && board.squares[i]  === '') {
      return i;;
    }    

    if (board.squares[i] === this.shape && board.squares[i + 2] === this.shape && board.squares[i + 1]  === '') {
      return i + 1;
    }    

    // Take win conditions - vertical
    if (board.squares[i] === this.shape && board.squares[i + 3] === this.shape && board.squares[i + 6]  === '') {
      return i + 2;
    }

    if (board.squares[i + 3] === this.shape && board.squares[i + 6] === this.shape && board.squares[i]  === '') {
      return i;
    }    

    if (board.squares[i] === this.shape && board.squares[i + 6] === this.shape && board.squares[i + 3] === '') {
      return i + 1;
    }

    // Take win conditions - diagonal
    if (board.squares[i] === this.shape && board.squares[i + 3] === this.shape && board.squares[i + 6]  === '') {
      return i + 2;
    }

    if (board.squares[i + 3] === this.shape && board.squares[i + 6] === this.shape && board.squares[i]  === '') {
      return i;
    }    

    if (board.squares[i] === this.shape && board.squares[i + 6] === this.shape && board.squares[i + 3]  === '') {
      return i + 1;
    }        
  } 
  return null; 
}

ComputerPlayer.prototype.checkLossConditions = function checkLossConditions(board) {

  for (var i = 0; i < 7; i += 3) {

    // Prevent loss conditions - horizontal
    if (board.squares[i] === this.opponent && board.squares[i + 1] === this.opponent && board.squares[i + 2] === '') {
      return i + 2;
    }

    if (board.squares[i + 1] === this.opponent && board.squares[i + 2] === this.opponent && board.squares[i] === '') {
      return i;;
    }    

    if (board.squares[i] === this.opponent && board.squares[i + 2] === this.opponent && board.squares[i + 1] === '') {
      return i + 1;
    }    

    // Prevent loss conditions - vertical
    if (board.squares[i] === this.opponent && board.squares[i + 3] === this.opponent && board.squares[i + 6] === '') {
      return i + 2;
    }

    if (board.squares[i + 3] === this.opponent && board.squares[i + 6] === this.opponent && board.squares[i]  === '') {
      return i;
    }    

    if (board.squares[i] === this.opponent && board.squares[i + 6] === this.opponent && board.squares[i + 3]  === '') {
      return i + 1;
    }

    // Prevent loss conditions - diagonal
    if (board.squares[i] === this.opponent && board.squares[i + 3] === this.opponent && board.squares[i + 6]  === '') {
      return i + 2;
    }

    if (board.squares[i + 3] === this.opponent && board.squares[i + 6] === this.opponent && board.squares[i]  === '') {
      return i;
    }    

    if (board.squares[i] === this.opponent && board.squares[i + 6] === this.opponent && board.squares[i + 3] === '') {
      return i + 1;
    }        
  } 
  return null; 
}

ComputerPlayer.prototype.checkForPosition = function checkForPosition(board) {

  // Take corner positions
  if (board.squares[0] === this.shape && board.squares[2] === '') {
    return 2;
  }

  if (board.squares[2] === this.shape && board.squares[0] === '') {
    return 0;
  }

  if ((board.squares[0] === this.shape || board.squares[2] == this.shape) && board.squares[6] === '') {
    return 6;
  }    

  if ((board.squares[0] === this.shape || board.squares[2] == this.shape) && board.squares[8] === '') {
    return 8;
  }
 
  if (board.squares[6] === this.shape && board.squares[8] === '') {
    return 8;
  }

  if (board.squares[8] === this.shape && board.squares[6] === '') {
    return 6;
  }

  if ((board.squares[6] === this.shape || board.squares[8] == this.shape) && board.squares[0] === '') {
    return 0;
  }    

  if ((board.squares[6] === this.shape || board.squares[8] == this.shape) && board.squares[2] === '') {
    return 2;
  }  

  for (var i = 0; i < 9; i++) {
    if (board.squares[i] === ''){
      console.log('returning i', i)
      return i;
    }
  }
}


function Game(player1, player2) {
  
  this.board = new Board();
  this.player1 = player1;
  this.player2 = player2;
  
  this.currentPlayer = player1;
  this.winner;
  this.numRounds = 0;

}

Game.prototype = {


  nextPlayer: function nextPlayer() {
    if (this.currentPlayer === this.player1){
      this.currentPlayer = this.player2
    } else {
      this.currentPlayer = this.player1;
    }
  },
  playersMove: function playersMove() {
    return this.currentPlayer.occupySquare(this.board);
  },

  turn: function turn(){
    var position = this.playersMove();
    var shape = this.currentPlayer.shape;
    setTimeout(function() {
      document.querySelector('#pos-' + position).innerHTML = shape;
    }, 1000);
    
    if (this.checkWin()){
      return WIN;
    }
    this.nextPlayer();
    return NOWIN;
  },

  play: function play() {

    var status;
    var self = this;
    for (var i = 0; i < 9; i++) {
      console.log(this.currentPlayer)
      status = this.turn();

      if (status === WIN){
        break;
      }
    }

    if (status === WIN){
      console.log('winner', this.currentPlayer.name);
    } else {
      console.log('DRAW!');
    }

  },

  checkWin: function checkWin() {

    var squares = this.board.squares;
    var shape = this.currentPlayer.shape;

    for (var i = 0; i < 7; i += 3) {   
      if (squares[i] === shape && squares[i + 1] === shape && squares[i + 2] === shape){
        return true;
      }

      if (squares[i] === shape && squares[i + 3] === shape && squares[i + 6] === shape){
        return true;
      }      
    }

    if (squares[0] === shape && squares[4] === shape && squares[8] === shape) {
      return true;
    }

    if (squares[2] === shape && squares[4] === shape && squares[6] === shape) {
      return true;
    }    

    return false;
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
