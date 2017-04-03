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

    var iteration  = 0;
    var choice;

    minimax(game, 0, me);
    return choice;

    function score(game, depth) {
      //console.log('depth - score', depth)
      //console.log('gamecounter', game.counter, 'depth', depth)
      if (!game.winner) {
        //console.log('DRAW!!!!!!!!!!!!!')
        return 0;
      } else if (game.winner().token === me) {
        //console.log('in win score')
        return 10;
      } else {
        console.log('in loss score')
        return -10;
      }
    }

    function minimax(game, depth, token) {
      //console.log('depth', depth)
      console.log('empty tiles: ', game.board.emptyTiles().length, 'game over?', game.over())

      if (game.over()){
        //console.log('score', score(game, depth))
        return score(game, depth, token);
      }

      depth += 1;
      var moves = [];
      var scores = [];
      iteration++;
      var counter = 0;
      game.board.emptyTiles().forEach(function(tile){
        var gameClone = _.cloneDeep(game);
        console.log('clone counter - iteration ' + iteration, gameClone.counter)
        gameClone.board.tile(tile.x, tile.y, token)
        gameClone.queueNextPlayer();

        var result = minimax(gameClone, depth, gameClone.currentPlayer().token);
        scores.push(result);
        moves.push(tile);
      })
      console.log('iteration ' + iteration + ' out of foreach')
      console.log(scores)
      if (token === me){
        console.log(me, token)
        var maxIndex = scores.indexOf((scores.reduce(function(acc, curr){
          return Math.max(acc, curr);
        })));
        choice = moves[maxIndex];
        return scores[maxIndex];
      } else {
        console.log(me, token)
        var minIndex = scores.indexOf((scores.reduce(function(acc, curr){
          return Math.min(acc, curr);
        })));  
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
        this.winner = this.currentPlayer;
        return true;
      }

      if (compareTiles(b.tile(0,i).value, b.tile(1,i).value, b.tile(2,i).value)) {
        this.status = COMPLETE;
        this.winner = this.currentPlayer;
        return true;
      }      
    }

    if (compareTiles(b.tile(0,0).value, b.tile(1,1).value, b.tile(2,2).value)) {
        this.status = COMPLETE;
        this.winner = this.currentPlayer;
        return true;
    }
    
    if (compareTiles(b.tile(0,2).value, b.tile(1,1).value, b.tile(2,0).value)) {
        this.status = COMPLETE;
        this.winner = this.currentPlayer;
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
//console.log(game.counter, game.board)
game.turn(game.currentPlayer(), 1, 1);
game.queueNextPlayer();
//console.log(game.counter, game.board)
game.turn(game.currentPlayer())
//game.queueNextPlayer();
//console.log(game.counter, game.board)
//game.turn(game.currentPlayer(), 1, 0);
//game.queueNextPlayer();
//console.log(game.counter, game.board)
//game.turn(game.currentPlayer())
//game.queueNextPlayer();
//console.log(game.counter, game.board)