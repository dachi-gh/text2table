var text2table = (function(){
  'use strict';
  
  var regex, input = null, output = '';
  
  var data = {
    expression: '[\t\|]+',
    modifier: 'g',
    style: {
      'hor': '-', 'ver': '|',
      'tl': '+', 'tm': '+', 'tr': '+',
      'ml': '+', 'mm': '+', 'mr': '+',
      'bl': '+', 'bm': '+', 'br': '+'
    }
  };
  
  var extend = function(target, source) {
    if(source) {
      for(var key in source) {
        var val = source[key];
        if(typeof val !== 'undefined') {
          target[key] = val;
        }
      }
    }
    return target;
  };
  
  var initialize = function() {
    if (input === null) {
      throw 'Input is not given';
    }
    regex = new RegExp(data.expression, data.modifier);
    return true;
  };
  
  var toTable = (function() {
    var rows;
    var columns = [], isNumeric = [];
    var regexps = {
      rows: /[\r\n]+/,
      spacenum: /^(\s*-?\d+\s*|\s*)$/
    };
    
    var getRows = function() {
      rows = input.split(new RegExp(regexps.rows));
      return rows;
    };
  
    var getCol = function(n) {
      return rows[n].split(regex);
    };
  
    var getCols = function() {
      for (var i = 0; i < rows.length; i += 1) {
        var col = getCol(i);
        for (var s = 0; s < col.length; s += 1) {
          var data = col[s];
          
          if (typeof columns[s] === 'undefined') {
            isNumeric[s] = true;
          }

          if (isNumeric[s] && !data.match(new RegExp(regexps.spacenum)) && i !== 0) {
            isNumeric[s] = false;
          }
          
          if (typeof columns[s] === 'undefined' || columns[s] < data.length) {
            columns[s] = data.length;
          }
        }
      }
      return columns;
    };
    
    var alignText = function(pos, chr, str, len) {
      var more = len - str.length;
      var result = '';
    
      chr = (typeof chr === 'undefined') ? ' ' : chr;
      pos = (typeof pos === 'undefined') ? ' ' : pos;
    
      if (pos === 'right') {
        return new Array(more + 1).join(chr) + str;
      } else if (pos === 'left') {
        return str + new Array(more + 1).join(chr);
      } else if (pos === 'center') {
        var left = Math.floor(more / 2);
        var right = more - left;
        return new Array(left + 1).join(chr) + str + new Array(right + 1).join(chr);
      }
    };
    
    var drawTop = function(i) {
      if (i === 0) {
        output += data.style.tl;
        for (var s = 0; s < columns.length; s += 1) {
          output += new Array(columns[s] + 3).join(data.style.hor);
          if (s < columns.length - 1) {
            output += data.style.tm;
          }
          else output += data.style.tr;
        }
        output += "\n";
      }
    };
  
    var drawHeaders = function() {
      for (var s = 0; s < columns.length; s += 1) {
        output += new Array(columns[s] + 3).join(data.style.hor);
        if (s < columns.length - 1) {
          output += data.style.mm;
        }
        else {
          output += data.style.mr;
        }
      }
    };
  
    var drawData = function(i, cols) {
      for (var s = 0; s < columns.length; s += 1) {
        var string = cols[s] || '';
  
        var align = (i === 0) ? 'center' : 'left';
        
        // if (isNumeric[s] && i > 0) { align = "right"; }

        string = alignText(align, ' ', string, columns[s]);
        output += ' ' + string + ' ' + data.style.ver;
      }
    };
  
    var drawBottom = function(i) {
      for (var s = 0; s < columns.length; s += 1) {
        output += new Array(columns[s] + 3).join(data.style.hor)
      
        if (s > columns.length - 1) output += data.style.br;
        else output += data.style.bm;
      }
    };
    
    var getResult = function() {
      getCols();
      
      for (var n = 0; n < rows.length; n += 1) {
        drawTop(n);

        if (n === 1) {
          output += data.style.ml;
          drawHeaders();
          output += "\n";
        }

        output += data.style.ver;
        drawData(n, getCol(n));
        output += "\n";

        if (n === rows.length - 1) {
          output += data.style.bl;
          drawBottom();
        }
      }
    };
    
    return {
      convert: function() {
        if (getRows()[rows.length - 1] === '') { rows.pop(); }
        getResult();
        
        return true;
      }
    };
  })(this);
  
  // toText

  return {
    data: function(opts) {
      extend(data, opts);
    },
    toTable: function(i) {
      input = i || null;
      
      if (initialize() && toTable.convert()) {
        return output;
      } else {
        throw 'Error occured while executing `toTable`';
        return false;
      }
    },
    toText: function() {
    }
  };
})();