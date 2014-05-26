'use strict';

pollingApp.controller('PollsController', function ($window, $rootScope, $scope, $state, ipCookie, socket) {
	// our data
	$scope.polls = [];
	$scope.answeredQuestions = {};

	// we send to the server is questionsRequest
	socket.emit('questionsRequest');

	// on refresh we ..
	// send to the server a questionsRequest
	// and we check for answered questions.
	$scope.refresh = function() {
		socket.emit('questionsRequest');
		$scope.checkAnsweredQuestions();
		console.log($scope.answeredQuestions);
	};

	$scope.checkAnsweredQuestions = function() {
		var cookieData = ipCookie('answeredPolls');

		if (cookieData) {
			$scope.answeredQuestions = cookieData;
		}
	};

	//parameter is a poll object
	// returns True if Poll is answered --> if poll.id exists within array answeredQuestions
	$scope.isPollAnswered = function(poll) {
		return $scope.answeredQuestions[poll.id] ? true : false;
	};

	//parameters is a poll object and the answer from ui
	$scope.selectAnswer = function(poll, answer) {
		// we cannot answer an answered question
		if ($scope.answeredQuestions[poll.id]) {
			console.log('drosa den ginetai');
			return false;
		}
		answer.times++;
		poll.question.times++;
		answer.selected = true;
		$scope.updateCookie(poll);
		// we tell the server that a pollUpdate has occured.
		socket.emit('pollUpdate', poll);
	};

	$scope.updateCookie = function(poll) {
		// cookie is an object
		var cookie = ipCookie('answeredPolls');
		
		if (cookie && Object.keys(cookie).length > 0) {
		}
		// if there is no cookie returned instantiate it.
		else cookie = {};

		cookie[poll.id] = 'answered';

		ipCookie('answeredPolls', JSON.stringify(cookie), {expires: 99});
		$scope.refresh();
	};

	// $scope.logCookies = function() {
	// 	var cookie = ipCookie('answeredPolls');

	// 	console.log(JSON.stringify(cookie) + ' our cookie before parsing');
	// 	cookie[3] = 'answered';
	// 	if (cookie && Object.keys(cookie).length > 0) {
	// 	}
	// 	else cookie = {};

	// 	console.log(JSON.stringify(cookie) + ' our cookie after parsing');
	// 	ipCookie('answeredPolls', JSON.stringify(cookie), {expires: 99});
	// };

	// function for manipulating the Add New Question form at new-question
	// parameter is a form object
	$scope.submitQuestion = function(form) {
		var answer;

		// we instantiate that times is 0 for every answer.
		for (answer in form.answers) {
			form.answers[answer].times = 0;
		}
		//Creation of the Object that will be sent as question
		var newQ = {
			'id': $scope.polls.length,
			'question': {
				'text': form.newQuestion,
				'times': 0
			},
			'answers': form.answers
		};

		// we send newQuestion to the server that has
		// the new question object attached..
		socket.emit('newQuestion', newQ);
	};

	//added from http://stackoverflow.com/questions/21007164/why-do-my-socket-on-calls-multiply-whenever-i-recenter-my-controller/22424757#22424757
	$scope.$on('$destroy', function (event) {
		socket.removeAllListeners();
	});

	socket.on('pollUpdateSuccess', function(poll) {
		$scope.refresh();
	});

	//when we receive from the server that a new question is saved we ..
	socket.on('newQuestionSaved', function(data) {
		$scope.refresh();
		// you are redirected to ViewQuestions.html
		$state.go('admin.viewquestions');
	});

	//when we receive from the server the data we ..
	socket.on('questionsData', function(data) {
		$scope.polls = [];
		var poll;
		// we create an array of data objects
		data = "[" + data+ "]";

		try {
			data = JSON.parse(data);
			$scope.polls = data;
		} catch (e) {
			// we use jsonlint to display useful error messages
			jsonlint.parse(data[poll]);
		}

	});
	$scope.checkAnsweredQuestions();
});
