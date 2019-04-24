import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import addHtml from './modal/add.html';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  awesomeUsers = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal) {
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;


    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    // this.$http.get('/api/things')
    //   .then(response => {
    //     console.log(response);
    //     this.awesomeThings = response.data;
    //     this.socket.syncUpdates('thing', this.awesomeThings);
    //   });

    this.$http.get('/api/users')
      .then(response => {
        console.log(response);
        this.awesomeUsers = response.data;
        this.socket.syncUpdates('user', this.awesomeUsers);
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  addUser() {
    const awesomeThings = this.awesomeThings;
    this.$uibModal.open({
        template: addHtml,
        size: 'lg',
        /*@ngInject*/
        controller: function($scope, $http, $uibModalInstance) {
          $scope.vm = {};
          $scope.save = function(myForm) {
            if (myForm.$valid === false) {
              return false;
            } else {
              // const test = {
              //   "device_id": "0f0e65b5-8437-381e-bfe3-ec5fe4488110",
              //   "email": "",
              //   "images": "https://graph.facebook.com/v3.2/838673536492614/picture?height=300&width=300&migration_overrides=%7Boctober_2012%3Atrue%7D",
              //   "pid": "838673536492614",
              //   "remark": "facebook",
              //   "user_name": "陈凯华"
              // }
              // const user_name = $scope.vm.user_name;
              $http.post('/api/users', $scope.vm).then((response) => {
                console.log(response);
                $uibModalInstance.close(response);
              }, (error) => {
                console.log(error);
              });
            }
          };
          $scope.cancel = function() {
            $uibModalInstance.close();
          };
        }
      })
      .result.then(function(ret) {
      if (ret) {
        //awesomeThings.unshift(ret);
      }
    }, function () {
    });
  }

  deleteUser (user) {
    this.$http.delete(`/api/users/${user._id}`).then((response => {
      console.log(response);
    }, (error) => {

    }));
  }
}

export default angular.module('tttApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
