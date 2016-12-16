(function () {
  'use strict';

  angular
    .module('game')
    .controller('GameController', ChatController);

  ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function ChatController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
    vm.sendMessage = sendMessage;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      var HTMLDivElement = null;

      var createOrRefreshSquare = function(square){
        if (square.id) {
          var square;
          if (window.document.getElementById(square.id)) {
            HTMLDivElement = window.document.getElementById(square.id)
          } else {
            HTMLDivElement = document.createElement('div');
            HTMLDivElement.id = square.id;
            HTMLDivElement.style.width = '50px';
            HTMLDivElement.style.height = '50px';
            HTMLDivElement.style.borderRadius = '25px';
            HTMLDivElement.style.position = 'absolute';
            HTMLDivElement.style.backgroundColor = square.backgroundColor;
            window.document.body.appendChild(HTMLDivElement);
          }
          HTMLDivElement.style.top = square.top + 'px';
          HTMLDivElement.style.left = square.left + 'px';
        }
      };

      Socket.on('createSquare', createOrRefreshSquare);

      window.document.addEventListener('mousemove', function(event){
        if (HTMLDivElement) {
          Socket.emit('moveSquare', {
            top: event.clientY - (parseFloat(HTMLDivElement.style.height) / 2),
            left: event.clientX - (parseFloat(HTMLDivElement.style.width) / 2)
          });
        };
      });

      Socket.on('refreshSquares', function(squares){
        for (var squareId in squares) {
          createOrRefreshSquare(squares[squareId]);
        }
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('gameMessage');
      });
    }

    // Create a controller method for sending messages
    function sendMessage() {
      // Create a new message object
      var message = {
        text: vm.messageText
      };

      // Emit a 'gameMessage' message event
      Socket.emit('gameMessage', message);

      // Clear the message text
      vm.messageText = '';
    }
  }
}());
