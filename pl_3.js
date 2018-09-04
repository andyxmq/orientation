;((function(win,pl){
  var timer,
      meta = {},
      cbs = [];

  var html = document.documentElement;
  var event = function(){
    var fnsList = {};

    var listen = function(key, fn){
      if(!fnsList[key]){
        fnsList[key] = [];
      }
      fnsList[key].push(fn);
    };
    var trigger = function(){
      var key = [].shift.call(arguments),
          fns = fnsList[key];
      if(!fns || fns.length === 0){
        return false;
      }
      for(var i=0, fn;fn=fns[i++];){
        fn.apply(this,arguments);
      }
    };
    var remove = function(key, fn){
      var fns = fnsList[key];
      if(!fns){
        return false;
      }
      if(!fn){
        fns && (fns.length = 0);
      }else{
        for(var j = 0, l = fns.length; j < l; j++){
          if(fn === fns[j]){
            fns.splice(j,1);
          }
        }
      }
    };
    return {
      listen,
      trigger,
      remove
    }
  }();
  
  function loadStyleString(css){
    var _style = document.createElement("style"),
        _head = document.head ? document.head : document.getElementsByTagName('head')[0];

    _style.type = "text/css";
    try{
      _style.appendChild(document.createTextNode(css));
    } catch (ex) {
      // lower IE support ,if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
      _style.styleSheet.cssText = css;
    }
    _head.appendChild(_style);
    return _style;
  }

  //callback
  var resizeCB = function(){
    var hstyle = win.getComputedStyle(html, null),
        ffstr = hstyle['font-family'],
        pstr = 'portrait,'+ ffstr,
        lstr = 'landscape,'+ffstr,
        cssstr = '@media(orientation: portrait){.orientation{font-family: '+ pstr +';font-size: 30px;}} @media(orientation: landscape) {.orientation{font-family:'+lstr+'}}'
    meta.font = ffstr;
    loadStyleString(cssstr);
    html.className = 'orientation '+html.className;
    if(hstyle['font-family'] === pstr){ //初始化判断
      meta.init = 'portrait';
      meat.current = 'portrait';
    }else{
      meta.init = 'landscape';
      meta.current = 'landscape';
    }

    return function(){
      if(hstyle['font-family'] === pstr){
        if(meta.current !== 'portrait'){
          meta.current = 'portrait';
          event.trigger('__orientationChange__', meta);
        }
      }else{
        if (meta.current !== 'landscape') {
          meta.current = 'landscape';
          event.trigger('__orientationChange__', meta);
        }
      }
    }
  }();

  // win.addEven
  win.addEventListener('resize', function(){
    timer && win.clearTimeout(timer);
    timer = setTimeout(resizeCB, 300)
  }, false)

  event.listen('__orientationChange__', function(event) {
    if (cbs.length === 0) {
        return false;
    }
    for (var i = 0, cb; cb = cbs[i++];) {
        if (typeof cb === 'function') {
            cb.call(pl, event);
        } else {
            throw new Error('The accepted argument of pl.on must be a function.');
        }
    }
  });

  //接口
  pl.orientation = meta;
  pl.event = event;
  pl.on = function(cb) {
    cbs.push(cb);
  }
})(window,window['pl'] || (window['pl'] = {})));