/**
 * @ngdoc directive
 * @name aaValMsgFor
 *
 * @description
 * Description place holder.
 **/
(function () {
  'use strict';

  angular.module('aa.formExtensions')
    //if used directly rather than passively with aaValMsg allows for direct placement of validation messages
    //for a given form field. ex. pass "myForm.myFieldName"
    .directive('aaValMsgFor', ['aaFormExtensions', 'aaUtils', function (aaFormExtensions, aaUtils) {
      //generate the validation message for a particular form field here
      return {
        require: ['^form'],
        priority: 1,
        scope: true,
        link: function ($scope, element, attrs) {

          var fullFieldPath = attrs.aaValMsgFor,
            pathComponents = fullFieldPath.split('.'),
            controllerAs = angular.isDefined(attrs.controllerAs),
            formPath = controllerAs ? [pathComponents[0], pathComponents[1]].join('.') : fullFieldPath.substring(0, fullFieldPath.indexOf('.')),
            fieldInForm = $scope.$eval(fullFieldPath),
            formObj = $scope.$eval(formPath);

          //TODO: if this is inside an isolate scope and the form is outside the isolate scope this doesn't work
          //could nest multiple forms so can't trust directive require and have to eval to handle edge cases...
          aaUtils.ensureaaFormExtensionsFieldExists(formObj, fieldInForm.$name);
          var formExtensionsPath = controllerAs ? fullFieldPath.replace(formPath, formPath + '.$aaFormExtensions') : fullFieldPath.replace('.', '.$aaFormExtensions.'),
            fieldInFormExtensions = $scope.$eval(formExtensionsPath);

          $scope.$watchCollection(
            function () {
              return fieldInFormExtensions.$errorMessages;
            },
            function (val) {
              $scope.errorMessages = val;
            }
          );

          $scope.$watch(
            function () {
              return [
                formObj.$aaFormExtensions.$invalidAttempt,
                fieldInFormExtensions.showErrorReasons,
                fieldInFormExtensions.$focused
              ];
            },
            function (watches) {
              var invalidAttempt = watches[0],
                showErrorReasons = watches[1],
                focused = watches[2];

              $scope.showMessages = (invalidAttempt || showErrorReasons.length) && !focused;
            },
            true
          );
        },
        template: aaFormExtensions.valMsgForTemplate,
        replace: true
      };
    }]);

})();
