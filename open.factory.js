(function () {
  'use strict';

  angular.module('openApp')
    .factory('openFactory', openFactory);

  function openFactory($http) {
    var service = {
      getScores: getScores,
      getWeeks: getWeeks,
      getAccomplishments: getAccomplishments,
      getTeams: getTeams,
      getAthletes: getAthletes
    };

    return service;

    function getScores() {
      var promise = $http.get(getURL('Scoring'));
      return promise;
    }

    function getWeeks() {
      var promise = $http.get(getURL('Weeks'));
      return promise;
    }

    function getAccomplishments() {
      var promise = $http.get(getURL('Accomplishments'));
      return promise;
    }

    function getTeams() {
      var promise = $http.get(getURL('Teams'));
      return promise;
    }

    function getAthletes() {
      var promise = $http.get(getURL('Athletes'));
      return promise;
    }

    function getURL(sheet) {
      var api;

      api = 'https://sheets.googleapis.com/v4/spreadsheets/1yZ1RneGb4E-DOKT8dvjDHws5_JANZRWvWXJKuRnxW5w/values/' + sheet + '?key=AIzaSyBiLTaskmTWmp52vHzuXhp_k2CZ_XBnfSs';
      return api;
    }
  }
})();