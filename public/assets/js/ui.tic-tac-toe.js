;  
// document.querySelector is used frequently due to
// issue IE had selecting nodes within the loaded document
(function(window) {
  'use strict';  
  window.ui = window.ui || {
    components: {
      gridObj: document.querySelector('#grid-object'),
      name: document.querySelector('[name=firstname]'),
      token: function token(){
        return document.querySelector('[type=radio]:checked');       
      },
      startBtn: document.querySelector("#start"),
      playAgainBtn: document.querySelector("#play-again"),
      modal: document.querySelector("#modal"),
      modalMsg: document.querySelector("#modal-msg"),
      gameboard: document.querySelector('#gameboard'),
      gameoptions: document.querySelector('#gameoptions'),
    },
    init: function init(player1, player2) {
      this.game = TicTacToe(player1, player2);    
      this.components.gamegrid = this.components.gridObj.contentDocument;      
      this.components.gamegrid.addEventListener("click", this.clickedSquare.bind(this));
      this.playTurn();
    },
    toggleGameScreens: function() {
      toggleClass(this.components.gameoptions, 'hidden');  
      toggleClass(this.components.gameboard, 'hidden');     
    },
    emptyBoard: function emptyBoard() {
      var oTokens = this.components.gamegrid.querySelectorAll('[id*=O-]');  
      [].slice.call(oTokens).forEach(function(token) {
        token.style.fillOpacity = 0;
      });

      var xTokens = this.components.gamegrid.querySelectorAll('[id*=X-]');  
      [].slice.call(xTokens).forEach(function(token) {
        token.style.fillOpacity = 0;
      });      
    },
    displayMessage: function(msg) {
      var messages = document.querySelector('#messages');
      messages.innerHTML = msg;
    },
    placeToken: function placeToken(target, token) {

      var values = (target.id.split('-'));
      var tokenId = '#' + token + '-' + values[1] + '-' + values[2];

      this.components.gamegrid.querySelector(tokenId).style.fillOpacity = 1;
    },
    clickedSquare: function clickedSquare(e) {

      var status = this.game.checkForWin(this.game.board, this.game.counter);

      if (status === GAMESTATES.CONTINUE && this.game.players[0].type === 'human') {
        var classList = e.target.className.baseVal.split(' ');
        if (classList.indexOf('square') === -1 ) {
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
      var gridsvg = this.components.gamegrid.querySelector('#grid-svg');
      toggleClass(gridsvg, 'clickable');  

      var token = this.game.players[0].token;
      var tile = this.game.turn();  
      var tokenId = '#' + token + '-' + tile.x + '-' + tile.y;

      this.placeToken(this.components.gamegrid.querySelector(tokenId), token);
      toggleClass(gridsvg, 'clickable');  

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
        toggleClass(this.components.playAgainBtn, 'hidden');  
        return;
      }

      this.playTurn();

    },
    playAgain: function() {
      this.emptyBoard();
      this.displayMessage('');
      toggleClass(this.components.playAgainBtn, 'hidden');      
      this.toggleGameScreens();
    },
    start: function start() {

      if (this.components.token().value === null){
        this.components.startBtn.disabled = true;
        this.components.modalMsg.innerHTML = 'Please select a token!';

        toggleClass(this.components.modal, 'hidden');
        return;
      }

      if (!this.components.name.value) {
        this.components.startBtn.disabled = true;
        this.components.modalMsg.innerHTML = 'Please enter your name!';
        toggleClass(this.components.modal, 'hidden');
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

      console.log(this.components.gridObj);
      this.toggleGameScreens();

      this.init(player1, player2);  
    },
    closeModal: function closeModal() {
      this.components.startBtn.disabled = false;
      toggleClass(this.components.modal, 'hidden');
    }  
  };

  // Added for cross browser compatibility
  // classList is not available in IE
  function toggleClass(el, cls) {
    if (el.classList) { 
        el.classList.toggle(cls);
    } else {
      var classes = el.className.toString().split(' ');
      var index = classes.indexOf(cls);

      if (index >= 0) {
        classes.splice(index, 1);
      } else {
        classes.push(cls);
        el.setAttribute("class", classes);
      } 
    }
  };




})(window);