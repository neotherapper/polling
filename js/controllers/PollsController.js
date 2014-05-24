'use strict';

pollingApp.controller('PollsController', function ($window, $rootScope, $scope, $state, ipCookie, socket) {
	// our data
	// Polls.get(function(Polls) {
	// 	$scope.polls2=  Polls.Pollquestions;
	// 	console.log(JSON.stringify($scope.polls2) + '   is  $scope.polls2-->  at the beginning');
	// });

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

	socket.on('pollUpdateSuccess', function(poll) {
		$scope.refresh();
	});

	//when we receive from the server that a new question is saved we ..
	socket.on('newQuestionSaved', function(data) {
		$scope.refresh();
		// you are redirected to ViewQuestions.html
		$state.go('admin.viewquestions');
	});


	$scope.init = function() {
		socket.on('questionsData', function(data) {
		console.log(data + ' this is the data we receive for the server');
		$scope.polls = [];
		var poll;

		for (poll in data) {
			// console.log(data[poll] + '    --> this is data[poll]');
			if (data[poll]) {
				if (data[poll].length > 0) {
					//error handling for json parsing
					// without that we get an error
					try {
						data[poll] = JSON.parse(data[poll]);
						// console.log(data[poll] + '    --> this is parsed data[poll]');
						$scope.polls.unshift(data[poll]);
					} catch (e) {
						console.log('error parsing json for data[poll]');
					}
	
				}
			}
		}
		// return $scope.polls

	});
	};


	// when we receive from the server the data for our questions we ..
	// socket.on('questionsData', function(data) {
	// 	console.log(data + ' this is the data we receive for the server');
	// 	$scope.polls = [];
	// 	var poll;

	// 	for (poll in data) {
	// 		// console.log(data[poll] + '    --> this is data[poll]');
	// 		if (data[poll]) {
	// 			if (data[poll].length > 0) {
	// 				//error handling for json parsing
	// 				// without that we get an error
	// 				try {
	// 					data[poll] = JSON.parse(data[poll]);
	// 					// console.log(data[poll] + '    --> this is parsed data[poll]');
	// 					$scope.polls.unshift(data[poll]);
	// 				} catch (e) {
	// 					console.log('error parsing json for data[poll]');
	// 				}
	
	// 			}
	// 		}
	// 	}


	// 	console.log(JSON.stringify($scope.polls) + ' -->  after stringify');


	// });
	
	$scope.checkAnsweredQuestions();

	// console.log(JSON.stringify($scope.polls) + '   is  $scope.polls -->  at the end');
});
