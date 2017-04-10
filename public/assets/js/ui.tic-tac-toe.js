;  
(function(window) {
  'use strict';  
  window.ui = window.ui || {
    components: {
      gridObj: document.getElementById('grid-object'),
      name: document.querySelector('[name=firstname]'),
      token: function token(){
        return document.querySelector('[name=token]:checked');       
      },
      startBtn: document.getElementById("start"),
      playAgainBtn: document.getElementById("play-again"),
      modal: document.getElementById("modal"),
      modalMsg: document.getElementById("modal-msg"),
      gameboard: document.getElementById('gameboard'),
      gameoptions: document.getElementById('gameoptions'),
    },
    init: function init(player1, player2) {
      this.game = TicTacToe(player1, player2);    
      this.components.gamegrid = this.components.gridObj.contentDocument;      
      this.components.gamegrid.addEventListener("click", this.clickedSquare.bind(this));
      this.playTurn();
    },
    toggleGameScreens: function() {
      this.components.gameoptions.classList.toggle('hidden');
      this.components.gameboard.classList.toggle('hidden');            
    },
    emptyBoard: function emptyBoard() {
      var tokens = this.components.gamegrid.querySelectorAll('[id*=O-]', '[id*=X-]');
      [].slice.call(tokens).forEach(function(token) {
        token.style.fillOpacity = 0;
      });
    },
    displayMessage: function(msg) {
      var messages = document.querySelector('#messages');
      messages.innerHTML = msg;
    },
    placeToken: function placeToken(target, token) {

      var values = (target.id.split('-'));
      var tokenId = token + '-' + values[1] + '-' + values[2];

      this.components.gamegrid.getElementById(tokenId).style.fillOpacity = 1;
    },
    clickedSquare: function clickedSquare(e) {
      
      var status = this.game.checkForWin(this.game.board, this.game.counter);

      if (status === GAMESTATES.CONTINUE && this.game.players[0].type === 'human') {
        
        if (!e.target.classList.contains('square')) {
          return;
        }

        var values = e.target.id.split('-')

        if (this.game.board[values[1]][values[2]]){
          return;
        }

        var token = this.game.players[0].token;

        this.game.turn(values[1], values[2]);
        this.placeToken(e.target, token);
        this.turnComplete();

      }
    },
    playTurn: function playTurn() {
      this.displayMessage(this.game.players[0].name + '\'s turn');
      if (this.game.players[0].type === 'computer') {
        setTimeout(this.computersTurn.bind(this), 1000);
      }
    },
    computersTurn: function computersTurn() {
      var gridsvg = this.components.gamegrid.getElementById('grid-svg');
      gridsvg.classList.toggle('clickable');

      var token = this.game.players[0].token;
      var tile = this.game.turn();  
      var tokenId = token + '-' + tile.x + '-' + tile.y;

      this.placeToken(this.components.gamegrid.getElementById(tokenId), token);
      gridsvg.classList.toggle('clickable');

      this.turnComplete();       
    },
    turnComplete: function turnComplete() {
      var status = this.game.checkForWin(this.game.board, this.game.counter);

      if (status !== GAMESTATES.CONTINUE){
        this.components.gamegrid.removeEventListener("click", this.clickedSquare);
        if(status !== GAMESTATES.DRAW){
          var player = (this.game.players.filter(function(player){
            return player.token == status;
          }))[0];
          this.displayMessage(player.name + ' has won the game!!!');
        } else {
          this.displayMessage(status);
        }    
        this.components.playAgainBtn.classList.toggle('hidden');
        return;
      }

      this.playTurn();

    },
    playAgain: function() {
      this.emptyBoard();
      this.displayMessage('');
      this.components.playAgainBtn.classList.toggle('hidden');
      this.toggleGameScreens();
    },
    start: function start() {

      if (this.components.token().value === null){
        this.components.startBtn.disabled = true;
        this.components.modalMsg.innerHTML = 'Please select a token!';
        this.components.modal.classList.toggle('hidden');
        return;
      }

      if (!this.components.name.value) {
        this.components.startBtn.disabled = true;
        this.components.modalMsg.innerHTML = 'Please enter your name!';
        this.components.modal.classList.toggle('hidden');
        return;
      }

      var player1, player2;
      if (this.components.token().value === 'O'){
        player1 = {
          name: this.components.name.value,
          token: 'O',
          type: 'human'
        };
        player2 = {
          name: 'Computer',
          token: 'X',
          type: 'computer'
        };
      } else {
        player1 = {
          name: 'Computer',
          token: 'O',
          type: 'computer'
        };  
        player2 = {
          name: this.components.name.value,
          token: 'X',
          type: 'human'
        };     
      }

      this.toggleGameScreens();

      // The xml document is already fired with 
      // using the onload event does not work with Mozilla
      // and Edge
      var doc = this.components.gridObj.contentDocument;
      var test = doc.getElementById('grid-svg');

      if (!test) {
        this.components.gridObj.onload = function() {
        ui.init(player1, player2);  
        }
      } else {
        ui.init(player1, player2);  
      }


    },
    closeModal: function closeModal() {
      this.components.startBtn.disabled = false;
      this.components.modal.classList.toggle('hidden');
    }  
  };
})(window);