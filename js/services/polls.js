/**
 * Created by georgepilitsoglou on 5/21/14.
 */

'use strict';

pollingApp.factory('Polls', function ($resource, socket, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('node/data.json');
  });
