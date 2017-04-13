angular.module('auth.controller', [])
       .controller('SignInCtrl', SignInCtrl)

SignInCtrl.$inject = ["$log", "authService", "userService", "$state"];

function SignInCtrl($log, $scope, authService, userService, $state) {

      var self = this;
      // BINDINGS
      self.signUp = {
        email:    "eric@ga.co",
        name:     "Eric Van Dyn Hoven",
        password: "12345",
        passwordConfirmation: "12345"
      };
      self.submitSignUp = submitSignUp;
      self.logIn = {
        email:    "eric@ga.co",
        password: "12345"
      };
      self.submitLogIn = submitLogIn;
      self.conflict = false;

      self.click = click

    // FUNCTIONS

    function click(){
        console.log('clicked')
    }

    function submitSignUp() {
      userService
        .create(self.signUp)
        .then(function(res) {
          return AuthService.logIn(self.signUp);
        })
        .then(
          // on success
          function(decodedToken) {
            $log.info('Logged in!', decodedToken);
            $state.go('home');
          },
          // on error
          function(err) {
            if (err.status === 409) self.conflict = true;
            $log.info('Error Claire-r:', err);
          }
        );
    }

    function submitLogIn() {
      console.log('clicked');
      AuthService
        .logIn(self.logIn)
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
