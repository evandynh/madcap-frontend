angular.module('controllers', [])

//==============================================================
//==== HOME CONTROLLER ==============
//==============================================================
.controller('HomeCtrl', ['$scope', '$http', '$timeout', '$ionicModal', '$log', 'authService', 'userService', '$state',

  function($scope, $http, $timeout, $ionicModal, $log, authService, userService, $state ) {

  $scope.pictures = []
  $scope.likes = 0

//==== LOGIN MODAL OPEN/CLOSE ==============
// Form data for the login modal
// $scope.loginData = {};

// Create the login modal that we will use later
$ionicModal.fromTemplateUrl('templates/login.html', {
  scope: $scope
}).then(function(modal) {
  $scope.modal = modal;
});

// Triggered in the login modal to close it
$scope.closeLogin = function() {
  $scope.modal.hide();
};

// Open the login modal
$scope.login = function() {
  $scope.modal.show();
};

// Perform the login action when the user submits the login form
// $scope.doLogin = function() {
//   console.log('Doing login', $scope.loginData);

  // Simulate a login delay. Remove this and replace with your login
  // code if using a login system
  // $timeout(function() {
  //   $scope.closeLogin();
  // }, 1000);
// };
//==== Method for incrementing picture likes ==============
  $scope.numLikes = function() {
      $scope.likes += 1
  }

//==== Refreshing images on tab =====================
  $scope.doRefresh = function() {
    $timeout(function(){
      $http.get("https://madcap.herokuapp.com/pictures", { cache: false })
        .then(function(response){
          console.log(response)
          $scope.pictures = response.data.pictures
      });
      $scope.$broadcast("scroll.refreshComplete")
    }, 1000)
  }

// FUNCTIONS



//==== Grabs all pictures from backend ========================
    $http.get("https://madcap.herokuapp.com/pictures", { cache: false })
      .then(function(response){
        console.log(response)
        $scope.pictures = response.data.pictures
    });
}])

//==============================================================
//==== PROFILE CONTROLLER ==============
//==============================================================
.controller('AccountCtrl', function($scope, $log) {

  $scope.signUp = {
    email:    "eric@ga.co",
    name:     "Eric Van Dyn Hoven",
    password: "12345",
    passwordConfirmation: "12345"
  };
  $scope.logIn = {
    email:    "eric@ga.co",
    password: "12345"
  };
  $scope.conflict = false;

  $scope.click = function(){
      console.log('clicked')
  }

  $scope.submitSignUp = function() {
    userService
      .create($scope.signUp)
      .then(function(res) {
        return authService.logIn($scope.signUp);
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

  $scope.submitLogIn = function() {
    console.log('clicked');
    authService
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

})

//==============================================================
//==== CAMERA CONTROLLER ==============
//==============================================================
.controller("CameraCtrl", function($scope, $cordovaCamera, $http) {

    $scope.challenges = [];
    $scope.picture = {}
    $scope.picTaken = false

//==== Method for taking picture and saving URL ================
    $scope.takePicture = function() {
        var options = {
            quality : 100,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.picture.url = $scope.imgURI
            $scope.picTaken = true
            }, function(err) {
                console.log(err)
        })
    }

//==== Method for Adding Pictures to Database ==================
    $scope.addPicture = function(){
        $http.post("https://madcap.herokuapp.com/pictures", $scope.picture)
          .then(function(response){
            $scope.picture = {}
            $scope.picTaken = false
            console.log(response)
        });
    }

//==== Method for Getting Challenges from Database ==================
    $http.get("https://madcap.herokuapp.com/challenges", { cache: true })
      .then(function(response){
        console.log(response)
        $scope.challenges = response.data.challenges
    });

});
