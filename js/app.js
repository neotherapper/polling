'use strict';

var pollingApp = angular.module('pollingApp', [
	'ngRoute',
	'ui.bootstrap',
	'ngResource',
	'ui.router',
	'ivpusic.cookie'
	]
);

pollingApp.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/admin');

	$stateProvider
	.state('admin', {
		url: '/admin',
		templateUrl: "views/Admin/Admin.html",
		controller: "PollsController"
	})

	.state('admin.options', {
		url: '/options',
		templateUrl: "views/Admin/AdminMenu.html"
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
	});
		
});
