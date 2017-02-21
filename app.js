angular.module('minesweeperApp', [])
  .controller('minesweeperCtrl', function($scope, $filter) {
    $scope.length = 30;
    $scope.width = 30;
    $scope.mines = 100;

    $scope.flaggedCorrectlyCount = 0;
    $scope.flaggedCount = 0;

    $scope.createMineField = function() {
      var l = $scope.length;
      var w = $scope.width;
      var m = $scope.mines;
      $scope.lost = false;
      $scope.won = false;
      $scope.twidth = w * 20;
      /**
       * First create a l*w matrix
       **/
      $scope.mineField = [];
      for (var i = 0; i < l; i++) {
        var row = [];
        for (var j = 0; j < w; j++) {
          var cell = {};
          cell.content = 0;
          cell.status = 'covered';
          cell.x = i;
          cell.y = j;
          row.push(cell);
        }
        $scope.mineField.push(row);
      }
      var row, column;
      for (var b = 0; b < m; b++) {
        /**
         * Place `m` random mines
         **/
        row = Math.round(Math.random() * (l - 1));
        column = Math.round(Math.random() * (w - 1));
        if ($scope.mineField[row][column].content === "mine") {
          b--;
          continue;
        }
        $scope.mineField[row][column].content = "mine";
        /* And increase the number of adjacent mines for immediate cells */
        for (i = row - 1; i <= row + 1; i++) {
          for (j = column - 1; j <= column + 1; j++) {
            if ((i < 0 || i >= l || j < 0 || j >= w) || $scope.mineField[i][j].content === "mine") {
              continue;
            }
            $scope.mineField[i][j].content++;
          }
        }
      }
    }
    $scope.createMineField();

    $scope.uncover = function(cell) {
      if ($scope.won || $scope.lost)
        return;
      if (cell.status === "uncovered")
        return;
      if (cell.status === "flagged") {
        $scope.flag(cell, true);
      }
      if (cell.content === "mine") {
        cell.status = "losing";
        $scope.lost = true;
        return;
      }
      if (cell.content === 0) {
        cell.status = "uncovered";
        /* Recursively uncover all the surrounding cells */
        var x = cell.x;
        var y = cell.y;
        for (var i = x - 1; i <= x + 1; i++) {
          for (j = y - 1; j <= y + 1; j++) {
            if (i < 0 || i >= $scope.length || j < 0 || j >= $scope.width) {
              continue;
            }
            $scope.uncover($scope.mineField[i][j]);
          }
        }
      } else {
        cell.status = "uncovered";
      }
    };
    $scope.flag = function(cell, isUncovered) {
      if ($scope.won || $scope.lost)
        return;
      if (cell.status === "uncovered")
        return;
      if (cell.status === "flagged") {
        cell.status = isUncovered ? "uncovered" : "covered";
        $scope.flaggedCount--;
        if (cell.content === "mine") {
          $scope.flaggedCorrectlyCount--;
        }
      } else {
        cell.status = "flagged";
        $scope.flaggedCount++;
        if (cell.content === "mine") {
          $scope.flaggedCorrectlyCount++;
        }
      }
    };

    $scope.$watch("flaggedCorrectlyCount", function() {
      if ($scope.flaggedCorrectlyCount === $scope.flaggedCount && $scope.flaggedCorrectlyCount === $scope.mines) {
        $scope.won = true;
      }
    });
  })
  .directive('rightClick', function($parse) {
    return function(scope, elem, attrs) {
      elem.bind('contextmenu', function(event) {
        event.preventDefault();
        scope.$apply(attrs.rightClick);
      });
    };
  });;
