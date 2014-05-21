/**
 * Created by georgepilitsoglou on 5/21/14.
 */

'use strict';

pollingApp.directive('pollView', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/directives/pollView.html',
        scope: {
            poll: '='
          }
        };
  });