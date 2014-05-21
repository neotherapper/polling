/**
 * Created by georgepilitsoglou on 5/21/14.
 */


'use strict';

pollingApp.controller('PollingListController',
    function PollingListController($scope,  Polls) {
        Polls.get(function(Polls) {
            $scope.polls = Polls;
        });
      }
  );