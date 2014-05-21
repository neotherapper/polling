/**
 * Created by georgepilitsoglou on 5/21/14.
 */

'use strict';

travelRepublicApp.factory('Polls', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('node/data.json');
  });
