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
    getCols: getCols,
    getRows: getRows
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

  function getCols() {
    var cols = [];

    for (var x = 0; x < this.rows(); x++){
      var col = [];
      for (var y = 0; y < this.cols(); y++) {
        col.push(this.tile(x, y).value);
      }
      cols.push(col);
    }
    return cols;
  }

  function getRows() {
    var rows = [];

    for (var y = 0; y < this.cols(); y++){
      var row = [];
      for (var x = 0; x < this.rows(); x++) {
        row.push(this.tile(x, y).value);
      }
      rows.push(row);
    }
    return rows;
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
      return {
        name: this.name(),
        type: this.type(),
        token: this.token()
      };
    }
  }
  function create(_name, _token, _type){
      return Object.assign(Object.create(playerProto), {_name, _token, _type});
  };

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
    winner: undefined,
    chooseTile: chooseTile
  }

  function info(){

    return {
      counter: this.counter(),
      maxTurns: this.maxTurns(),
      players: [this.players[0].info(), this.players[1].info()],
      board: this.board,
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

  function chooseTile() {
    
    var me = this.currentPlayer().token;
    var opponent;

    if (me === 'O') {
      opponent = 'X';
    } else {
      opponent = 'O';
    }

    var choice;
    

    minimax(_.cloneDeep(this), 0);
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
        var potentialGame = _.cloneDeep(game);
        potentialGame.board.tile(tile.x, tile.y, token);
        potentialGame.queueNextPlayer();       

        scores.push(minimax(potentialGame, depth));
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


  function turn(player, x, y) {
    if (player.type === 'computer') {
      var t = this.chooseTile();
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
    var cols = this.board.getCols();
    var rows = this.board.getRows();
    var self =  this;

    cols.forEach(function(col){
      if (col[0] && (col[0] === col[1] && col[1] === col[2])) {
        self.status = COMPLETE;
        self.winner = col[0];
        return true;
      }
    });

    rows.forEach(function(row){
      if (row[0] && (row[0] === row[1] && row[1] === row[2])) {
        self.status = COMPLETE;
        self.winner = row[0];
        return true;
      }
    });

    if (cols[1][1]){

      if (cols[0][0] === cols[1][1] && cols[1][1] === cols[2][2] ||
      cols[0][2] === cols[1][1] && cols[1][1] === cols[2][0]) {
        self.status = COMPLETE;
        self.winner = cols[1][1];
        return true;
      }
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
