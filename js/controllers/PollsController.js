'use strict';

pollingApp.controller('PollsController', function ($window, $rootScope, $scope, $state, ipCookie) {
	$scope.polls = [];
	$scope.answeredQuestions = {};

	socket.emit('questionsRequest');

	$scope.refresh = function() {
		socket.emit('questionsRequest');
		$scope.checkAnsweredQuestions();
	};

	$scope.checkAnsweredQuestions = function() {
		var cookieData = ipCookie('answeredPolls');
		console.log(cookieData);

		if (cookieData) {
			$scope.answeredQuestions = cookieData;
		}
	};

	$scope.isPollAnswered = function(poll) {
		return $scope.answeredQuestions[poll.id] ? true : false;
	};

	$scope.selectAnswer = function(poll, answer) {
		if ($scope.answeredQuestions[poll.id]) {
			return false;
		}
		answer.times++;
		poll.question.times++;
		answer.selected = true;
		$scope.updateCookie(poll);
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

	$scope.submitQuestion = function(form) {
		var answer;

		for (answer in form.answers) {
			form.answers[answer].times = 0;
		}

		socket.emit('newQuestion', {
			'id': $scope.polls.length,
			'question': {
				'text': form.newQuestion,
				'times': 0
			},
			'answers': form.answers
		});
	};

	socket.on('pollUpdateSuccess', function(poll) {
		$scope.refresh();
	});

	socket.on('newQuestionSaved', function(data) {
		$scope.refresh();
		// when a new question is saved you are redirected to ViewQuestions.html
		$state.go('admin.viewquestions');
	});

	socket.on('questionsData', function(data) {
		$scope.$apply(function() {
			$scope.polls = [];
			var poll;

			console.log(data);
			for (poll in data) {
				// console.log(poll + '  -> this is poll');
				// console.log(data[poll] + '    --> this is data[poll]');
				if (data[poll]) {
					if (data[poll].length > 0) {
						//error handling for json parsing
						try {
							data[poll] = JSON.parse(data[poll]);
							console.log(data[poll] + '    --> this is parsed data[poll]');
							$scope.polls.unshift(data[poll]);
						} catch (e) {
							console.log('error parsing json for data[poll]');
						}
		
					}
				}
			}
		});
	});

	$scope.checkAnsweredQuestions();
});
