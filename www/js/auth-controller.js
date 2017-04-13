angular.module('auth.controller', [])
       .controller('SignInCtrl', SignInCtrl)

SignInCtrl.$inject = ["$log", "authService", "userService", "$state"];

function SignInCtrl($log, $scope, authService, userService, $state) {

      // var $scope = this;
      // BINDINGS
      $scope.signUp = {
        email:    "eric@ga.co",
        name:     "Eric Van Dyn Hoven",
        password: "12345",
        passwordConfirmation: "12345"
      };
      $scope.submitSignUp = submitSignUp;
      $scope.logIn = {
        email:    "eric@ga.co",
        password: "12345"
      };
      $scope.submitLogIn = submitLogIn;
      $scope.conflict = false;

      $scope.click = click

    // FUNCTIONS

    function click(){
        console.log('clicked')
    }

    function submitSignUp() {
      userService
        .create($scope.signUp)
        .then(function(res) {
          return AuthService.logIn($scope.signUp);
        })
        .then(
          // on success
          function(decodedToken) {
            $log.info('Logged in!', decodedToken);
            $state.go('home');
          },
          // on error
          function(err) {
            if (err.status === 409) $scope.conflict = true;
            $log.info('Error Claire-r:', err);
          }
        );
    }

    function submitLogIn() {
      console.log('clicked');
      AuthService
        .logIn($scope.logIn)
        .then(
          // on success
          function(decodedToken) {
            $log.info('Logged in!', decodedToken);
            $state.go('home');
          },
          // on error
          function(err) {
            $log.info('Error:', err);
          }
        );
    }

    $log.info("SignInController loaded!");

};
