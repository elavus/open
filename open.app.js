﻿
'use strict';

var openApp = angular.module('openApp', []);

openApp.controller('openController', ['$scope', '$interval', '$location', 'openFactory', openController]);

function openController($scope, $interval, $location, openFactory) {
  var vm = this;
  vm.Sheet = {};
  vm.Maps = {};
  vm.Teams = [];
  vm.Initialized = false;
  vm.MaxWeekWithScore = 0;

  vm.IsMobile = false;
  if (window.innerHeight > window.innerWidth) {
    vm.IsMobile = true;
  }

  performRefresh();
  //    var refresh = $interval(performRefresh, 10000);



  function performRefresh() {
    getWeeks();
  }

  function getWeeks() {
    var promise = openFactory.getWeeks();
    promise.then(getWeeksOnSuccess, OnFailure);
  }

  function getScores() {
    var promise = openFactory.getScores();
    promise.then(getScoresOnSuccess, OnFailure);
  }


  function getAccomplishments() {
    var promise = openFactory.getAccomplishments();
    promise.then(getAccomplishmentsOnSuccess, OnFailure);
  }

  function getTeams() {
    var promise = openFactory.getTeams();
    promise.then(getTeamsOnSuccess, OnFailure);
  }

  function getAthletes() {
    var promise = openFactory.getAthletes();
    promise.then(getAthletesOnSuccess, OnFailure);
  }

  function getWeeksOnSuccess(response) {
    var key;
    var value;

    vm.Sheet.Weeks = angular.extend({}, response.data).values;
    vm.Maps.Weeks = new Map();

    for (var i = 1; i < vm.Sheet.Weeks.length; i++) {
      key = parseInt(vm.Sheet.Weeks[i][0], 10);
      value = vm.Maps.Weeks.get(key);
      if (value == null) {
        value = {};
        value.Week = key;
        vm.Maps.Weeks.set(key, value);
      }
      value.Start = vm.Sheet.Weeks[i][1]
    }

    getAccomplishments();
    response = undefined;
  }

  function getAccomplishmentsOnSuccess(response) {
    var key;
    var value;

    vm.Sheet.Accomplishments = angular.extend({}, response.data).values;
    vm.Maps.Accomplishments = new Map();

    for (var i = 1; i < vm.Sheet.Accomplishments.length; i++) {
      key = vm.Sheet.Accomplishments[i][0];
      value = vm.Maps.Accomplishments.get(key);
      if (value == null) {
        value = {};
        value.Accomplishment = key;
        vm.Maps.Accomplishments.set(key, value);
      }
      value.Points = parseInt(vm.Sheet.Accomplishments[i][1], 10);
      value.Comments = vm.Sheet.Accomplishments[i][2];
    }


    getTeams();
    response = undefined;
  }

  function getTeamsOnSuccess(response) {
    var key;
    var value;

    vm.Sheet.Teams = angular.extend({}, response.data).values;
    vm.Maps.Teams = new Map();

    for (var i = 1; i < vm.Sheet.Teams.length; i++) {
      key = vm.Sheet.Teams[i][0];
      value = vm.Maps.Teams.get(key);
      if (value == null) {
        value = {};
        value.Team = key;
        vm.Maps.Teams.set(key, value);
      }
      value.Name = vm.Sheet.Teams[i][1];
      value.Score = 0;
      value.Initialized = false;
      value.Logo = vm.Sheet.Teams[i][2];
      value.BackColor = vm.Sheet.Teams[i][3];
      value.ForeColor = vm.Sheet.Teams[i][4];
    }

    getAthletes();
    response = undefined;
  }

  function getAthletesOnSuccess(response) {
    var key;
    var value;

    vm.Sheet.Athletes = angular.extend({}, response.data).values;
    vm.Maps.Athletes = new Map();

    for (var i = 1; i < vm.Sheet.Athletes.length; i++) {
      key = vm.Sheet.Athletes[i][0];
      value = vm.Maps.Athletes.get(key);
      if (value == null) {
        value = {};
        value.Athlete = key;
        vm.Maps.Athletes.set(key, value);
      }
      value.Coach = vm.Sheet.Athletes[i][1];
      value.Score = 0;
      value.Icon = '💩'
      value.Initialized = false;
      value.MaxWeekWithScore = 0;
      value.Scores = [];
    }

    getScores();
    response = undefined;
  }

  function getScoresOnSuccess(response) {
    var key;
    var athlete;
    var accomplishment;
    var value;

    vm.Sheet.Scores = angular.extend({}, response.data).values;
    for (var i = 1; i < vm.Sheet.Scores.length; i++) {

      key = vm.Sheet.Scores[i][2];
      athlete = vm.Maps.Athletes.get(key);
      if (athlete != null) {
        if (!(vm.Initialized)) {
          for (var j = 1; j < vm.Sheet.Teams.length; j++) {
            vm.Maps.Teams.get(vm.Sheet.Teams[j][0]).Initialized = true;
          }

          for (var j = 1; j < vm.Sheet.Athletes.length; j++) {
            vm.Maps.Athletes.get(vm.Sheet.Athletes[j][0]).Initialized = true;
          }
          vm.Initialized = true;
        }

        key = vm.Sheet.Scores[i][3];
        accomplishment = vm.Maps.Accomplishments.get(key);
        if (accomplishment != null) {
          value = {};
          value.Week = parseInt(vm.Sheet.Scores[i][1], 10);
          value.Score = accomplishment.Points;
          value.Accomplishment = accomplishment.Comments;
          value.Comments = vm.Sheet.Scores[i][4];

          vm.Maps.Athletes.get(athlete.Athlete).Scores.push(value);
          vm.Maps.Athletes.get(athlete.Athlete).Score += value.Score;

          if (value.Week > vm.MaxWeekWithScore) {
            vm.MaxWeekWithScore = value.Week;
          }

          if (value.Week > vm.Maps.Athletes.get(athlete.Athlete).MaxWeekWithScore) {
            vm.Maps.Athletes.get(athlete.Athlete).MaxWeekWithScore = value.Week;
          }

          vm.Maps.Teams.get(athlete.Coach).Score += value.Score;
        }
      }
    }

    compileBoard();
    response = undefined;
  }

  function compileBoard() {
    var team;
    var athlete;
    var score;
    var order;
    var athletePair;
    var teamAthleteCount;

    vm.Teams = [];
    for (var i = 1; i < vm.Sheet.Teams.length; i++) {
      team = vm.Maps.Teams.get(vm.Sheet.Teams[i][0]);

      team.AthletePairs = [];
      team.Athletes = [];
      teamAthleteCount = 0;
      for (var j = 0; j < vm.Sheet.Athletes.length; j++) {
        if (vm.Sheet.Athletes[j][1] == vm.Sheet.Teams[i][0]) {
          athlete = vm.Maps.Athletes.get(vm.Sheet.Athletes[j][0]);
          if (athlete.MaxWeekWithScore == vm.MaxWeekWithScore) {
            athlete.Icon = '💪';
          }
          team.Athletes.push(athlete);

          if ((teamAthleteCount % 2) == 0) {
            athletePair = {};
            athletePair.Athlete = [];
            team.AthletePairs.push(athletePair);
          }
          team.AthletePairs[team.AthletePairs.length - 1].Athlete.push(athlete);
          teamAthleteCount++;
        }

      }

      team.Score = team.Score / team.Athletes.length;
      team.FormattedScore = team.Score.toFixed(1);
      vm.Teams.push(team);
    }




    for (var a = 0; a < vm.Teams.length; a++) {
      for (var i = 0; i < vm.Teams.length; i++) {
        for (var j = i + 1; j < vm.Teams.length; j++) {
          if (vm.Teams[i].Score < vm.Teams[j].Score) {
            team = vm.Teams[i];
            vm.Teams[i] = vm.Teams[j];
            vm.Teams[j] = team;
          }
        }
      }
    }

    score = 99999;
    order = 0;
    for (var i = 0; i < vm.Teams.length; i++) {
      if (vm.Teams[i].Score < score) {
        score = vm.Teams[i].Score;
        order = i + 1;
      }
      vm.Teams[i].Order = order;
      switch (order) {
        case 1:
          vm.Teams[i].Icon = '🥇';
          vm.Teams[i].Place = '1st';
          break;

        case 2:
          vm.Teams[i].Icon = '🥈';
          vm.Teams[i].Place = '2nd';
          break;

        case 3:
          vm.Teams[i].Icon = '🥉';
          vm.Teams[i].Place = '3rd';
          break;

        default:
          vm.Teams[i].Icon = '😓';
          vm.Teams[i].Place = 'Last';
          break;
      }
    }
  }


  function OnFailure(response) {
    response = undefined;
  }
}

