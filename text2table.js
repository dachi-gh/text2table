var text2table = (function(){
  'use strict';
  
  var data = {
    expression: '\t',
    modifier: 'g'
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
  
  return {
    data: function(opts) {
      extend(data, opts);
    }
  };
})();
