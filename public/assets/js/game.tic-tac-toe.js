
;
(function(window, _){
  'use strict';
  if(typeof require !== 'undefined'){
    var _ = require('lodash');
  }

  var GAMESTATES = {
    DRAW: 'DRAW',
    CONTINUE: 'CONTINUE'    
  }

  window.GAMESTATES = window.GAMESTATES || GAMESTATES;

  // create a grid cols high and rows wide
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

  // iterate through all the squares
  // return false if one has a token
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

  // returns a tile object
  function returnTile(x, y, token) {
    return {x: x, y: y, token: token}
  }

  // sets token in the location within the board
  // and returns a tile object
  function setTile(board, x, y, token) {
    board[x][y] = token;
    return returnTile(x, y, token);
  }

  function computerTurn(state, computer, opponent){

    // on the first turn randomly pick a corner
    // otherwise the computer will always pick 0,0 every single time
    if (state.counter === 0){
      var random = Math.floor(Math.random() * (4)) + 1;
      switch (random) {
        case 1:
          return {x: 0, y: 0};
        case 2:
          return {x: 2, y: 0};
        case 3:
          return {x: 0, y: 2};
        case 4:
          return {x: 2, y: 2};        
      }

    }

    var choice;

    miniMax(state, 0);
    // choice will be set to the best value that bubbles up
    // from the recursive calls to miniMax
    return choice;
    
    // minimMax algorithm
    function miniMax(state, depth) {
      // check for the win
      var result = checkForWin(state.board, state.counter);

      // if the current player (computer player) is the winner return a positive score
      if (result === computer){
        return 10 - depth;
      // if it's not, return a negative
      } else if (result === opponent) {
        return depth - 10;
      // on a draw return zero
      } else if (result === GAMESTATES.DRAW) {
        return 0;
      }
      // depth is used to reflect the "distance" from the current turn
      depth++;

      var moves = [];
      var scores = [];
      var token = state.players[0].token;
      var newState;

      // iterate through all the empty spaces
      for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++){
          if (!state.board[x][y]) {
            // clone the current state using Lodash's cloneDeep
            newState = _.cloneDeep(state);
            // set the current player token in the empty tile 
            newState.board[x][y] = token;
            // increment the turn counter
            newState.counter++;
            // change players
            changePlayers(newState.players);
            // recursively call miniMax pushing the new state with the
            // move taken and the depth and push the result to scores
            scores.push(miniMax(newState, depth))
            // push the x,y of the tile that was filled with the player's token
            moves.push({x: x, y: y});
          }
        }
      }
      // if it's the current player (ie computer player)
      if (token === computer){
        // get the highest value in scores
        var maxValue = scores.reduce(function(acc, curr){
          return Math.max(acc, curr);
        });
        // get the index of the highest value
        var maxIndex = scores.indexOf(maxValue);
        // set choice to the element in the moves array corresponding
        // to the score in the scores array
        choice = moves[maxIndex];
        // return the value of the highest score
        return scores[maxIndex];
      }
      // if it's the opponent do the same as above
      // except get the lowest value
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
  // create the state object from the game object
  function createState(prevState){
    return {
      board: prevState.board.slice(),
      players: prevState.players.slice(),
      counter: prevState.counter
    }
  }

  function checkForWin(board, counter) {

    for (var x = 0, y = 0; x < 3, y < 3; x++, y++) {
      // check vertically
      if ((board[x][0] === board[x][1] && board[x][1] === board[x][2]) && board[x][0]){
        return board[x][0];
      }
      // check horizontally
      if ((board[0][y] === board[1][y] && board[1][y] === board[2][y]) && board[0][y]){
        return board[0][y];
      }   
    }
    // check diagonal
    if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) && board[0][0]){
      return board[0][0];
    } 
    // check the other diagonal
    if ((board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[0][2]){
      return board[0][2];
    } 
    // check the count
    if (counter === 9){
      return GAMESTATES.DRAW;
    }
    // otherwise continue
    return GAMESTATES.CONTINUE;
  }
  // rotate players
  function changePlayers(players){
    var player = players.pop();
    players.unshift(player);
  }

  window.TicTacToe = window.TicTacToe || function TicTacToe(p1, p2) {

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

        // if it's the computer player, get the choice from computerTurn
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
      },
      checkForWin: checkForWin
    }

  }
})(window, _);
