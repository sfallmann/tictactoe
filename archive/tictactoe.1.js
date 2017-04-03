
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


var Player = (function(){

  function opponent(board, x, y, token){
    return board.tile(x,y).value && board.tile(x,y).value !== token;
  }

  function me(board, x, y, token){
    return board.tile(x,y).value === token;
  }  


  function takeWin(board, token){

    var m = me;
    var b = board;

    if ((((m(b, 0, 0, token) && m(b, 2, 2, token)) || (m(b, 0, 2, token) && m(b, 2, 0, token)))) && !b.tile(1, 1).value) {
      return {x: 1, y: 1};
    }   

    if (((m(b, 0, 0, token) && m(b, 1, 1, token))) && !b.tile(2, 2).value) {
      return {x: 2, y: 2};
    }

    if (((m(b, 0, 2, token) && m(b, 1, 1, token))) && !b.tile(2, 2).value) {
      return {x: 2, y: 0};
    }

    if (((m(b, 2, 0, token) && m(b, 1, 1, token))) && !b.tile(0, 2).value) {
      return {x: 0, y: 2};
    }    

    if (((m(b, 2, 2, token) && m(b, 1, 1, token))) && !b.tile(0, 0).value) {
      return {x: 0, y: 0};
    }        

    for (var i = 0; i < 3; i++){

      if (((m(b, i, 0, token) && m(b, i, 1, token))) && !b.tile(i, 2).value) {
        return {x: i, y: 2};
      }

      if (((m(b, i, 2, token) && m(b, i, 1, token))) && !b.tile(i, 0).value) {
        return {x: i, y: 0};
      }

      if (((m(b, 0, i,  token) && m(b, 1, i, token))) && !b.tile(2, i).value) {
        return {x: 2, y: i};
      }      

      if (((m(b, 2, i, token) && m(b, 1, i, token))) && !b.tile(0, i).value) {
        return {x: 0, y: i};
      }

      if (((m(b, i, 0, token) && m(b, i, 2, token))) && !b.tile(i, 1).value) {
        return {x: i, y: 1};
      }

      if (((m(b, 0, i, token) && m(b, 2, i, token))) && !b.tile(1, i).value) {
        return {x: 1, y: i};
      }         

    }


  }

  function preventLoss(board, token){
    var o = opponent;
    var b = board;

    if ((((o(b, 0, 0, token) && o(b, 2, 2, token))) || ((o(b, 0, 2, token) && o(b, 2, 0, token))))  && !b.tile(1, 1).value) {
      return {x: 1, y: 1};
    }   

    if (((o(b, 0, 0, token) && o(b, 1, 1, token))) && !b.tile(2, 2).value) {
      return {x: 2, y: 2};
    }

    if (((o(b, 0, 2, token) && o(b, 1, 1, token))) && !b.tile(2, 2).value) {
      return {x: 2, y: 0};
    }

    if (((o(b, 2, 0, token) && o(b, 1, 1, token))) && !b.tile(0, 2).value) {
      return {x: 0, y: 2};
    }    

    if (((o(b, 2, 2, token) && o(b, 1, 1, token))) && !b.tile(0, 0).value) {
      return {x: 0, y: 0};
    }    

    for (var i = 0; i < 3; i++){
      if (((o(b, i, 0, token) && o(b, i, 1, token))) && !b.tile(i, 2).value) {

        return {x: i, y: 2};
      }

      if (((o(b, i, 2, token) && o(b, i, 1, token))) && !b.tile(i, 0).value) {

        return {x: i, y: 0};
      }

      if (((o(b, 0, i, token) && o(b, 1, i, token))) && !b.tile(2, i).value) {

        return {x: 2, y: i};
      }      

      if (((o(b, 2, i, token) && o(b, 1, i, token))) && !b.tile(0, i).value) {
 
        return {x: 0, y: i};
      }

      if (((o(b, i, 0, token) && o(b, i, 2, token))) && !b.tile(i, 1).value) {

        return {x: i, y: 1};
      }

      if (((o(b, 0, i, token) && o(b, 2, i, token))) && !b.tile(1, i).value) {
        return {x: 1, y: i};
      }         
    }

    return false;
  }


  function chooseTile(board){


    var b = board;
    var o = opponent;
    var m = me;
    var token = this.token;
    var position;
  
    if (b.isEmpty()){
      return {x: 0, y: 0};
    }

    position = takeWin(b, token);

    if (position){
      return position;
    }

    position = preventLoss(b, token);

    if (position){
      return position;
    }

    var emptyTiles = b.emptyTiles();
    var tile = emptyTiles[0];

    return {x: tile.x, y: tile.y};

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
    this.counter ++;

    if (player.type === 'computer') {
      var t = player.chooseTile(this.board);
      return this.board.tile(t.x, t.y, player.token);

    } else {
      return this.board.tile(x, y, player.token);
    }
  }

  function queueNextPlayer(){
    var player = this.players.shift();
    this.players.push(player);
    return this.players[0];
  }

  function currentPlayer(){
    var player = this.players[0];
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


function cloneGame(game){
  var tiles = game.board.tiles.map(function(tile){
    return Object.create(tile);
  })

  var board = Object.create(game.board);
  board.tiles = tiles;

  game = Object.create(game);
  game.board = board;

  return game;
}

var player1 = Player.create('Sean', 'O', 'human');
var player2 = Player.create('Michelle', 'X', 'computer');
var board = Board.create(3, 3, Tile);
var game = TicTacToe.create([player1, player2], board);

var game2 = cloneGame(game);
game.board.tile(0,0,'X');
console.log(game2.board.tile(0,0,'$'), game.board.tile(0,0));