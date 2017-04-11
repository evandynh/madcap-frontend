angular.module('controllers', [])

.controller('HomeCtrl', function($scope, $http) {
  $scope.pictures = []
  $scope.likes = 0

  $scope.numLikes = function(){
      $scope.likes += 1
  }

  $http.get("https://madcap.herokuapp.com/pictures", { cache: true })
    .then(function(response){
      console.log(response)
      $scope.pictures = response.data.pictures
  });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller("CameraCtrl", function($scope, $cordovaCamera, $http) {

    $scope.challenges = [];
    $scope.picture = {}
    $scope.picTaken = false

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

    $scope.addPicture = function(){
        $http.post("https://madcap.herokuapp.com/pictures", $scope.picture)
          .then(function(response){
            $scope.picture = {}
            $scope.picTaken = false
            console.log(response)
        });
    }

    $http.get("https://madcap.herokuapp.com/challenges", { cache: true })
      .then(function(response){
        console.log(response)
        $scope.challenges = response.data.challenges
    });

});
