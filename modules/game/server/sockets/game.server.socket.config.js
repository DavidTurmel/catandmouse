'use strict';

// Create the chat configuration
module.exports = function (io, socket) {

  // Emit the status event when a new socket client is connected
  io.emit('gameMessage', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  var squares = {};

  var squareId = 'square-' + (new Date()).getTime() + '-' + Math.round((Math.random() * 10000));

  squares[squareId] = {
    top: 0,
    left: 0,
    id:squareId,
    backgroundColor:'#'+Math.floor(Math.random()*16777215).toString(16)
  };

  socket.emit('createSquare', squares[squareId]);

  socket.on('moveSquare', function(coordinates){
    if(squares[squareId]) {

      // Collision management
      var allowRefresh = true;
      for (var otherSquareId in squares) {
        if (otherSquareId != squareId) {
          let distance = Math.sqrt(Math.pow((squares[otherSquareId].left - 25) - (coordinates.left - 25), 2) + Math.pow((squares[otherSquareId].top - 25) - (coordinates.top - 25), 2));

          if(Math.round(distance) < 50) {
            allowRefresh = false;
          }
        }
      }

      if (allowRefresh) {
        squares[squareId].top = coordinates.top;
        squares[squareId].left = coordinates.left;
      }

      io.emit('refreshSquares', squares);
    };
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function(){
    delete squares[squareId];
    io.emit('gameMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
  });

};
