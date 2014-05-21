'use strict';

var pollingApp = angular.module('pollingApp', [
	'ngRoute',
	'ngResource',
	'ui.router',
	'ivpusic.cookie'
	]
);

pollingApp.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/poll');

	$stateProvider
	.state('admin', {
		url: '/admin',
		templateUrl: "views/Admin.html",
		controller: "PollsController"
	})

	.state('admin.options', {
		url: '/options',
		templateUrl: "views/AdminMenu.html"
	})

	.state('admin.newquestion', {
		url: '/new-question',
		templateUrl: "views/Admin/NewQuestion.html"
	})

	.state('admin.viewquestions', {
		url: '/view-questions',
		templateUrl: "views/Admin/ViewQuestions.html"
	})

	.state('poll', {
		url: '/poll',
		templateUrl: "views/poll/Poll.html",
		controller: "PollsController"
	})

	.state('polllist', {
		url: '/list',
		templateUrl: "views/poll/pollingList.html",
		controller: "PollingListController"
	});

		
});
