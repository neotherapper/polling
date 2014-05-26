'use strict';
/**
 * Created by georgepilitsoglou on 5/21/14.
 */

pollingApp.factory('socket', ['$rootScope', function ($rootScope) {

    var socket = io.connect(window.location.hostname);
    // autodiscovery mode
    var socket = io.connect();
    // fixed http://stackoverflow.com/questions/8350630/nodejs-with-socket-io-delay-emitting-data
    // var socket = io.connect('http://localhost:5000', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling']});
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
    
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function (){
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
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
        },

        //added from http://stackoverflow.com/questions/21007164/why-do-my-socket-on-calls-multiply-whenever-i-recenter-my-controller/22424757#22424757
        removeAllListeners: function (eventName, callback) {
            socket.removeAllListeners(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }

    };
  }]);