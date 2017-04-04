var _ = require('lodash');
'use strict';

var X = 'X';
var O = 'O';
var COMPLETE ='Completed';
var INPROGRESS = 'INPROGRESS';

function compareTiles(a,b,c) {
  if (a && b && c){
    return a==b && b==c;
  }
  return false;
}

var Tile = (function(){

  function info(x, y, token){
    return {
      x: this.x,
      y: this.y,
      value: this.value
    }
  }

  function create(x, y, value){
    var tile = {
      x: x,
      y: y,
      value: value,
      info: info,
    }
    return Object.assign({}, tile);
  }

    return {
      create: create
    }

})();

var Board = (function(){

  function generate(col, rows, tileCtr) {

    var tiles = [];
    for (var i = 0; i < col; i++) {
      for (var j = 0; j < rows; j++) {
        tiles.push(tileCtr.create(j, i, ''));
      }
    }
    return tiles;
  }

  function isEmpty(board){
    for (var i = 0; i < this.tiles.length; i++){
      if (this.tiles[0].value){
        return false;
      }
    }
    return true;
  }

  function emptyTiles(){
    return this.tiles.filter(function(tile){
      return !tile.value;
    });
  }

  function tile(x, y, token){
    var tile = (this.tiles.filter(function(tile){
        return tile.x == x && tile.y == y;
    }))[0];

    if (token !== undefined){
      tile.value = token;
    }
    return {
      x: tile.x,
      y: tile.y,
      value: tile.value
    }
  }

  function create(cols, rows, tileCtr) {

    var board = {
      cols: cols,
      rows: rows,
      tiles: generate(cols, rows, tileCtr),
      tile: tile,
      isEmpty: isEmpty,
      emptyTiles: emptyTiles
    }

    return Object.assign({}, board);
  }

    return {
      create: create
    }

})();

function cloneGame(game){
  var tiles = game.board.tiles.map(function(tile){
    return Tile.create(tile.x, tile.y, tile.value);
  })

  var board = Board.create(3,3, Tile);
  board.tiles = tiles;
  var players = game.players.map(function(player){ return player });
  game = TicTacToe.create(players, board);
  game.board = board;

  return game;
}



var Player = (function(){

  function chooseTile(game) {

    var me = this.token;
    var opponent;

    if (me === 'O') {
      opponent = 'X';
    } else {
      opponent = 'O';
    }

    var choice;
    
    minimax(_.cloneDeep(game), me);
    return choice;
    
    function minimax(game) {

      if (game.over()){

        if (game.winner === me){
          return 10;
        } else if (game.winner === opponent) {
          return -10;
        } else {
          return 0;
        }

      }

      var moves = [];
      var scores = [];
      var token = game.currentPlayer().token;
      game.board.emptyTiles().forEach(function(tile){
        var potentialGame = _.cloneDeep(game);
        potentialGame.board.tile(tile.x, tile.y, token);
        potentialGame.queueNextPlayer();       

        scores.push(minimax(potentialGame));
        moves.push(tile);
      });
      
      if (token === me){
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

  function create(name, token, type){

    var player = {
      name: name,
      type: type,
      token: token,
    }

    var computer = { 
      chooseTile: chooseTile
    }

    if (type === 'computer') {
      return Object.assign({}, player, computer);
    } else {
      return Object.assign({}, player);
    }

  }

    return {
      create: create
    }

})();

var TicTacToe = (function() {

  function create(players, board, fn) {
      var ticTacToe = {
        players: players,
        board: board,
        maxTurns: 9,
        counter: 0,
        turn: turn,
        getPlayer: getPlayer,
        currentPlayer: currentPlayer,        
        queueNextPlayer: queueNextPlayer,
        over: over,
        status: INPROGRESS,
        winner: ''
      }
      
      return Object.assign({}, ticTacToe);
  }

  function getPlayer(name){
    return (this.players.filter(function(player){
      return player.name === name;
    }))[0];
  }

  function turn(player, x, y) {
    
    if (player.type === 'computer') {
      var t = player.chooseTile(this);
      return this.board.tile(t.x, t.y, player.token);

    } else {
      return this.board.tile(x, y, player.token);
    }
  }

  function queueNextPlayer(){
    this.counter ++;
    var player = this.players.shift();
    //console.log('queued next player', player)
    this.players.push(player);
    return this.players[0];
  }

  function currentPlayer(){
    var player = this.players[0];
    //console.log('current player', player)
    return player;
  }

  function over(){
    var b = this.board;

    for (var i = 0; i < 3; i++) {
      if (compareTiles(b.tile(i,0).value, b.tile(i,1).value, b.tile(i,2).value)) {
        this.status = COMPLETE;
        
        this.winner = (this.players.filter(function(player){
          return player.token === b.tile(i,0).value;
        }))[0].token;
        return true;
      }

      if (compareTiles(b.tile(0,i).value, b.tile(1,i).value, b.tile(2,i).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token === b.tile(0,i).value;
        }))[0].token;
        return true;
      }      
    }

    if (compareTiles(b.tile(0,0).value, b.tile(1,1).value, b.tile(2,2).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token === b.tile(0,0).value;
        }))[0].token;
        return true;
    }
    
    if (compareTiles(b.tile(0,2).value, b.tile(1,1).value, b.tile(2,0).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token === b.tile(0,2).value;
        }))[0].token;
        return true;
    }
    if (this.counter === this.maxTurns){
      this.status = COMPLETE;
      return true;
    }

    return false;
  }

  return {
    create: create,
  }

})();


var player1 = Player.create('Sean', 'O', 'human');
var player2 = Player.create('Michelle', 'X', 'computer');
var board = Board.create(3, 3, Tile);
var game = TicTacToe.create([player1, player2], board);
console.log(game.counter, game.board)
game.turn(game.currentPlayer(), 1, 1);
game.queueNextPlayer();
console.log(game.counter, game.board)
game.turn(game.currentPlayer())
game.queueNextPlayer();
console.log(game.counter, game.board)
game.turn(game.currentPlayer(), 1, 0);
game.queueNextPlayer();
console.log(game.counter, game.board)
game.turn(game.currentPlayer())
game.queueNextPlayer();
console.log(game.counter, game.board)
game.turn(game.currentPlayer(), 2, 2);
game.queueNextPlayer();
console.log(game.counter, game.board)
game.turn(game.currentPlayer())
game.queueNextPlayer();
console.log(game.counter, game.board)