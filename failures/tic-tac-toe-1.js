'use strict';

if(typeof require !== 'undefined'){
  var _ = require('lodash');
}

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

  var tileProto = {
    x: undefined,
    y: undefined,
    value: undefined,
    info: info,
  }

  function create(x, y, value){
    return Object.assign(Object.create(tileProto), {x, y, value});
  }

  function info(x, y, token){
    return {
      x: this.x,
      y: this.y,
      value: this.value
    }
  }
 return {
  create: create
 }
})();

var Board = (function(){

  var boardProto = {
    rows: function rows() {return this._rows},
    cols: function cols() {return this._cols},
    TileCtr: function TileCtr() {return this._tileCtr},
    tiles: function tiles() {
      return this._tiles.map(function(tile){
          return tile.info();
      });
    },
    tile: tile,
    isEmpty: isEmpty,
    emptyTiles: emptyTiles,
  }

  function create(_cols, _rows, _tileCtr) {
    var newboard = Object.assign(Object.create(boardProto), {_cols, _rows, _tileCtr});
    newboard._tiles = generate(newboard._cols, newboard._rows, newboard._tileCtr);
    return newboard;
  }

  function generate(cols, rows, tileCtr) {

    var tiles = [];
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        tiles.push(tileCtr.create(j, i, ''));
      }
    }
    return tiles;
  }

  function isEmpty(board){
    for (var i = 0; i < this.tiles.length; i++){
      if (this.tiles()[0].value){
        return false;
      }
    }
    return true;
  }

  function emptyTiles(){
    return this.tiles().filter(function(tile){
      if (!tile.value) {
        return tile;
      }
    })
  }

  function tile(x, y, token){
    var tileFilter = this._tiles.filter(function(tile){
        return tile.x == Number(x) && tile.y == Number(y);
    });
    var tile = tileFilter[0];

    if (token){
      tile.value = token;
    }
    return tile.info();
  }

  return {
    create: create
  }

})();

var Player = (function(){

  var playerProto = {
    name: function name() { return this._name; },
    type: function type() { return this._type; },
    token: function token() { return this._token; },
    info: function info() {
      var player = {
        name: this.name(),
        type: this.type(),
        token: this.token()
      };
      if (player.type === 'computer'){
        player.chooseTile = this.chooseTile
      };
      return player; 
    }
  }

  var computer = { 
    chooseTile: chooseTile
  }

  function create(_name, _token, _type){
    if (_type === 'computer') {
      return Object.assign(Object.create(playerProto), {_name, _token, _type}, computer);
    } else {
      return Object.assign(Object.create(playerProto), {_name, _token, _type});
    }
  }

  function chooseTile(game) {
    
    var me = this.token;
    var opponent;

    if (me === 'O') {
      opponent = 'X';
    } else {
      opponent = 'O';
    }

    var choice;
    
    minimax(_.cloneDeep(game), 0);
    return choice;
    
    function minimax(game, depth) {

      if (game.over()){

        if (game.winner === me){
          return 10 - depth;
        } else if (game.winner === opponent) {
          return depth - 10;
        } else {
          return 0;
        }

      }
      depth++;
      var moves = [];
      var scores = [];
      var token = game.currentPlayer().token;
      game.board.emptyTiles().forEach(function(tile){
        console.log('tile', tile)
        var potentialGame = _.cloneDeep(game);
        potentialGame.board.tile(tile.x, tile.y, token);
        potentialGame.queueNextPlayer();       

        scores.push(minimax(potentialGame, depth));
        moves.push(tile);
      });
      console.log('scores', scores, 'moves', moves)
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

  return {
    create: create
  }

})();

var TicTacToe = (function() {

  var ticTacToeProto = {
    _maxTurns: 9,
    _counter: 0,
    maxTurns: function maxTurns() {return this._maxTurns;},
    counter: function counter(inc) {
      if (inc) {
        this._counter += inc;
      }
      return this._counter;
    },
    turn: turn,
    getPlayer: getPlayer,
    currentPlayer: currentPlayer,        
    queueNextPlayer: queueNextPlayer,
    over: over,
    status: INPROGRESS,
    winner: undefined
  }

  function info(){

    return {
      counter: this.counter(),
      maxTurns: this.maxTurns(),
    }
  }


  function create(p1, p2) {

    var newgame = Object.create(ticTacToeProto);
    
    newgame.board = Board.create(3, 3, Tile);
    newgame.players = [
      Player.create(p1.name, p1.token, p1.type),
      Player.create(p2.name, p2.token, p2.type),
    ]

    return newgame;
  }

  function getPlayer(name){
    return (this.players.filter(function(player){
      return player.name() === name;
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
    this.counter(1);
    var player = this.players.shift();
    this.players.push(player);
    return this.currentPlayer();
  }

  function currentPlayer(){
    var player = this.players[0].info();
    return player;
  }

  function over(){
    var b = this.board;

    for (var i = 0; i < 3; i++) {
      if (compareTiles(b.tile(i,0).value, b.tile(i,1).value, b.tile(i,2).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token() === b.tile(i,0).value;
        }))[0].token();
        return true;
      }

      if (compareTiles(b.tile(0,i).value, b.tile(1,i).value, b.tile(2,i).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token() === b.tile(0,i).value;
        }))[0].token();
        return true;
      }      
    }

    if (compareTiles(b.tile(0,0).value, b.tile(1,1).value, b.tile(2,2).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token() === b.tile(0,0).value;
        }))[0].token();
        return true;
    }
    
    if (compareTiles(b.tile(0,2).value, b.tile(1,1).value, b.tile(2,0).value)) {
        this.status = COMPLETE;
        this.winner = (this.players.filter(function(player){
          return player.token() === b.tile(0,2).value;
        }))[0].token();
        return true;
    }
    if (this.counter() === this.maxTurns()){
      this.status = COMPLETE;
      return true;
    }

    return false;
  }

  return {
    create: create,
  }

})();
