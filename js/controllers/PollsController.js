'use strict';

pollingApp.controller('PollsController', function ($window, $rootScope, $scope, $state, ipCookie, socket) {
	// our data
	// Polls.get(function(Polls) {
	// 	$scope.polls2=  Polls.Pollquestions;
	// 	console.log(JSON.stringify($scope.polls2) + '   is  $scope.polls2-->  at the beginning');
	// });

	//http://stackoverflow.com/questions/13323356/parsing-faulty-json-and-be-able-to-display-where-the-error-is
	JSON._parse = JSON.parse;
	JSON.parse = function (json) {
		try {
			return JSON._parse(json)
		} catch(e) {
			jsonlint.parse(json)
		}
	};

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
		if ($scope.answeredQuestions[poll.id]) {
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
		var cookie = ipCookie('answeredPolls');
		
		if (cookie && cookie.length > 0) {
			//error handling for json parsing
			try {
				cookie = JSON.parse(cookie);
			}catch (e) {
				console.log('error parsing json cookie');
			}
		}
		else cookie = {};

		cookie[poll.id] = 'answered';

		ipCookie('answeredPolls', JSON.stringify(cookie), {expires: 99});
		$scope.refresh();
	};

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
		}

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

	socket.on('questionsData', function(data) {
		console.log('the data we receive for the server is .....');
		console.dir(data);
		if (typeof data === 'object') {
			console.log('our server data  is an object');
		};
		var incoming = [];
		var poll;

		for (poll in data) {
			console.log(poll + '    --> iteration');
			console.log(data[poll] + '    --> this is data['+poll + ']');
			if (data[poll] && data.hasOwnProperty(poll)) {
				var answer = data[poll];
				console.log(answer.id);
				if (data[poll].length > 0) {
					//error handling for json parsing
					// without that we get an error
					
					data[poll] = JSON.parse(data[poll]);
					 console.log(JSON.stringify(data[poll]) + '    --> this is parsed data[poll]');
					 incoming.unshift(data[poll]);
					// try {
					// 	data[poll] = JSON.parse(data[poll]);
					// 	console.log(JSON.stringify(data[poll]) + '    --> this is parsed data[poll]');
					// 	incoming.unshift(data[poll]);
					// } catch (e) {
					// 	console.log('error parsing json for data[poll]');
					// }

				}
			}
		}
		$scope.polls = incoming;
		// $scope.polls = incoming.Pollquestions;
		console.log(JSON.stringify(incoming) + '  this is our incoming');
	});
	$scope.checkAnsweredQuestions();
});
