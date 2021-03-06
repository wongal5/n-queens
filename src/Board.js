// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num>%c is the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var rowArray = this.rows()[rowIndex];
      var count = 0;
      for (var i = 0; i < rowArray.length; i++) {
        if (rowArray[i] === 1) {
          count += 1;
        }
      }
      return count > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var boardArrays = this.rows();
      for (var i = 0; i < boardArrays.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true; 
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var boardArrays = this.rows();
      var count = 0;
      for (var i = 0; i < boardArrays.length; i++) {
        if (boardArrays[i][colIndex] === 1) {
          count += 1;
        }
      }
      return count > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var boardArrays = this.rows();
      for (var i = 0; i < boardArrays.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var boardArrays = this.rows();
      var count = 0;
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        for (var i = 0; i < boardArrays.length; i++) {
          if (majorDiagonalColumnIndexAtFirstRow >= boardArrays.length) {
            return count > 1;
          } else if (boardArrays[i][majorDiagonalColumnIndexAtFirstRow] === 1) {
            count += 1;
          }
          majorDiagonalColumnIndexAtFirstRow++;
        }
        return count > 1;
      }
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        majorDiagonalColumnIndexAtFirstRow *= -1;
        for (var a = 0; a < boardArrays.length; a++) {
          if (majorDiagonalColumnIndexAtFirstRow === boardArrays.length) {
            return count > 1;
          } else if (boardArrays[majorDiagonalColumnIndexAtFirstRow][a] === 1) {
            count += 1;
          }
          majorDiagonalColumnIndexAtFirstRow++; 
        }
        return count > 1;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var boardArrays = this.rows();
      for (var i = boardArrays.length * -1 + 1; i < boardArrays.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var boardArrays = this.rows();
      var count = 0;
      if (minorDiagonalColumnIndexAtFirstRow < boardArrays.length) {
        for (var i = 0; i < boardArrays.length; i++) {
          if (minorDiagonalColumnIndexAtFirstRow < 0) {
            return count > 1;
          } else if (boardArrays[i][minorDiagonalColumnIndexAtFirstRow] === 1) {
            count += 1;
          }
          minorDiagonalColumnIndexAtFirstRow--;
        }
        return count > 1;
      }
      if (minorDiagonalColumnIndexAtFirstRow >= boardArrays.length && minorDiagonalColumnIndexAtFirstRow < (2 * boardArrays.length - 1)) {
        minorDiagonalColumnIndexAtFirstRow = minorDiagonalColumnIndexAtFirstRow - boardArrays.length + 1;
        for (var b = boardArrays.length - 1; b > 0; b--) {
          if (minorDiagonalColumnIndexAtFirstRow === boardArrays.length) {
            return count > 1;
          } else if (boardArrays[minorDiagonalColumnIndexAtFirstRow][b] === 1) {
            count += 1;
          }
          minorDiagonalColumnIndexAtFirstRow++; 
        }
        return count > 1;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var boardArrays = this.rows();
      var count = 0;
      for (var i = 0; i < 2 * boardArrays.length - 1; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    /*--------------------  WE USE THESE HELPER FUNCTIONS ----------------*/
    
    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAtUsed: function(rowIndex) {
      var rowArray = this.rows()[rowIndex];
      var count = 0;
      for (var i = 0; i < rowArray.length; i++) {
        if (rowArray[i] === 1) {
          count += 1;
        }
      }
      return count > 0;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflictsUsed: function() {
      var boardArrays = this.rows();
      for (var i = 0; i < boardArrays.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true; 
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAtUsed: function(colIndex) {
      var boardArrays = this.rows();
      var count = 0;
      for (var i = 0; i < boardArrays.length; i++) {
        if (boardArrays[i][colIndex] === 1) {
          count += 1;
        }
      }
      return count > 0;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflictsUsed: function() {
      var boardArrays = this.rows();
      for (var i = 0; i < boardArrays.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAtUsed: function(majorDiagonalColumnIndexAtFirstRow) {
      var boardArrays = this.rows();
      var count = 0;
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        for (var i = 0; i < boardArrays.length; i++) {
          if (majorDiagonalColumnIndexAtFirstRow >= boardArrays.length) {
            return count > 0;
          } else if (boardArrays[i][majorDiagonalColumnIndexAtFirstRow] === 1) {
            count += 1;
          }
          majorDiagonalColumnIndexAtFirstRow++;
        }
        return count > 0;
      }
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        majorDiagonalColumnIndexAtFirstRow *= -1;
        for (var a = 0; a < boardArrays.length; a++) {
          if (majorDiagonalColumnIndexAtFirstRow === boardArrays.length) {
            return count > 0;
          } else if (boardArrays[majorDiagonalColumnIndexAtFirstRow][a] === 1) {
            count += 1;
          }
          majorDiagonalColumnIndexAtFirstRow++; 
        }
        return count > 0;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflictsUsed: function() {
      var boardArrays = this.rows();
      for (var i = boardArrays.length * -1 + 1; i < boardArrays.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAtUsed: function(minorDiagonalColumnIndexAtFirstRow) {
      var boardArrays = this.rows();
      var count = 0;
      if (minorDiagonalColumnIndexAtFirstRow < boardArrays.length) {
        for (var i = 0; i < boardArrays.length; i++) {
          if (minorDiagonalColumnIndexAtFirstRow < 0) {
            return count > 0;
          } else if (boardArrays[i][minorDiagonalColumnIndexAtFirstRow] === 1) {
            count += 1;
          }
          minorDiagonalColumnIndexAtFirstRow--;
        }
        return count > 0;
      }
      if (minorDiagonalColumnIndexAtFirstRow >= boardArrays.length && minorDiagonalColumnIndexAtFirstRow < (2 * boardArrays.length - 1)) {
        minorDiagonalColumnIndexAtFirstRow = minorDiagonalColumnIndexAtFirstRow - boardArrays.length + 1;
        for (var b = boardArrays.length - 1; b > 0; b--) {
          if (minorDiagonalColumnIndexAtFirstRow === boardArrays.length) {
            return count > 0;
          } else if (boardArrays[minorDiagonalColumnIndexAtFirstRow][b] === 1) {
            count += 1;
          }
          minorDiagonalColumnIndexAtFirstRow++; 
        }
        return count > 0;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflictsUsed: function() {
      var boardArrays = this.rows();
      var count = 0;
      for (var i = 0; i < 2 * boardArrays.length - 1; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }
    
    
    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
