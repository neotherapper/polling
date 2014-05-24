/**
 * Created by georgepilitsoglou on 5/21/14.
 */

'use strict';

pollingApp.factory('Polls', function ($resource, socket, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('node/data.json');
    


    // $timeout(function () {
    //         socket.on('questionsData', function(data) {
    //     console.log(data + ' this is the data we receive for the server');
    //     var polls = [];
    //     var poll;

    //     for (poll in data) {
    //         // console.log(data[poll] + '    --> this is data[poll]');
    //         if (data[poll]) {
    //             if (data[poll].length > 0) {
    //                 //error handling for json parsing
    //                 // without that we get an error
    //                 try {
    //                     data[poll] = JSON.parse(data[poll]);
    //                     polls.unshift(data[poll]);
    //                 } catch (e) {
    //                     console.log('error parsing json for data[poll]');
    //                 }
    
    //             }
    //         }
    //     }

    //     object.Pollquestions2 = polls;
    // });
    // });


  });
