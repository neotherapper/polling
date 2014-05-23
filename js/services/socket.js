'use strict';
/**
 * Created by georgepilitsoglou on 5/21/14.
 */

pollingApp.factory('socket', ['$rootScope', function ($rootScope) {

    // var socket = io.connect('http://localhost:4000');
    // fixed http://stackoverflow.com/questions/8350630/nodejs-with-socket-io-delay-emitting-data
    var socket = io.connect('http://localhost:4000', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling']});
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
    
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }

    };//return
  }]);