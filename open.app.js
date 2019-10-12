
'use strict';

var openApp = angular.module('openApp', []);

openApp.controller('openController', ['$scope', '$interval', '$location', 'openFactory', openController]);

function openController($scope, $interval, $location, openFactory)
{
    var vm = this;
    vm.Sheet = {};
    vm.Maps = {};
    vm.Teams = [];
    vm.Initialized = false;
    vm.MaxWeekWithScore = 0;




    vm.IsMobile = checkMobile();

    performRefresh();
    //    var refresh = $interval(performRefresh, 10000);


    function checkMobile() 
    {
       var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


    function performRefresh()
    {
        getWeeks();
    }

    function getWeeks()
    {
        var promise = openFactory.getWeeks();
        promise.then(getWeeksOnSuccess, OnFailure);
    }

    function getScores()
    {
        var promise = openFactory.getScores();
        promise.then(getScoresOnSuccess, OnFailure);
    }


    function getAccomplishments()
    {
        var promise = openFactory.getAccomplishments();
        promise.then(getAccomplishmentsOnSuccess, OnFailure);
    }

    function getTeams()
    {
        var promise = openFactory.getTeams();
        promise.then(getTeamsOnSuccess, OnFailure);
    }

    function getAthletes()
    {
        var promise = openFactory.getAthletes();
        promise.then(getAthletesOnSuccess, OnFailure);
    }

    function getWeeksOnSuccess(response)
    {
        var key;
        var value;

        vm.Sheet.Weeks = angular.extend({}, response.data).feed.entry;
        vm.Maps.Weeks = new Map();

        for (var i = 0; i < vm.Sheet.Weeks.length; i++)
        {
            key = parseInt(vm.Sheet.Weeks[i].gsx$week.$t, 10);
            value = vm.Maps.Weeks.get(key);
            if (value == null)
            {
                value = {};
                value.Week = key;
                vm.Maps.Weeks.set(key, value);
            }
            value.Start = vm.Sheet.Weeks[i].gsx$start.$t
        }

        getAccomplishments();
        response = undefined;
    }

    function getAccomplishmentsOnSuccess(response)
    {
        var key;
        var value;

        vm.Sheet.Accomplishments = angular.extend({}, response.data).feed.entry;
        vm.Maps.Accomplishments = new Map();

        for (var i = 0; i < vm.Sheet.Accomplishments.length; i++)
        {
            key = vm.Sheet.Accomplishments[i].gsx$accomplishment.$t;
            value = vm.Maps.Accomplishments.get(key);
            if (value == null)
            {
                value = {};
                value.Accomplishment = key;
                vm.Maps.Accomplishments.set(key, value);
            }
            value.Points = parseInt(vm.Sheet.Accomplishments[i].gsx$points.$t, 10);
            value.Comments = vm.Sheet.Accomplishments[i].gsx$comments.$t;
        }


        getTeams();
        response = undefined;
    }

    function getTeamsOnSuccess(response)
    {
        var key;
        var value;

        vm.Sheet.Teams = angular.extend({}, response.data).feed.entry;
        vm.Maps.Teams = new Map();

        for (var i = 0; i < vm.Sheet.Teams.length; i++)
        {
            key = vm.Sheet.Teams[i].gsx$coach.$t;
            value = vm.Maps.Teams.get(key);
            if (value == null)
            {
                value = {};
                value.Team = key;
                vm.Maps.Teams.set(key, value);
            }
            value.Name = vm.Sheet.Teams[i].gsx$name.$t;
            value.Score = 0;
            value.Initialized = false;

            if (key == 'Austin')
            {
                value.IsAustin = 1;
            }

            if (key == 'DJ')
            {
                value.IsDJ = 1;
            }

            if (key == 'Jen')
            {
                value.IsJen = 1;
            }

            if (key == 'Kendra')
            {
                value.IsKendra = 1;
            }
        }

        getAthletes();
        response = undefined;
    }

    function getAthletesOnSuccess(response)
    {
        var key;
        var value;

        vm.Sheet.Athletes = angular.extend({}, response.data).feed.entry;
        vm.Maps.Athletes = new Map();

        for (var i = 0; i < vm.Sheet.Athletes.length; i++)
        {
            key = vm.Sheet.Athletes[i].gsx$athlete.$t;
            value = vm.Maps.Athletes.get(key);
            if (value == null)
            {
                value = {};
                value.Athlete = key;
                vm.Maps.Athletes.set(key, value);
            }
            value.Coach = vm.Sheet.Athletes[i].gsx$coach.$t;
            value.Score = 0;
            value.Icon = '💩'
            value.Initialized = false;
            value.MaxWeekWithScore = 0;
            value.Scores = [];
        }

        getScores();
        response = undefined;
    }

    function getScoresOnSuccess(response)
    {
        var key;
        var athlete;
        var accomplishment;
        var value;

        vm.Sheet.Scores = angular.extend({}, response.data).feed.entry;
        for (var i = 0; i < vm.Sheet.Scores.length; i++)
        {

            key = vm.Sheet.Scores[i].gsx$athlete.$t;
            athlete = vm.Maps.Athletes.get(key);
            if (athlete != null)
            {
                if (!(vm.Initialized))
                {
                    for (var j = 0; j < vm.Sheet.Teams.length; j++)
                    {
                        vm.Maps.Teams.get(vm.Sheet.Teams[j].gsx$coach.$t).Initialized = true;
                    }

                    for (var j = 0; j < vm.Sheet.Athletes.length; j++)
                    {
                        vm.Maps.Athletes.get(vm.Sheet.Athletes[j].gsx$athlete.$t).Initialized = true;
                    }
                    vm.Initialized = true;
                }

                key = vm.Sheet.Scores[i].gsx$accomplishment.$t;
                accomplishment = vm.Maps.Accomplishments.get(key);
                if (accomplishment != null)
                {
                    value = {};
                    value.Week = parseInt(vm.Sheet.Scores[i].gsx$week.$t, 10);
                    value.Score = accomplishment.Points;
                    value.Accomplishment = accomplishment.Comments;
                    value.Comments = vm.Sheet.Scores[i].gsx$comments.$t;

                    vm.Maps.Athletes.get(athlete.Athlete).Scores.push(value);
                    vm.Maps.Athletes.get(athlete.Athlete).Score += value.Score;

                    if (value.Week > vm.MaxWeekWithScore)
                    {
                        vm.MaxWeekWithScore = value.Week;
                    }

                    if (value.Week > vm.Maps.Athletes.get(athlete.Athlete).MaxWeekWithScore)
                    {
                        vm.Maps.Athletes.get(athlete.Athlete).MaxWeekWithScore = value.Week;
                    }

                    vm.Maps.Teams.get(athlete.Coach).Score += value.Score;
                }
            }
        }

        compileBoard();
        response = undefined;
    }

    function compileBoard()
    {
        var team;
        var athlete;
        var score;
        var order;

        vm.Teams = [];
        for (var i = 0; i < vm.Sheet.Teams.length; i++)
        {
            team = vm.Maps.Teams.get(vm.Sheet.Teams[i].gsx$coach.$t);

            team.Athletes = [];
            for (var j = 0; j < vm.Sheet.Athletes.length; j++)
            {
                if (vm.Sheet.Athletes[j].gsx$coach.$t == vm.Sheet.Teams[i].gsx$coach.$t)
                {
                    athlete = vm.Maps.Athletes.get(vm.Sheet.Athletes[j].gsx$athlete.$t);
                    if (athlete.MaxWeekWithScore == vm.MaxWeekWithScore)
                    {
                        athlete.Icon = '💪';
                    }
                    team.Athletes.push(athlete);
                }
            }

            team.Score = team.Score / team.Athletes.length;
            team.FormattedScore = team.Score.toFixed(1);
            vm.Teams.push(team);
        }




        for (var a = 0; a < vm.Teams.length; a++)
        {
            for (var i = 0; i < vm.Teams.length; i++)
            {
                for (var j = i + 1; j < vm.Teams.length; j++)
                {
                    if (vm.Teams[i].Score < vm.Teams[j].Score)
                    {
                        team = vm.Teams[i];
                        vm.Teams[i] = vm.Teams[j];
                        vm.Teams[j] = team;
                    }
                }
            }
        }

        score = 99999;
        order = 0;
        for (var i = 0; i < vm.Teams.length; i++)
        {
            if (vm.Teams[i].Score < score)
            {
                score = vm.Teams[i].Score;
                order = i + 1;
            }
            vm.Teams[i].Order = order;
            switch (order)
            {
                case 1:
                    vm.Teams[i].Icon = '🥇';
                    break;

                case 2:
                    vm.Teams[i].Icon = '🥈';
                    break;

                case 3:
                    vm.Teams[i].Icon = '🥉';
                    break;

                default:
                    vm.Teams[i].Icon = '😓';
                    break;
            }
        }
    }


    function OnFailure(response)
    {
        response = undefined;
    }
}

