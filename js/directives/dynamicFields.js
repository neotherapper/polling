pollingApp.directive('dynamicFields', function() {
	return {
		restrict: 'ACE',
		link: function($scope, $elem, $attrs) {
			$scope.fields = new Array(parseInt($attrs.fields));

			$scope.addField = function(name) {
				if ($scope.fields.length < $attrs.maxfields) {
					$scope.fields.push('');
				}
			}
		}
	}
});
