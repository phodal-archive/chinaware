(function(root, undefined) {

  "use strict";


/* Chinaware main */

// Base function.
var Chinaware = function() {
  // Add functionality here.
  return true;
};


// Version.
Chinaware.VERSION = '0.0.0';


// Export to the root, which is probably `window`.
root.Chinaware = Chinaware;


/*     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
*     Underscore may be freely distributed under the MIT license.
*/

Chinaware.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

Chinaware.isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

Chinaware.defaults = function(obj) {
    if (!Chinaware.isObject(obj)) {
        return obj;
    }

    for (var i = 1, length = arguments.length; i < length; i++) {
        var source = arguments[i];
        for (var prop in source) {
            if (obj[prop] === void 0) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};

Chinaware.extend = function (obj) {
    if (!Chinaware.isObject(obj)) {
        return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};


/**
 * Chinaware Class 0.0.1
 * JavaScript Class built-in inheritance system
 *(c) 2015, Fengda Huang - http://www.phodal.com
 *
 * Copyright (c) 2011, 2012 Jeanine Adkisson.
 *  MIT Licensed.
 * Inspired by https://github.com/munro/self, https://github.com/jneen/pjs
 */

Chinaware.prototype.Class = (function (prototype, ownProperty) {

	var ChinawareClass = function Klass(_superclass, definition) {

        function Class() {
            var self = this instanceof Class ? this : new Basic();
            self.init.apply(self, arguments);
            return self;
        }

        function Basic() {
        }

        Class.Basic = Basic;

        var _super = Basic[prototype] = _superclass[prototype];
        var proto = Basic[prototype] = Class[prototype] = new Basic();

        proto.constructor = Class;

        Class.extend = function (def) {
            return new Klass(Class, def);
        };

        var open = (Class.open = function (def) {
            if (Chinaware.isFunction(def)) {
                def = def.call(Class, proto, _super, Class, _superclass);
            }

            if (Chinaware.isObject(def)) {
                for (var key in def) {
                    if (ownProperty.call(def, key)) {
                        proto[key] = def[key];
                    }
                }
            }

            if (!('init' in proto)) {
                proto.init = _superclass;
            }

            return Class;
        });

        return (open)(definition);
    };

    return ChinawareClass;

})('prototype', ({}).hasOwnProperty);


Chinaware.get = function (url, callback) {
    Chinaware.send(url, 'GET', callback);
};

Chinaware.load = function (url, callback) {
    Chinaware.send(url, 'GET', callback);
};

Chinaware.post = function (url, data, callback) {
    Chinaware.send(url, 'POST', callback, data);
};

Chinaware.send = function (url, method, callback, data) {
    data = data || null;
    var request = new XMLHttpRequest();
    if (callback instanceof Function) {
        request.onreadystatechange = function () {
            if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
                callback(request.responseText);
            }
        };
    }
    request.open(method, url, true);
    if (data instanceof Object) {
        data = JSON.stringify(data);
        request.setRequestHeader('Content-Type', 'application/json');
    }
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send(data);
};


var Event = {
    on: function(event, callback){
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(callback);
    },
    off: function(event, callback){
        this._events = this._events || {};
        if (event in this._events === false) {
            return;
        }
        this._events[event].splice(this._events[event].indexOf(callback), 1);
    },
    trigger: function(event){
        this._events = this._events || {};
        if (event in this._events === false) {
            return;
        }
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
};

var event = {
    Event: Event
};


Chinaware.prototype = Chinaware.extend(Chinaware.prototype, event);


/*
 * JavaScript Templates 2.4.1
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/*jslint evil: true, regexp: true, unparam: true */

var Template = {
    regexp: /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,
    encReg: /[<>&"'\x00]/g,
    encMap: {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "\"": "&quot;",
        "'": "&#39;"
    },
    arg: "o",
    helper: ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
    ",include=function(s,d){_s+=tmpl(s,d);}",

    tmpl: function (str, data){
        var f = !/[^\w\-\.:]/.test(str) ? "" : this.compile(str);
        return f(data, this);
    },

    compile: function (str) {
        var fn, variable;
        variable = this.arg + ',tmpl';
        fn = "var _e=tmpl.encode" + this.helper + ",_s='" + str.replace(this.regexp, this.func) + "';";
        fn = fn + "return _s;";
        return new Function(variable, fn);
    },

    encode: function (s) {
        /*jshint eqnull:true */
	    var encodeRegex = /[<>&"'\x00]/g,
            encodeMap = {
                "<": "&lt;",
                ">": "&gt;",
                "&": "&amp;",
                "\"": "&quot;",
                "'": "&#39;"
            };
        return (s == null ? "" : "" + s).replace(
            encodeRegex,
            function (c) {
                return encodeMap[c] || "";
            }
        );
    },

    func: function (s, p1, p2, p3, p4, p5) {
        var specialCharMAP = {
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t",
            " ": " "
        };

        if (p1) { // whitespace, quote and backspace in HTML context
            return specialCharMAP[p1] || "\\" + p1;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p2 === "=") {
                return "'+_e(" + p3 + ")+'";
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
        }
        if (p4) { // evaluation start tag: {%
            return "';";
        }
        if (p5) { // evaluation end tag: %}
            return "_s+='";
        }
    }
};

var template = {
    Template: Template
};

Chinaware.prototype = Chinaware.extend(Chinaware.prototype, template);


var FX = {
    easing: {
        linear: function(progress) {
            return progress;
        },
        quadratic: function(progress) {
            return Math.pow(progress, 2);
        },
        swing: function(progress) {
            return 0.5 - Math.cos(progress * Math.PI) / 2;
        },
        circ: function(progress) {
            return 1 - Math.sin(Math.acos(progress));
        },
        back: function(progress, x) {
            return Math.pow(progress, 2) * ((x + 1) * progress - x);
        },
        bounce: function(progress) {
            for (var a = 0, b = 1; 1; a += b, b /= 2) {
                if (progress >= (7 - 4 * a) / 11) {
                    return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                }
            }
        },
        elastic: function(progress, x) {
            return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
        }
    },
    animate: function(options) {
        var start = new Date();
        var id = setInterval(function() {
            var timePassed = new Date() - start;
            var progress = timePassed / options.duration;
            if (progress > 1) {
                progress = 1;
            }
            options.progress = progress;
            var delta = options.delta(progress);
            options.step(delta);
            if (progress == 1) {
                clearInterval(id);
                options.complete();
            }
        }, options.delay || 10);
    },
    fadeOut: function(element, options) {
        var to = 1;
        this.animate({
            duration: options.duration,
            delta: function(progress) {
                progress = this.progress;
                return FX.easing.swing(progress);
            },
            complete: options.complete,
            step: function(delta) {
                element.style.opacity = to - delta;
            }
        });
    },
    fadeIn: function(element, options) {
        var to = 0;
        this.animate({
            duration: options.duration,
            delta: function(progress) {
                progress = this.progress;
                return FX.easing.swing(progress);
            },
            complete: options.complete,
            step: function(delta) {
                element.style.opacity = to + delta;
            }
        });
    }
};

var fx = {
    FX: FX
};

Chinaware.prototype = Chinaware.extend(Chinaware.prototype, fx);



function Tiled(content) {
  this.layers = [];
  var that = this;

  this.renderLayer = function (layer) {
    if (layer.type !== 'tilelayer' || !layer.opacity) {
      return;
    }
    var s = content.canvas.cloneNode(),
      size = that.data.tilewidth;
    s = s.getContext('2d');
    if (that.layers.length < that.data.layers.length) {
      layer.data.forEach(function (tileIndex, i) {
        if (!tileIndex) {
          return;
        }
        var imgX, imgY, sizeX, sizeY,
          tile = that.data.tilesets[0];
        tileIndex--;
        imgX = (tileIndex % (tile.imagewidth / size)) * size;
        imgY = ~~(tileIndex / (tile.imagewidth / size)) * size;
        sizeX = (i % layer.width) * size;
        sizeY = ~~(i / layer.width) * size;
        s.drawImage(that.tileset, imgX, imgY, size, size, sizeX, sizeY, size, size);
      });
      that.layers.push(s.canvas.toDataURL());
      content.drawImage(s.canvas, 0, 0);
    }
    else {
      that.layers.forEach(function (src) {
        var i = document.createElement('img');
        i.src = src;
        content.drawImage(i, 0, 0);
      });
    }
  };

  this.renderLayers = function (layers) {
    function isObject(obj) {
      var type = typeof obj;
      return type === 'array';
    }

    layers = isObject(layers) ? layers : this.data.layers;
    layers.forEach(this.renderLayer);
  };

  this.loadTileset = function (json) {
    var that = this;
    this.data = json;
    this.tileset = document.createElement('img');
    this.tileset.src = json.tilesets[0].image;
    this.tileset.onload = function () {
      that.renderLayers(that.tileset);
    };
  };

  this.load = function (name) {
    var that = this;
    Chinaware.get('./images/' + name + '.json', function (data) {
      that.loadTileset(JSON.parse(data));
    });
  };
}

var tiled = {
  Tiled:Tiled
};

Chinaware.prototype = Chinaware.extend(Chinaware.prototype, tiled);


}(this));
