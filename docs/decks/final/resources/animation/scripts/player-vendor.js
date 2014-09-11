/* build: `node build.js modules=ALL exclude=gestures,cufon,json minifier=uglifyjs` */
/*! Fabric.js Copyright 2008-2014, Printio (Juriy Zaytsev, Maxim Chernyak) */
var fabric = fabric || { version: '1.4.11' };
typeof exports != 'undefined' && (exports.fabric = fabric), typeof document != 'undefined' && typeof window != 'undefined' ? (fabric.document = document, fabric.window = window) : (fabric.document = require('jsdom').jsdom('<!DOCTYPE html><html><head></head><body></body></html>'), fabric.window = fabric.document.createWindow()), fabric.isTouchSupported = 'ontouchstart' in fabric.document.documentElement, fabric.isLikelyNode = typeof Buffer != 'undefined' && typeof window == 'undefined', fabric.SHARED_ATTRIBUTES = [
  'display',
  'transform',
  'fill',
  'fill-opacity',
  'fill-rule',
  'opacity',
  'stroke',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width'
], fabric.DPI = 96, function () {
  function e(e, t) {
    if (!this.__eventListeners[e])
      return;
    t ? fabric.util.removeFromArray(this.__eventListeners[e], t) : this.__eventListeners[e].length = 0;
  }
  function t(e, t) {
    this.__eventListeners || (this.__eventListeners = {});
    if (arguments.length === 1)
      for (var n in e)
        this.on(n, e[n]);
    else
      this.__eventListeners[e] || (this.__eventListeners[e] = []), this.__eventListeners[e].push(t);
    return this;
  }
  function n(t, n) {
    if (!this.__eventListeners)
      return;
    if (arguments.length === 0)
      this.__eventListeners = {};
    else if (arguments.length === 1 && typeof arguments[0] == 'object')
      for (var r in t)
        e.call(this, r, t[r]);
    else
      e.call(this, t, n);
    return this;
  }
  function r(e, t) {
    if (!this.__eventListeners)
      return;
    var n = this.__eventListeners[e];
    if (!n)
      return;
    for (var r = 0, i = n.length; r < i; r++)
      n[r].call(this, t || {});
    return this;
  }
  fabric.Observable = {
    observe: t,
    stopObserving: n,
    fire: r,
    on: t,
    off: n,
    trigger: r
  };
}(), fabric.Collection = {
  add: function () {
    this._objects.push.apply(this._objects, arguments);
    for (var e = 0, t = arguments.length; e < t; e++)
      this._onObjectAdded(arguments[e]);
    return this.renderOnAddRemove && this.renderAll(), this;
  },
  insertAt: function (e, t, n) {
    var r = this.getObjects();
    return n ? r[t] = e : r.splice(t, 0, e), this._onObjectAdded(e), this.renderOnAddRemove && this.renderAll(), this;
  },
  remove: function () {
    var e = this.getObjects(), t;
    for (var n = 0, r = arguments.length; n < r; n++)
      t = e.indexOf(arguments[n]), t !== -1 && (e.splice(t, 1), this._onObjectRemoved(arguments[n]));
    return this.renderOnAddRemove && this.renderAll(), this;
  },
  forEachObject: function (e, t) {
    var n = this.getObjects(), r = n.length;
    while (r--)
      e.call(t, n[r], r, n);
    return this;
  },
  getObjects: function (e) {
    return typeof e == 'undefined' ? this._objects : this._objects.filter(function (t) {
      return t.type === e;
    });
  },
  item: function (e) {
    return this.getObjects()[e];
  },
  isEmpty: function () {
    return this.getObjects().length === 0;
  },
  size: function () {
    return this.getObjects().length;
  },
  contains: function (e) {
    return this.getObjects().indexOf(e) > -1;
  },
  complexity: function () {
    return this.getObjects().reduce(function (e, t) {
      return e += t.complexity ? t.complexity() : 0, e;
    }, 0);
  }
}, function (e) {
  var t = Math.sqrt, n = Math.atan2, r = Math.PI / 180;
  fabric.util = {
    removeFromArray: function (e, t) {
      var n = e.indexOf(t);
      return n !== -1 && e.splice(n, 1), e;
    },
    getRandomInt: function (e, t) {
      return Math.floor(Math.random() * (t - e + 1)) + e;
    },
    degreesToRadians: function (e) {
      return e * r;
    },
    radiansToDegrees: function (e) {
      return e / r;
    },
    rotatePoint: function (e, t, n) {
      var r = Math.sin(n), i = Math.cos(n);
      e.subtractEquals(t);
      var s = e.x * i - e.y * r, o = e.x * r + e.y * i;
      return new fabric.Point(s, o).addEquals(t);
    },
    transformPoint: function (e, t, n) {
      return n ? new fabric.Point(t[0] * e.x + t[1] * e.y, t[2] * e.x + t[3] * e.y) : new fabric.Point(t[0] * e.x + t[1] * e.y + t[4], t[2] * e.x + t[3] * e.y + t[5]);
    },
    invertTransform: function (e) {
      var t = e.slice(), n = 1 / (e[0] * e[3] - e[1] * e[2]);
      t = [
        n * e[3],
        -n * e[1],
        -n * e[2],
        n * e[0],
        0,
        0
      ];
      var r = fabric.util.transformPoint({
          x: e[4],
          y: e[5]
        }, t);
      return t[4] = -r.x, t[5] = -r.y, t;
    },
    toFixed: function (e, t) {
      return parseFloat(Number(e).toFixed(t));
    },
    parseUnit: function (e) {
      var t = /\D{0,2}$/.exec(e), n = parseFloat(e);
      switch (t[0]) {
      case 'mm':
        return n * fabric.DPI / 25.4;
      case 'cm':
        return n * fabric.DPI / 2.54;
      case 'in':
        return n * fabric.DPI;
      case 'pt':
        return n * fabric.DPI / 72;
      case 'pc':
        return n * fabric.DPI / 72 * 12;
      default:
        return n;
      }
    },
    falseFunction: function () {
      return !1;
    },
    getKlass: function (e, t) {
      return e = fabric.util.string.camelize(e.charAt(0).toUpperCase() + e.slice(1)), fabric.util.resolveNamespace(t)[e];
    },
    resolveNamespace: function (t) {
      if (!t)
        return fabric;
      var n = t.split('.'), r = n.length, i = e || fabric.window;
      for (var s = 0; s < r; ++s)
        i = i[n[s]];
      return i;
    },
    loadImage: function (e, t, n, r) {
      if (!e) {
        t && t.call(n, e);
        return;
      }
      var i = fabric.util.createImage();
      i.onload = function () {
        t && t.call(n, i), i = i.onload = i.onerror = null;
      }, i.onerror = function () {
        fabric.log('Error loading ' + i.src), t && t.call(n, null, !0), i = i.onload = i.onerror = null;
      }, e.indexOf('data') !== 0 && typeof r != 'undefined' && (i.crossOrigin = r), i.src = e;
    },
    enlivenObjects: function (e, t, n, r) {
      function i() {
        ++o === u && t && t(s);
      }
      e = e || [];
      var s = [], o = 0, u = e.length;
      if (!u) {
        t && t(s);
        return;
      }
      e.forEach(function (e, t) {
        if (!e || !e.type) {
          i();
          return;
        }
        var o = fabric.util.getKlass(e.type, n);
        o.async ? o.fromObject(e, function (n, o) {
          o || (s[t] = n, r && r(e, s[t])), i();
        }) : (s[t] = o.fromObject(e), r && r(e, s[t]), i());
      });
    },
    groupSVGElements: function (e, t, n) {
      var r;
      return r = new fabric.PathGroup(e, t), typeof n != 'undefined' && r.setSourcePath(n), r;
    },
    populateWithProperties: function (e, t, n) {
      if (n && Object.prototype.toString.call(n) === '[object Array]')
        for (var r = 0, i = n.length; r < i; r++)
          n[r] in e && (t[n[r]] = e[n[r]]);
    },
    drawDashedLine: function (e, r, i, s, o, u) {
      var a = s - r, f = o - i, l = t(a * a + f * f), c = n(f, a), h = u.length, p = 0, d = !0;
      e.save(), e.translate(r, i), e.moveTo(0, 0), e.rotate(c), r = 0;
      while (l > r)
        r += u[p++ % h], r > l && (r = l), e[d ? 'lineTo' : 'moveTo'](r, 0), d = !d;
      e.restore();
    },
    createCanvasElement: function (e) {
      return e || (e = fabric.document.createElement('canvas')), !e.getContext && typeof G_vmlCanvasManager != 'undefined' && G_vmlCanvasManager.initElement(e), e;
    },
    createImage: function () {
      return fabric.isLikelyNode ? new (require('canvas')).Image() : fabric.document.createElement('img');
    },
    createAccessors: function (e) {
      var t = e.prototype;
      for (var n = t.stateProperties.length; n--;) {
        var r = t.stateProperties[n], i = r.charAt(0).toUpperCase() + r.slice(1), s = 'set' + i, o = 'get' + i;
        t[o] || (t[o] = function (e) {
          return new Function('return this.get("' + e + '")');
        }(r)), t[s] || (t[s] = function (e) {
          return new Function('value', 'return this.set("' + e + '", value)');
        }(r));
      }
    },
    clipContext: function (e, t) {
      t.save(), t.beginPath(), e.clipTo(t), t.clip();
    },
    multiplyTransformMatrices: function (e, t) {
      var n = [
          [
            e[0],
            e[2],
            e[4]
          ],
          [
            e[1],
            e[3],
            e[5]
          ],
          [
            0,
            0,
            1
          ]
        ], r = [
          [
            t[0],
            t[2],
            t[4]
          ],
          [
            t[1],
            t[3],
            t[5]
          ],
          [
            0,
            0,
            1
          ]
        ], i = [];
      for (var s = 0; s < 3; s++) {
        i[s] = [];
        for (var o = 0; o < 3; o++) {
          var u = 0;
          for (var a = 0; a < 3; a++)
            u += n[s][a] * r[a][o];
          i[s][o] = u;
        }
      }
      return [
        i[0][0],
        i[1][0],
        i[0][1],
        i[1][1],
        i[0][2],
        i[1][2]
      ];
    },
    getFunctionBody: function (e) {
      return (String(e).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
    },
    isTransparent: function (e, t, n, r) {
      r > 0 && (t > r ? t -= r : t = 0, n > r ? n -= r : n = 0);
      var i = !0, s = e.getImageData(t, n, r * 2 || 1, r * 2 || 1);
      for (var o = 3, u = s.data.length; o < u; o += 4) {
        var a = s.data[o];
        i = a <= 0;
        if (i === !1)
          break;
      }
      return s = null, i;
    }
  };
}(typeof exports != 'undefined' ? exports : this), function () {
  function r(t, r, o, u, a, f, l) {
    var c = n.call(arguments);
    if (e[c])
      return e[c];
    var h = Math.PI, p = l * (h / 180), d = Math.sin(p), v = Math.cos(p), m = 0, g = 0;
    o = Math.abs(o), u = Math.abs(u);
    var y = -v * t - d * r, b = -v * r + d * t, w = o * o, E = u * u, S = b * b, x = y * y, T = 4 * w * E - w * S - E * x, N = 0;
    if (T < 0) {
      var C = Math.sqrt(1 - 0.25 * T / (w * E));
      o *= C, u *= C;
    } else
      N = (a === f ? -0.5 : 0.5) * Math.sqrt(T / (w * S + E * x));
    var k = N * o * b / u, L = -N * u * y / o, A = v * k - d * L + t / 2, O = d * k + v * L + r / 2, M = s(1, 0, (y - k) / o, (b - L) / u), _ = s((y - k) / o, (b - L) / u, (-y - k) / o, (-b - L) / u);
    f === 0 && _ > 0 ? _ -= 2 * h : f === 1 && _ < 0 && (_ += 2 * h);
    var D = Math.ceil(Math.abs(_ / (h * 0.5))), P = [], H = _ / D, B = 8 / 3 * Math.sin(H / 4) * Math.sin(H / 4) / Math.sin(H / 2), j = M + H;
    for (var F = 0; F < D; F++)
      P[F] = i(M, j, v, d, o, u, A, O, B, m, g), m = P[F][4], g = P[F][5], M += H, j += H;
    return e[c] = P, P;
  }
  function i(e, r, i, s, o, u, a, f, l, c, h) {
    var p = n.call(arguments);
    if (t[p])
      return t[p];
    var d = Math.cos(e), v = Math.sin(e), m = Math.cos(r), g = Math.sin(r), y = i * o * m - s * u * g + a, b = s * o * m + i * u * g + f, w = c + l * (-i * o * v - s * u * d), E = h + l * (-s * o * v + i * u * d), S = y + l * (i * o * g + s * u * m), x = b + l * (s * o * g - i * u * m);
    return t[p] = [
      w,
      E,
      S,
      x,
      y,
      b
    ], t[p];
  }
  function s(e, t, n, r) {
    var i = Math.atan2(t, e), s = Math.atan2(r, n);
    return s >= i ? s - i : 2 * Math.PI - (i - s);
  }
  var e = {}, t = {}, n = Array.prototype.join;
  fabric.util.drawArc = function (e, t, n, i) {
    var s = i[0], o = i[1], u = i[2], a = i[3], f = i[4], l = i[5], c = i[6], h = [
        [],
        [],
        [],
        []
      ], p = r(l - t, c - n, s, o, a, f, u);
    for (var d = 0; d < p.length; d++)
      h[d][0] = p[d][0] + t, h[d][1] = p[d][1] + n, h[d][2] = p[d][2] + t, h[d][3] = p[d][3] + n, h[d][4] = p[d][4] + t, h[d][5] = p[d][5] + n, e.bezierCurveTo.apply(e, h[d]);
  };
}(), function () {
  function t(t, n) {
    var r = e.call(arguments, 2), i = [];
    for (var s = 0, o = t.length; s < o; s++)
      i[s] = r.length ? t[s][n].apply(t[s], r) : t[s][n].call(t[s]);
    return i;
  }
  function n(e, t) {
    return i(e, t, function (e, t) {
      return e >= t;
    });
  }
  function r(e, t) {
    return i(e, t, function (e, t) {
      return e < t;
    });
  }
  function i(e, t, n) {
    if (!e || e.length === 0)
      return;
    var r = e.length - 1, i = t ? e[r][t] : e[r];
    if (t)
      while (r--)
        n(e[r][t], i) && (i = e[r][t]);
    else
      while (r--)
        n(e[r], i) && (i = e[r]);
    return i;
  }
  var e = Array.prototype.slice;
  Array.prototype.indexOf || (Array.prototype.indexOf = function (e) {
    if (this === void 0 || this === null)
      throw new TypeError();
    var t = Object(this), n = t.length >>> 0;
    if (n === 0)
      return -1;
    var r = 0;
    arguments.length > 0 && (r = Number(arguments[1]), r !== r ? r = 0 : r !== 0 && r !== Number.POSITIVE_INFINITY && r !== Number.NEGATIVE_INFINITY && (r = (r > 0 || -1) * Math.floor(Math.abs(r))));
    if (r >= n)
      return -1;
    var i = r >= 0 ? r : Math.max(n - Math.abs(r), 0);
    for (; i < n; i++)
      if (i in t && t[i] === e)
        return i;
    return -1;
  }), Array.prototype.forEach || (Array.prototype.forEach = function (e, t) {
    for (var n = 0, r = this.length >>> 0; n < r; n++)
      n in this && e.call(t, this[n], n, this);
  }), Array.prototype.map || (Array.prototype.map = function (e, t) {
    var n = [];
    for (var r = 0, i = this.length >>> 0; r < i; r++)
      r in this && (n[r] = e.call(t, this[r], r, this));
    return n;
  }), Array.prototype.every || (Array.prototype.every = function (e, t) {
    for (var n = 0, r = this.length >>> 0; n < r; n++)
      if (n in this && !e.call(t, this[n], n, this))
        return !1;
    return !0;
  }), Array.prototype.some || (Array.prototype.some = function (e, t) {
    for (var n = 0, r = this.length >>> 0; n < r; n++)
      if (n in this && e.call(t, this[n], n, this))
        return !0;
    return !1;
  }), Array.prototype.filter || (Array.prototype.filter = function (e, t) {
    var n = [], r;
    for (var i = 0, s = this.length >>> 0; i < s; i++)
      i in this && (r = this[i], e.call(t, r, i, this) && n.push(r));
    return n;
  }), Array.prototype.reduce || (Array.prototype.reduce = function (e) {
    var t = this.length >>> 0, n = 0, r;
    if (arguments.length > 1)
      r = arguments[1];
    else
      do {
        if (n in this) {
          r = this[n++];
          break;
        }
        if (++n >= t)
          throw new TypeError();
      } while (!0);
    for (; n < t; n++)
      n in this && (r = e.call(null, r, this[n], n, this));
    return r;
  }), fabric.util.array = {
    invoke: t,
    min: r,
    max: n
  };
}(), function () {
  function e(e, t) {
    for (var n in t)
      e[n] = t[n];
    return e;
  }
  function t(t) {
    return e({}, t);
  }
  fabric.util.object = {
    extend: e,
    clone: t
  };
}(), function () {
  function e(e) {
    return e.replace(/-+(.)?/g, function (e, t) {
      return t ? t.toUpperCase() : '';
    });
  }
  function t(e, t) {
    return e.charAt(0).toUpperCase() + (t ? e.slice(1) : e.slice(1).toLowerCase());
  }
  function n(e) {
    return e.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  String.prototype.trim || (String.prototype.trim = function () {
    return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '');
  }), fabric.util.string = {
    camelize: e,
    capitalize: t,
    escapeXml: n
  };
}(), function () {
  var e = Array.prototype.slice, t = Function.prototype.apply, n = function () {
    };
  Function.prototype.bind || (Function.prototype.bind = function (r) {
    var i = this, s = e.call(arguments, 1), o;
    return s.length ? o = function () {
      return t.call(i, this instanceof n ? this : r, s.concat(e.call(arguments)));
    } : o = function () {
      return t.call(i, this instanceof n ? this : r, arguments);
    }, n.prototype = this.prototype, o.prototype = new n(), o;
  });
}(), function () {
  function i() {
  }
  function s(t) {
    var n = this.constructor.superclass.prototype[t];
    return arguments.length > 1 ? n.apply(this, e.call(arguments, 1)) : n.call(this);
  }
  function o() {
    function u() {
      this.initialize.apply(this, arguments);
    }
    var n = null, o = e.call(arguments, 0);
    typeof o[0] == 'function' && (n = o.shift()), u.superclass = n, u.subclasses = [], n && (i.prototype = n.prototype, u.prototype = new i(), n.subclasses.push(u));
    for (var a = 0, f = o.length; a < f; a++)
      r(u, o[a], n);
    return u.prototype.initialize || (u.prototype.initialize = t), u.prototype.constructor = u, u.prototype.callSuper = s, u;
  }
  var e = Array.prototype.slice, t = function () {
    }, n = function () {
      for (var e in { toString: 1 })
        if (e === 'toString')
          return !1;
      return !0;
    }(), r = function (e, t, r) {
      for (var i in t)
        i in e.prototype && typeof e.prototype[i] == 'function' && (t[i] + '').indexOf('callSuper') > -1 ? e.prototype[i] = function (e) {
          return function () {
            var n = this.constructor.superclass;
            this.constructor.superclass = r;
            var i = t[e].apply(this, arguments);
            this.constructor.superclass = n;
            if (e !== 'initialize')
              return i;
          };
        }(i) : e.prototype[i] = t[i], n && (t.toString !== Object.prototype.toString && (e.prototype.toString = t.toString), t.valueOf !== Object.prototype.valueOf && (e.prototype.valueOf = t.valueOf));
    };
  fabric.util.createClass = o;
}(), function () {
  function t(e) {
    var t = Array.prototype.slice.call(arguments, 1), n, r, i = t.length;
    for (r = 0; r < i; r++) {
      n = typeof e[t[r]];
      if (!/^(?:function|object|unknown)$/.test(n))
        return !1;
    }
    return !0;
  }
  function s(e, t) {
    return {
      handler: t,
      wrappedHandler: o(e, t)
    };
  }
  function o(e, t) {
    return function (r) {
      t.call(n(e), r || fabric.window.event);
    };
  }
  function u(e, t) {
    return function (n) {
      if (c[e] && c[e][t]) {
        var r = c[e][t];
        for (var i = 0, s = r.length; i < s; i++)
          r[i].call(this, n || fabric.window.event);
      }
    };
  }
  function d(t, n) {
    t || (t = fabric.window.event);
    var r = t.target || (typeof t.srcElement !== e ? t.srcElement : null), i = fabric.util.getScrollLeftTop(r, n);
    return {
      x: v(t) + i.left,
      y: m(t) + i.top
    };
  }
  function g(e, t, n) {
    var r = e.type === 'touchend' ? 'changedTouches' : 'touches';
    return e[r] && e[r][0] ? e[r][0][t] - (e[r][0][t] - e[r][0][n]) || e[n] : e[n];
  }
  var e = 'unknown', n, r, i = function () {
      var e = 0;
      return function (t) {
        return t.__uniqueID || (t.__uniqueID = 'uniqueID__' + e++);
      };
    }();
  (function () {
    var e = {};
    n = function (t) {
      return e[t];
    }, r = function (t, n) {
      e[t] = n;
    };
  }());
  var a = t(fabric.document.documentElement, 'addEventListener', 'removeEventListener') && t(fabric.window, 'addEventListener', 'removeEventListener'), f = t(fabric.document.documentElement, 'attachEvent', 'detachEvent') && t(fabric.window, 'attachEvent', 'detachEvent'), l = {}, c = {}, h, p;
  a ? (h = function (e, t, n) {
    e.addEventListener(t, n, !1);
  }, p = function (e, t, n) {
    e.removeEventListener(t, n, !1);
  }) : f ? (h = function (e, t, n) {
    var o = i(e);
    r(o, e), l[o] || (l[o] = {}), l[o][t] || (l[o][t] = []);
    var u = s(o, n);
    l[o][t].push(u), e.attachEvent('on' + t, u.wrappedHandler);
  }, p = function (e, t, n) {
    var r = i(e), s;
    if (l[r] && l[r][t])
      for (var o = 0, u = l[r][t].length; o < u; o++)
        s = l[r][t][o], s && s.handler === n && (e.detachEvent('on' + t, s.wrappedHandler), l[r][t][o] = null);
  }) : (h = function (e, t, n) {
    var r = i(e);
    c[r] || (c[r] = {});
    if (!c[r][t]) {
      c[r][t] = [];
      var s = e['on' + t];
      s && c[r][t].push(s), e['on' + t] = u(r, t);
    }
    c[r][t].push(n);
  }, p = function (e, t, n) {
    var r = i(e);
    if (c[r] && c[r][t]) {
      var s = c[r][t];
      for (var o = 0, u = s.length; o < u; o++)
        s[o] === n && s.splice(o, 1);
    }
  }), fabric.util.addListener = h, fabric.util.removeListener = p;
  var v = function (t) {
      return typeof t.clientX !== e ? t.clientX : 0;
    }, m = function (t) {
      return typeof t.clientY !== e ? t.clientY : 0;
    };
  fabric.isTouchSupported && (v = function (e) {
    return g(e, 'pageX', 'clientX');
  }, m = function (e) {
    return g(e, 'pageY', 'clientY');
  }), fabric.util.getPointer = d, fabric.util.object.extend(fabric.util, fabric.Observable);
}(), function () {
  function e(e, t) {
    var n = e.style;
    if (!n)
      return e;
    if (typeof t == 'string')
      return e.style.cssText += ';' + t, t.indexOf('opacity') > -1 ? s(e, t.match(/opacity:\s*(\d?\.?\d*)/)[1]) : e;
    for (var r in t)
      if (r === 'opacity')
        s(e, t[r]);
      else {
        var i = r === 'float' || r === 'cssFloat' ? typeof n.styleFloat == 'undefined' ? 'cssFloat' : 'styleFloat' : r;
        n[i] = t[r];
      }
    return e;
  }
  var t = fabric.document.createElement('div'), n = typeof t.style.opacity == 'string', r = typeof t.style.filter == 'string', i = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, s = function (e) {
      return e;
    };
  n ? s = function (e, t) {
    return e.style.opacity = t, e;
  } : r && (s = function (e, t) {
    var n = e.style;
    return e.currentStyle && !e.currentStyle.hasLayout && (n.zoom = 1), i.test(n.filter) ? (t = t >= 0.9999 ? '' : 'alpha(opacity=' + t * 100 + ')', n.filter = n.filter.replace(i, t)) : n.filter += ' alpha(opacity=' + t * 100 + ')', e;
  }), fabric.util.setStyle = e;
}(), function () {
  function t(e) {
    return typeof e == 'string' ? fabric.document.getElementById(e) : e;
  }
  function s(e, t) {
    var n = fabric.document.createElement(e);
    for (var r in t)
      r === 'class' ? n.className = t[r] : r === 'for' ? n.htmlFor = t[r] : n.setAttribute(r, t[r]);
    return n;
  }
  function o(e, t) {
    e && (' ' + e.className + ' ').indexOf(' ' + t + ' ') === -1 && (e.className += (e.className ? ' ' : '') + t);
  }
  function u(e, t, n) {
    return typeof t == 'string' && (t = s(t, n)), e.parentNode && e.parentNode.replaceChild(t, e), t.appendChild(e), t;
  }
  function a(e, t) {
    var n, r, i = 0, s = 0, o = fabric.document.documentElement, u = fabric.document.body || {
        scrollLeft: 0,
        scrollTop: 0
      };
    r = e;
    while (e && e.parentNode && !n)
      e = e.parentNode, e !== fabric.document && fabric.util.getElementStyle(e, 'position') === 'fixed' && (n = e), e !== fabric.document && r !== t && fabric.util.getElementStyle(e, 'position') === 'absolute' ? (i = 0, s = 0) : e === fabric.document ? (i = u.scrollLeft || o.scrollLeft || 0, s = u.scrollTop || o.scrollTop || 0) : (i += e.scrollLeft || 0, s += e.scrollTop || 0);
    return {
      left: i,
      top: s
    };
  }
  function f(e) {
    var t, n = e && e.ownerDocument, r = {
        left: 0,
        top: 0
      }, i = {
        left: 0,
        top: 0
      }, s, o = {
        borderLeftWidth: 'left',
        borderTopWidth: 'top',
        paddingLeft: 'left',
        paddingTop: 'top'
      };
    if (!n)
      return {
        left: 0,
        top: 0
      };
    for (var u in o)
      i[o[u]] += parseInt(l(e, u), 10) || 0;
    return t = n.documentElement, typeof e.getBoundingClientRect != 'undefined' && (r = e.getBoundingClientRect()), s = fabric.util.getScrollLeftTop(e, null), {
      left: r.left + s.left - (t.clientLeft || 0) + i.left,
      top: r.top + s.top - (t.clientTop || 0) + i.top
    };
  }
  var e = Array.prototype.slice, n, r = function (t) {
      return e.call(t, 0);
    };
  try {
    n = r(fabric.document.childNodes) instanceof Array;
  } catch (i) {
  }
  n || (r = function (e) {
    var t = new Array(e.length), n = e.length;
    while (n--)
      t[n] = e[n];
    return t;
  });
  var l;
  fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? l = function (e, t) {
    return fabric.document.defaultView.getComputedStyle(e, null)[t];
  } : l = function (e, t) {
    var n = e.style[t];
    return !n && e.currentStyle && (n = e.currentStyle[t]), n;
  }, function () {
    function n(e) {
      return typeof e.onselectstart != 'undefined' && (e.onselectstart = fabric.util.falseFunction), t ? e.style[t] = 'none' : typeof e.unselectable == 'string' && (e.unselectable = 'on'), e;
    }
    function r(e) {
      return typeof e.onselectstart != 'undefined' && (e.onselectstart = null), t ? e.style[t] = '' : typeof e.unselectable == 'string' && (e.unselectable = ''), e;
    }
    var e = fabric.document.documentElement.style, t = 'userSelect' in e ? 'userSelect' : 'MozUserSelect' in e ? 'MozUserSelect' : 'WebkitUserSelect' in e ? 'WebkitUserSelect' : 'KhtmlUserSelect' in e ? 'KhtmlUserSelect' : '';
    fabric.util.makeElementUnselectable = n, fabric.util.makeElementSelectable = r;
  }(), function () {
    function e(e, t) {
      var n = fabric.document.getElementsByTagName('head')[0], r = fabric.document.createElement('script'), i = !0;
      r.onload = r.onreadystatechange = function (e) {
        if (i) {
          if (typeof this.readyState == 'string' && this.readyState !== 'loaded' && this.readyState !== 'complete')
            return;
          i = !1, t(e || fabric.window.event), r = r.onload = r.onreadystatechange = null;
        }
      }, r.src = e, n.appendChild(r);
    }
    fabric.util.getScript = e;
  }(), fabric.util.getById = t, fabric.util.toArray = r, fabric.util.makeElement = s, fabric.util.addClass = o, fabric.util.wrapElement = u, fabric.util.getScrollLeftTop = a, fabric.util.getElementOffset = f, fabric.util.getElementStyle = l;
}(), function () {
  function e(e, t) {
    return e + (/\?/.test(e) ? '&' : '?') + t;
  }
  function n() {
  }
  function r(r, i) {
    i || (i = {});
    var s = i.method ? i.method.toUpperCase() : 'GET', o = i.onComplete || function () {
      }, u = t(), a;
    return u.onreadystatechange = function () {
      u.readyState === 4 && (o(u), u.onreadystatechange = n);
    }, s === 'GET' && (a = null, typeof i.parameters == 'string' && (r = e(r, i.parameters))), u.open(s, r, !0), (s === 'POST' || s === 'PUT') && u.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'), u.send(a), u;
  }
  var t = function () {
      var e = [
          function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
          },
          function () {
            return new ActiveXObject('Msxml2.XMLHTTP');
          },
          function () {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
          },
          function () {
            return new XMLHttpRequest();
          }
        ];
      for (var t = e.length; t--;)
        try {
          var n = e[t]();
          if (n)
            return e[t];
        } catch (r) {
        }
    }();
  fabric.util.request = r;
}(), fabric.log = function () {
}, fabric.warn = function () {
}, typeof console != 'undefined' && [
  'log',
  'warn'
].forEach(function (e) {
  typeof console[e] != 'undefined' && console[e].apply && (fabric[e] = function () {
    return console[e].apply(console, arguments);
  });
}), function () {
  function e(e) {
    n(function (t) {
      e || (e = {});
      var r = t || +new Date(), i = e.duration || 500, s = r + i, o, u = e.onChange || function () {
        }, a = e.abort || function () {
          return !1;
        }, f = e.easing || function (e, t, n, r) {
          return -n * Math.cos(e / r * (Math.PI / 2)) + n + t;
        }, l = 'startValue' in e ? e.startValue : 0, c = 'endValue' in e ? e.endValue : 100, h = e.byValue || c - l;
      e.onStart && e.onStart(), function p(t) {
        o = t || +new Date();
        var c = o > s ? i : o - r;
        if (a()) {
          e.onComplete && e.onComplete();
          return;
        }
        u(f(c, l, h, i));
        if (o > s) {
          e.onComplete && e.onComplete();
          return;
        }
        n(p);
      }(r);
    });
  }
  function n() {
    return t.apply(fabric.window, arguments);
  }
  var t = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function (e) {
      fabric.window.setTimeout(e, 1000 / 60);
    };
  fabric.util.animate = e, fabric.util.requestAnimFrame = n;
}(), function () {
  function e(e, t, n, r) {
    return e < Math.abs(t) ? (e = t, r = n / 4) : r = n / (2 * Math.PI) * Math.asin(t / e), {
      a: e,
      c: t,
      p: n,
      s: r
    };
  }
  function t(e, t, n) {
    return e.a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - e.s) * 2 * Math.PI / e.p);
  }
  function n(e, t, n, r) {
    return n * ((e = e / r - 1) * e * e + 1) + t;
  }
  function r(e, t, n, r) {
    return e /= r / 2, e < 1 ? n / 2 * e * e * e + t : n / 2 * ((e -= 2) * e * e + 2) + t;
  }
  function i(e, t, n, r) {
    return n * (e /= r) * e * e * e + t;
  }
  function s(e, t, n, r) {
    return -n * ((e = e / r - 1) * e * e * e - 1) + t;
  }
  function o(e, t, n, r) {
    return e /= r / 2, e < 1 ? n / 2 * e * e * e * e + t : -n / 2 * ((e -= 2) * e * e * e - 2) + t;
  }
  function u(e, t, n, r) {
    return n * (e /= r) * e * e * e * e + t;
  }
  function a(e, t, n, r) {
    return n * ((e = e / r - 1) * e * e * e * e + 1) + t;
  }
  function f(e, t, n, r) {
    return e /= r / 2, e < 1 ? n / 2 * e * e * e * e * e + t : n / 2 * ((e -= 2) * e * e * e * e + 2) + t;
  }
  function l(e, t, n, r) {
    return -n * Math.cos(e / r * (Math.PI / 2)) + n + t;
  }
  function c(e, t, n, r) {
    return n * Math.sin(e / r * (Math.PI / 2)) + t;
  }
  function h(e, t, n, r) {
    return -n / 2 * (Math.cos(Math.PI * e / r) - 1) + t;
  }
  function p(e, t, n, r) {
    return e === 0 ? t : n * Math.pow(2, 10 * (e / r - 1)) + t;
  }
  function d(e, t, n, r) {
    return e === r ? t + n : n * (-Math.pow(2, -10 * e / r) + 1) + t;
  }
  function v(e, t, n, r) {
    return e === 0 ? t : e === r ? t + n : (e /= r / 2, e < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + t : n / 2 * (-Math.pow(2, -10 * --e) + 2) + t);
  }
  function m(e, t, n, r) {
    return -n * (Math.sqrt(1 - (e /= r) * e) - 1) + t;
  }
  function g(e, t, n, r) {
    return n * Math.sqrt(1 - (e = e / r - 1) * e) + t;
  }
  function y(e, t, n, r) {
    return e /= r / 2, e < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + t : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
  }
  function b(n, r, i, s) {
    var o = 1.70158, u = 0, a = i;
    if (n === 0)
      return r;
    n /= s;
    if (n === 1)
      return r + i;
    u || (u = s * 0.3);
    var f = e(a, i, u, o);
    return -t(f, n, s) + r;
  }
  function w(t, n, r, i) {
    var s = 1.70158, o = 0, u = r;
    if (t === 0)
      return n;
    t /= i;
    if (t === 1)
      return n + r;
    o || (o = i * 0.3);
    var a = e(u, r, o, s);
    return a.a * Math.pow(2, -10 * t) * Math.sin((t * i - a.s) * 2 * Math.PI / a.p) + a.c + n;
  }
  function E(n, r, i, s) {
    var o = 1.70158, u = 0, a = i;
    if (n === 0)
      return r;
    n /= s / 2;
    if (n === 2)
      return r + i;
    u || (u = s * 0.3 * 1.5);
    var f = e(a, i, u, o);
    return n < 1 ? -0.5 * t(f, n, s) + r : f.a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n * s - f.s) * 2 * Math.PI / f.p) * 0.5 + f.c + r;
  }
  function S(e, t, n, r, i) {
    return i === undefined && (i = 1.70158), n * (e /= r) * e * ((i + 1) * e - i) + t;
  }
  function x(e, t, n, r, i) {
    return i === undefined && (i = 1.70158), n * ((e = e / r - 1) * e * ((i + 1) * e + i) + 1) + t;
  }
  function T(e, t, n, r, i) {
    return i === undefined && (i = 1.70158), e /= r / 2, e < 1 ? n / 2 * e * e * (((i *= 1.525) + 1) * e - i) + t : n / 2 * ((e -= 2) * e * (((i *= 1.525) + 1) * e + i) + 2) + t;
  }
  function N(e, t, n, r) {
    return n - C(r - e, 0, n, r) + t;
  }
  function C(e, t, n, r) {
    return (e /= r) < 1 / 2.75 ? n * 7.5625 * e * e + t : e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + 0.75) + t : e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + 0.9375) + t : n * (7.5625 * (e -= 2.625 / 2.75) * e + 0.984375) + t;
  }
  function k(e, t, n, r) {
    return e < r / 2 ? N(e * 2, 0, n, r) * 0.5 + t : C(e * 2 - r, 0, n, r) * 0.5 + n * 0.5 + t;
  }
  fabric.util.ease = {
    easeInQuad: function (e, t, n, r) {
      return n * (e /= r) * e + t;
    },
    easeOutQuad: function (e, t, n, r) {
      return -n * (e /= r) * (e - 2) + t;
    },
    easeInOutQuad: function (e, t, n, r) {
      return e /= r / 2, e < 1 ? n / 2 * e * e + t : -n / 2 * (--e * (e - 2) - 1) + t;
    },
    easeInCubic: function (e, t, n, r) {
      return n * (e /= r) * e * e + t;
    },
    easeOutCubic: n,
    easeInOutCubic: r,
    easeInQuart: i,
    easeOutQuart: s,
    easeInOutQuart: o,
    easeInQuint: u,
    easeOutQuint: a,
    easeInOutQuint: f,
    easeInSine: l,
    easeOutSine: c,
    easeInOutSine: h,
    easeInExpo: p,
    easeOutExpo: d,
    easeInOutExpo: v,
    easeInCirc: m,
    easeOutCirc: g,
    easeInOutCirc: y,
    easeInElastic: b,
    easeOutElastic: w,
    easeInOutElastic: E,
    easeInBack: S,
    easeOutBack: x,
    easeInOutBack: T,
    easeInBounce: N,
    easeOutBounce: C,
    easeInOutBounce: k
  };
}(), function (e) {
  'use strict';
  function l(e) {
    return e in a ? a[e] : e;
  }
  function c(e, n, r) {
    var i = Object.prototype.toString.call(n) === '[object Array]', s;
    return e !== 'fill' && e !== 'stroke' || n !== 'none' ? e === 'fillRule' ? n = n === 'evenodd' ? 'destination-over' : n : e === 'strokeDashArray' ? n = n.replace(/,/g, ' ').split(/\s+/).map(function (e) {
      return parseInt(e);
    }) : e === 'transformMatrix' ? r && r.transformMatrix ? n = u(r.transformMatrix, t.parseTransformAttribute(n)) : n = t.parseTransformAttribute(n) : e === 'visible' ? (n = n === 'none' || n === 'hidden' ? !1 : !0, r && r.visible === !1 && (n = !1)) : e === 'originX' ? n = n === 'start' ? 'left' : n === 'end' ? 'right' : 'center' : s = i ? n.map(o) : o(n) : n = '', !i && isNaN(s) ? n : s;
  }
  function h(e) {
    for (var n in f) {
      if (!e[n] || typeof e[f[n]] == 'undefined')
        continue;
      if (e[n].indexOf('url(') === 0)
        continue;
      var r = new t.Color(e[n]);
      e[n] = r.setAlpha(s(r.getAlpha() * e[f[n]], 2)).toRgba();
    }
    return e;
  }
  function p(e, t) {
    var n = e.match(/(normal|italic)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+)px(?:\/(normal|[\d\.]+))?\s+(.*)/);
    if (!n)
      return;
    var r = n[1], i = n[3], s = n[4], o = n[5], u = n[6];
    r && (t.fontStyle = r), i && (t.fontWeight = isNaN(parseFloat(i)) ? i : parseFloat(i)), s && (t.fontSize = parseFloat(s)), u && (t.fontFamily = u), o && (t.lineHeight = o === 'normal' ? 1 : o);
  }
  function d(e, t) {
    var n, r;
    e.replace(/;$/, '').split(';').forEach(function (e) {
      var i = e.split(':');
      n = l(i[0].trim().toLowerCase()), r = c(n, i[1].trim()), n === 'font' ? p(r, t) : t[n] = r;
    });
  }
  function v(e, t) {
    var n, r;
    for (var i in e) {
      if (typeof e[i] == 'undefined')
        continue;
      n = l(i.toLowerCase()), r = c(n, e[i]), n === 'font' ? p(r, t) : t[n] = r;
    }
  }
  function m(e) {
    var n = {};
    for (var r in t.cssRules)
      if (g(e, r.split(' ')))
        for (var i in t.cssRules[r])
          n[i] = t.cssRules[r][i];
    return n;
  }
  function g(e, t) {
    var n, r = !0;
    return n = b(e, t.pop()), n && t.length && (r = y(e, t)), n && r && t.length === 0;
  }
  function y(e, t) {
    var n, r = !0;
    while (e.parentNode && e.parentNode.nodeType === 1 && t.length)
      r && (n = t.pop()), e = e.parentNode, r = b(e, n);
    return t.length === 0;
  }
  function b(e, t) {
    var n = e.nodeName, r = e.getAttribute('class'), i = e.getAttribute('id'), s;
    s = new RegExp('^' + n, 'i'), t = t.replace(s, ''), i && t.length && (s = new RegExp('#' + i + '(?![a-zA-Z\\-]+)', 'i'), t = t.replace(s, ''));
    if (r && t.length) {
      r = r.split(' ');
      for (var o = r.length; o--;)
        s = new RegExp('\\.' + r[o] + '(?![a-zA-Z\\-]+)', 'i'), t = t.replace(s, '');
    }
    return t.length === 0;
  }
  function w(e) {
    var t = e.getElementsByTagName('use');
    while (t.length) {
      var n = t[0], r = n.getAttribute('xlink:href').substr(1), i = n.getAttribute('x') || 0, s = n.getAttribute('y') || 0, o = e.getElementById(r).cloneNode(!0), u = (n.getAttribute('transform') || '') + ' translate(' + i + ', ' + s + ')', a;
      for (var f = 0, l = n.attributes, c = l.length; f < c; f++) {
        var h = l.item(f);
        if (h.nodeName === 'x' || h.nodeName === 'y' || h.nodeName === 'xlink:href')
          continue;
        h.nodeName === 'transform' ? u = u + ' ' + h.nodeValue : o.setAttribute(h.nodeName, h.nodeValue);
      }
      o.setAttribute('transform', u), o.removeAttribute('id'), a = n.parentNode, a.replaceChild(o, n);
    }
  }
  function E(e, t) {
    t[3] = t[0] = t[0] > t[3] ? t[3] : t[0];
    if (t[0] === 1 && t[3] === 1 && t[4] === 0 && t[5] === 0)
      return;
    var n = e.ownerDocument.createElement('g');
    while (e.firstChild != null)
      n.appendChild(e.firstChild);
    n.setAttribute('transform', 'matrix(' + t[0] + ' ' + t[1] + ' ' + t[2] + ' ' + t[3] + ' ' + t[4] + ' ' + t[5] + ')'), e.appendChild(n);
  }
  function x(e) {
    var n = e.objects, i = e.options;
    return n = n.map(function (e) {
      return t[r(e.type)].fromObject(e);
    }), {
      objects: n,
      options: i
    };
  }
  function T(e, t, n) {
    t[n] && t[n].toSVG && e.push('<pattern x="0" y="0" id="', n, 'Pattern" ', 'width="', t[n].source.width, '" height="', t[n].source.height, '" patternUnits="userSpaceOnUse">', '<image x="0" y="0" ', 'width="', t[n].source.width, '" height="', t[n].source.height, '" xlink:href="', t[n].source.src, '"></image></pattern>');
  }
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = t.util.string.capitalize, i = t.util.object.clone, s = t.util.toFixed, o = t.util.parseUnit, u = t.util.multiplyTransformMatrices, a = {
      cx: 'left',
      x: 'left',
      r: 'radius',
      cy: 'top',
      y: 'top',
      display: 'visible',
      visibility: 'visible',
      transform: 'transformMatrix',
      'fill-opacity': 'fillOpacity',
      'fill-rule': 'fillRule',
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      'font-style': 'fontStyle',
      'font-weight': 'fontWeight',
      'stroke-dasharray': 'strokeDashArray',
      'stroke-linecap': 'strokeLineCap',
      'stroke-linejoin': 'strokeLineJoin',
      'stroke-miterlimit': 'strokeMiterLimit',
      'stroke-opacity': 'strokeOpacity',
      'stroke-width': 'strokeWidth',
      'text-decoration': 'textDecoration',
      'text-anchor': 'originX'
    }, f = {
      stroke: 'strokeOpacity',
      fill: 'fillOpacity'
    };
  t.parseTransformAttribute = function () {
    function e(e, t) {
      var n = t[0];
      e[0] = Math.cos(n), e[1] = Math.sin(n), e[2] = -Math.sin(n), e[3] = Math.cos(n);
    }
    function n(e, t) {
      var n = t[0], r = t.length === 2 ? t[1] : t[0];
      e[0] = n, e[3] = r;
    }
    function r(e, t) {
      e[2] = t[0];
    }
    function i(e, t) {
      e[1] = t[0];
    }
    function s(e, t) {
      e[4] = t[0], t.length === 2 && (e[5] = t[1]);
    }
    var o = [
        1,
        0,
        0,
        1,
        0,
        0
      ], u = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)', a = '(?:\\s+,?\\s*|,\\s*)', f = '(?:(skewX)\\s*\\(\\s*(' + u + ')\\s*\\))', l = '(?:(skewY)\\s*\\(\\s*(' + u + ')\\s*\\))', c = '(?:(rotate)\\s*\\(\\s*(' + u + ')(?:' + a + '(' + u + ')' + a + '(' + u + '))?\\s*\\))', h = '(?:(scale)\\s*\\(\\s*(' + u + ')(?:' + a + '(' + u + '))?\\s*\\))', p = '(?:(translate)\\s*\\(\\s*(' + u + ')(?:' + a + '(' + u + '))?\\s*\\))', d = '(?:(matrix)\\s*\\(\\s*(' + u + ')' + a + '(' + u + ')' + a + '(' + u + ')' + a + '(' + u + ')' + a + '(' + u + ')' + a + '(' + u + ')' + '\\s*\\))', v = '(?:' + d + '|' + p + '|' + h + '|' + c + '|' + f + '|' + l + ')', m = '(?:' + v + '(?:' + a + v + ')*' + ')', g = '^\\s*(?:' + m + '?)\\s*$', y = new RegExp(g), b = new RegExp(v, 'g');
    return function (u) {
      var a = o.concat(), f = [];
      if (!u || u && !y.test(u))
        return a;
      u.replace(b, function (u) {
        var l = new RegExp(v).exec(u).filter(function (e) {
            return e !== '' && e != null;
          }), c = l[1], h = l.slice(2).map(parseFloat);
        switch (c) {
        case 'translate':
          s(a, h);
          break;
        case 'rotate':
          h[0] = t.util.degreesToRadians(h[0]), e(a, h);
          break;
        case 'scale':
          n(a, h);
          break;
        case 'skewX':
          r(a, h);
          break;
        case 'skewY':
          i(a, h);
          break;
        case 'matrix':
          a = h;
        }
        f.push(a.concat()), a = o.concat();
      });
      var l = f[0];
      while (f.length > 1)
        f.shift(), l = t.util.multiplyTransformMatrices(l, f[0]);
      return l;
    };
  }(), t.parseSVGDocument = function () {
    function s(e, t) {
      while (e && (e = e.parentNode))
        if (t.test(e.nodeName))
          return !0;
      return !1;
    }
    var e = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/, n = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)', r = new RegExp('^\\s*(' + n + '+)\\s*,?' + '\\s*(' + n + '+)\\s*,?' + '\\s*(' + n + '+)\\s*,?' + '\\s*(' + n + '+)\\s*' + '$');
    return function (n, u, a) {
      if (!n)
        return;
      var f = new Date();
      w(n);
      var l = n.getAttribute('viewBox'), c = o(n.getAttribute('width')), h = o(n.getAttribute('height')), p, d;
      if (l && (l = l.match(r))) {
        var v = parseFloat(l[1]), m = parseFloat(l[2]), g = 1, y = 1;
        p = parseFloat(l[3]), d = parseFloat(l[4]), c && c !== p && (g = c / p), h && h !== d && (y = h / d), E(n, [
          g,
          0,
          0,
          y,
          g * -v,
          y * -m
        ]);
      }
      var b = t.util.toArray(n.getElementsByTagName('*'));
      if (b.length === 0 && t.isLikelyNode) {
        b = n.selectNodes('//*[name(.)!="svg"]');
        var S = [];
        for (var x = 0, T = b.length; x < T; x++)
          S[x] = b[x];
        b = S;
      }
      var N = b.filter(function (t) {
          return e.test(t.tagName) && !s(t, /^(?:pattern|defs)$/);
        });
      if (!N || N && !N.length) {
        u && u([], {});
        return;
      }
      var C = {
          width: c ? c : p,
          height: h ? h : d,
          widthAttr: c,
          heightAttr: h
        };
      t.gradientDefs = t.getGradientDefs(n), t.cssRules = t.getCSSRules(n), t.parseElements(N, function (e) {
        t.documentParsingTime = new Date() - f, u && u(e, C);
      }, i(C), a);
    };
  }();
  var S = {
      has: function (e, t) {
        t(!1);
      },
      get: function () {
      },
      set: function () {
      }
    };
  n(t, {
    getGradientDefs: function (e) {
      var t = e.getElementsByTagName('linearGradient'), n = e.getElementsByTagName('radialGradient'), r, i, s = 0, o, u, a = [], f = {}, l = {};
      a.length = t.length + n.length, i = t.length;
      while (i--)
        a[s++] = t[i];
      i = n.length;
      while (i--)
        a[s++] = n[i];
      while (s--)
        r = a[s], u = r.getAttribute('xlink:href'), o = r.getAttribute('id'), u && (l[o] = u.substr(1)), f[o] = r;
      for (o in l) {
        var c = f[l[o]].cloneNode(!0);
        r = f[o];
        while (c.firstChild)
          r.appendChild(c.firstChild);
      }
      return f;
    },
    parseAttributes: function (e, r) {
      if (!e)
        return;
      var i, s = {};
      e.parentNode && /^symbol|[g|a]$/i.test(e.parentNode.nodeName) && (s = t.parseAttributes(e.parentNode, r));
      var o = r.reduce(function (t, n) {
          return i = e.getAttribute(n), i && (n = l(n), i = c(n, i, s), t[n] = i), t;
        }, {});
      return o = n(o, n(m(e), t.parseStyleAttribute(e))), h(n(s, o));
    },
    parseElements: function (e, n, r, i) {
      new t.ElementsParser(e, n, r, i).parse();
    },
    parseStyleAttribute: function (e) {
      var t = {}, n = e.getAttribute('style');
      return n ? (typeof n == 'string' ? d(n, t) : v(n, t), t) : t;
    },
    parsePointsAttribute: function (e) {
      if (!e)
        return null;
      e = e.replace(/,/g, ' ').trim(), e = e.split(/\s+/);
      var t = [], n, r;
      n = 0, r = e.length;
      for (; n < r; n += 2)
        t.push({
          x: parseFloat(e[n]),
          y: parseFloat(e[n + 1])
        });
      return t;
    },
    getCSSRules: function (e) {
      var n = e.getElementsByTagName('style'), r = {}, i;
      for (var s = 0, o = n.length; s < o; s++) {
        var u = n[0].textContent;
        u = u.replace(/\/\*[\s\S]*?\*\//g, ''), i = u.match(/[^{]*\{[\s\S]*?\}/g), i = i.map(function (e) {
          return e.trim();
        }), i.forEach(function (e) {
          var n = e.match(/([\s\S]*?)\s*\{([^}]*)\}/), i = {}, s = n[2].trim(), o = s.replace(/;$/, '').split(/\s*;\s*/);
          for (var u = 0, a = o.length; u < a; u++) {
            var f = o[u].split(/\s*:\s*/), h = l(f[0]), p = c(h, f[1], f[0]);
            i[h] = p;
          }
          e = n[1], e.split(',').forEach(function (e) {
            r[e.trim()] = t.util.object.clone(i);
          });
        });
      }
      return r;
    },
    loadSVGFromURL: function (e, n, r) {
      function i(i) {
        var s = i.responseXML;
        s && !s.documentElement && t.window.ActiveXObject && i.responseText && (s = new ActiveXObject('Microsoft.XMLDOM'), s.async = 'false', s.loadXML(i.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, '')));
        if (!s || !s.documentElement)
          return;
        t.parseSVGDocument(s.documentElement, function (r, i) {
          S.set(e, {
            objects: t.util.array.invoke(r, 'toObject'),
            options: i
          }), n(r, i);
        }, r);
      }
      e = e.replace(/^\n\s*/, '').trim(), S.has(e, function (r) {
        r ? S.get(e, function (e) {
          var t = x(e);
          n(t.objects, t.options);
        }) : new t.util.request(e, {
          method: 'get',
          onComplete: i
        });
      });
    },
    loadSVGFromString: function (e, n, r) {
      e = e.trim();
      var i;
      if (typeof DOMParser != 'undefined') {
        var s = new DOMParser();
        s && s.parseFromString && (i = s.parseFromString(e, 'text/xml'));
      } else
        t.window.ActiveXObject && (i = new ActiveXObject('Microsoft.XMLDOM'), i.async = 'false', i.loadXML(e.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, '')));
      t.parseSVGDocument(i.documentElement, function (e, t) {
        n(e, t);
      }, r);
    },
    createSVGFontFacesMarkup: function (e) {
      var t = '';
      for (var n = 0, r = e.length; n < r; n++) {
        if (e[n].type !== 'text' || !e[n].path)
          continue;
        t += [
          '@font-face {',
          'font-family: ',
          e[n].fontFamily,
          '; ',
          'src: url(\'',
          e[n].path,
          '\')',
          '}'
        ].join('');
      }
      return t && (t = [
        '<style type="text/css">',
        '<![CDATA[',
        t,
        ']]>',
        '</style>'
      ].join('')), t;
    },
    createSVGRefElementsMarkup: function (e) {
      var t = [];
      return T(t, e, 'backgroundColor'), T(t, e, 'overlayColor'), t.join('');
    }
  });
}(typeof exports != 'undefined' ? exports : this), fabric.ElementsParser = function (e, t, n, r) {
  this.elements = e, this.callback = t, this.options = n, this.reviver = r;
}, fabric.ElementsParser.prototype.parse = function () {
  this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects();
}, fabric.ElementsParser.prototype.createObjects = function () {
  for (var e = 0, t = this.elements.length; e < t; e++)
    (function (e, t) {
      setTimeout(function () {
        e.createObject(e.elements[t], t);
      }, 0);
    }(this, e));
}, fabric.ElementsParser.prototype.createObject = function (e, t) {
  var n = fabric[fabric.util.string.capitalize(e.tagName)];
  if (n && n.fromElement)
    try {
      this._createObject(n, e, t);
    } catch (r) {
      fabric.log(r);
    }
  else
    this.checkIfDone();
}, fabric.ElementsParser.prototype._createObject = function (e, t, n) {
  if (e.async)
    e.fromElement(t, this.createCallback(n, t), this.options);
  else {
    var r = e.fromElement(t, this.options);
    this.resolveGradient(r, 'fill'), this.resolveGradient(r, 'stroke'), this.reviver && this.reviver(t, r), this.instances[n] = r, this.checkIfDone();
  }
}, fabric.ElementsParser.prototype.createCallback = function (e, t) {
  var n = this;
  return function (r) {
    n.resolveGradient(r, 'fill'), n.resolveGradient(r, 'stroke'), n.reviver && n.reviver(t, r), n.instances[e] = r, n.checkIfDone();
  };
}, fabric.ElementsParser.prototype.resolveGradient = function (e, t) {
  var n = e.get(t);
  if (!/^url\(/.test(n))
    return;
  var r = n.slice(5, n.length - 1);
  fabric.gradientDefs[r] && e.set(t, fabric.Gradient.fromElement(fabric.gradientDefs[r], e));
}, fabric.ElementsParser.prototype.checkIfDone = function () {
  --this.numElements === 0 && (this.instances = this.instances.filter(function (e) {
    return e != null;
  }), this.callback(this.instances));
}, function (e) {
  'use strict';
  function n(e, t) {
    this.x = e, this.y = t;
  }
  var t = e.fabric || (e.fabric = {});
  if (t.Point) {
    t.warn('fabric.Point is already defined');
    return;
  }
  t.Point = n, n.prototype = {
    constructor: n,
    add: function (e) {
      return new n(this.x + e.x, this.y + e.y);
    },
    addEquals: function (e) {
      return this.x += e.x, this.y += e.y, this;
    },
    scalarAdd: function (e) {
      return new n(this.x + e, this.y + e);
    },
    scalarAddEquals: function (e) {
      return this.x += e, this.y += e, this;
    },
    subtract: function (e) {
      return new n(this.x - e.x, this.y - e.y);
    },
    subtractEquals: function (e) {
      return this.x -= e.x, this.y -= e.y, this;
    },
    scalarSubtract: function (e) {
      return new n(this.x - e, this.y - e);
    },
    scalarSubtractEquals: function (e) {
      return this.x -= e, this.y -= e, this;
    },
    multiply: function (e) {
      return new n(this.x * e, this.y * e);
    },
    multiplyEquals: function (e) {
      return this.x *= e, this.y *= e, this;
    },
    divide: function (e) {
      return new n(this.x / e, this.y / e);
    },
    divideEquals: function (e) {
      return this.x /= e, this.y /= e, this;
    },
    eq: function (e) {
      return this.x === e.x && this.y === e.y;
    },
    lt: function (e) {
      return this.x < e.x && this.y < e.y;
    },
    lte: function (e) {
      return this.x <= e.x && this.y <= e.y;
    },
    gt: function (e) {
      return this.x > e.x && this.y > e.y;
    },
    gte: function (e) {
      return this.x >= e.x && this.y >= e.y;
    },
    lerp: function (e, t) {
      return new n(this.x + (e.x - this.x) * t, this.y + (e.y - this.y) * t);
    },
    distanceFrom: function (e) {
      var t = this.x - e.x, n = this.y - e.y;
      return Math.sqrt(t * t + n * n);
    },
    midPointFrom: function (e) {
      return new n(this.x + (e.x - this.x) / 2, this.y + (e.y - this.y) / 2);
    },
    min: function (e) {
      return new n(Math.min(this.x, e.x), Math.min(this.y, e.y));
    },
    max: function (e) {
      return new n(Math.max(this.x, e.x), Math.max(this.y, e.y));
    },
    toString: function () {
      return this.x + ',' + this.y;
    },
    setXY: function (e, t) {
      this.x = e, this.y = t;
    },
    setFromPoint: function (e) {
      this.x = e.x, this.y = e.y;
    },
    swap: function (e) {
      var t = this.x, n = this.y;
      this.x = e.x, this.y = e.y, e.x = t, e.y = n;
    }
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  function n(e) {
    this.status = e, this.points = [];
  }
  var t = e.fabric || (e.fabric = {});
  if (t.Intersection) {
    t.warn('fabric.Intersection is already defined');
    return;
  }
  t.Intersection = n, t.Intersection.prototype = {
    appendPoint: function (e) {
      this.points.push(e);
    },
    appendPoints: function (e) {
      this.points = this.points.concat(e);
    }
  }, t.Intersection.intersectLineLine = function (e, r, i, s) {
    var o, u = (s.x - i.x) * (e.y - i.y) - (s.y - i.y) * (e.x - i.x), a = (r.x - e.x) * (e.y - i.y) - (r.y - e.y) * (e.x - i.x), f = (s.y - i.y) * (r.x - e.x) - (s.x - i.x) * (r.y - e.y);
    if (f !== 0) {
      var l = u / f, c = a / f;
      0 <= l && l <= 1 && 0 <= c && c <= 1 ? (o = new n('Intersection'), o.points.push(new t.Point(e.x + l * (r.x - e.x), e.y + l * (r.y - e.y)))) : o = new n();
    } else
      u === 0 || a === 0 ? o = new n('Coincident') : o = new n('Parallel');
    return o;
  }, t.Intersection.intersectLinePolygon = function (e, t, r) {
    var i = new n(), s = r.length;
    for (var o = 0; o < s; o++) {
      var u = r[o], a = r[(o + 1) % s], f = n.intersectLineLine(e, t, u, a);
      i.appendPoints(f.points);
    }
    return i.points.length > 0 && (i.status = 'Intersection'), i;
  }, t.Intersection.intersectPolygonPolygon = function (e, t) {
    var r = new n(), i = e.length;
    for (var s = 0; s < i; s++) {
      var o = e[s], u = e[(s + 1) % i], a = n.intersectLinePolygon(o, u, t);
      r.appendPoints(a.points);
    }
    return r.points.length > 0 && (r.status = 'Intersection'), r;
  }, t.Intersection.intersectPolygonRectangle = function (e, r, i) {
    var s = r.min(i), o = r.max(i), u = new t.Point(o.x, s.y), a = new t.Point(s.x, o.y), f = n.intersectLinePolygon(s, u, e), l = n.intersectLinePolygon(u, o, e), c = n.intersectLinePolygon(o, a, e), h = n.intersectLinePolygon(a, s, e), p = new n();
    return p.appendPoints(f.points), p.appendPoints(l.points), p.appendPoints(c.points), p.appendPoints(h.points), p.points.length > 0 && (p.status = 'Intersection'), p;
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  function n(e) {
    e ? this._tryParsingColor(e) : this.setSource([
      0,
      0,
      0,
      1
    ]);
  }
  function r(e, t, n) {
    return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 0.5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
  }
  var t = e.fabric || (e.fabric = {});
  if (t.Color) {
    t.warn('fabric.Color is already defined.');
    return;
  }
  t.Color = n, t.Color.prototype = {
    _tryParsingColor: function (e) {
      var t;
      e in n.colorNameMap && (e = n.colorNameMap[e]);
      if (e === 'transparent') {
        this.setSource([
          255,
          255,
          255,
          0
        ]);
        return;
      }
      t = n.sourceFromHex(e), t || (t = n.sourceFromRgb(e)), t || (t = n.sourceFromHsl(e)), t && this.setSource(t);
    },
    _rgbToHsl: function (e, n, r) {
      e /= 255, n /= 255, r /= 255;
      var i, s, o, u = t.util.array.max([
          e,
          n,
          r
        ]), a = t.util.array.min([
          e,
          n,
          r
        ]);
      o = (u + a) / 2;
      if (u === a)
        i = s = 0;
      else {
        var f = u - a;
        s = o > 0.5 ? f / (2 - u - a) : f / (u + a);
        switch (u) {
        case e:
          i = (n - r) / f + (n < r ? 6 : 0);
          break;
        case n:
          i = (r - e) / f + 2;
          break;
        case r:
          i = (e - n) / f + 4;
        }
        i /= 6;
      }
      return [
        Math.round(i * 360),
        Math.round(s * 100),
        Math.round(o * 100)
      ];
    },
    getSource: function () {
      return this._source;
    },
    setSource: function (e) {
      this._source = e;
    },
    toRgb: function () {
      var e = this.getSource();
      return 'rgb(' + e[0] + ',' + e[1] + ',' + e[2] + ')';
    },
    toRgba: function () {
      var e = this.getSource();
      return 'rgba(' + e[0] + ',' + e[1] + ',' + e[2] + ',' + e[3] + ')';
    },
    toHsl: function () {
      var e = this.getSource(), t = this._rgbToHsl(e[0], e[1], e[2]);
      return 'hsl(' + t[0] + ',' + t[1] + '%,' + t[2] + '%)';
    },
    toHsla: function () {
      var e = this.getSource(), t = this._rgbToHsl(e[0], e[1], e[2]);
      return 'hsla(' + t[0] + ',' + t[1] + '%,' + t[2] + '%,' + e[3] + ')';
    },
    toHex: function () {
      var e = this.getSource(), t, n, r;
      return t = e[0].toString(16), t = t.length === 1 ? '0' + t : t, n = e[1].toString(16), n = n.length === 1 ? '0' + n : n, r = e[2].toString(16), r = r.length === 1 ? '0' + r : r, t.toUpperCase() + n.toUpperCase() + r.toUpperCase();
    },
    getAlpha: function () {
      return this.getSource()[3];
    },
    setAlpha: function (e) {
      var t = this.getSource();
      return t[3] = e, this.setSource(t), this;
    },
    toGrayscale: function () {
      var e = this.getSource(), t = parseInt((e[0] * 0.3 + e[1] * 0.59 + e[2] * 0.11).toFixed(0), 10), n = e[3];
      return this.setSource([
        t,
        t,
        t,
        n
      ]), this;
    },
    toBlackWhite: function (e) {
      var t = this.getSource(), n = (t[0] * 0.3 + t[1] * 0.59 + t[2] * 0.11).toFixed(0), r = t[3];
      return e = e || 127, n = Number(n) < Number(e) ? 0 : 255, this.setSource([
        n,
        n,
        n,
        r
      ]), this;
    },
    overlayWith: function (e) {
      e instanceof n || (e = new n(e));
      var t = [], r = this.getAlpha(), i = 0.5, s = this.getSource(), o = e.getSource();
      for (var u = 0; u < 3; u++)
        t.push(Math.round(s[u] * (1 - i) + o[u] * i));
      return t[3] = r, this.setSource(t), this;
    }
  }, t.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, t.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, t.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i, t.Color.colorNameMap = {
    aqua: '#00FFFF',
    black: '#000000',
    blue: '#0000FF',
    fuchsia: '#FF00FF',
    gray: '#808080',
    green: '#008000',
    lime: '#00FF00',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#FFA500',
    purple: '#800080',
    red: '#FF0000',
    silver: '#C0C0C0',
    teal: '#008080',
    white: '#FFFFFF',
    yellow: '#FFFF00'
  }, t.Color.fromRgb = function (e) {
    return n.fromSource(n.sourceFromRgb(e));
  }, t.Color.sourceFromRgb = function (e) {
    var t = e.match(n.reRGBa);
    if (t) {
      var r = parseInt(t[1], 10) / (/%$/.test(t[1]) ? 100 : 1) * (/%$/.test(t[1]) ? 255 : 1), i = parseInt(t[2], 10) / (/%$/.test(t[2]) ? 100 : 1) * (/%$/.test(t[2]) ? 255 : 1), s = parseInt(t[3], 10) / (/%$/.test(t[3]) ? 100 : 1) * (/%$/.test(t[3]) ? 255 : 1);
      return [
        parseInt(r, 10),
        parseInt(i, 10),
        parseInt(s, 10),
        t[4] ? parseFloat(t[4]) : 1
      ];
    }
  }, t.Color.fromRgba = n.fromRgb, t.Color.fromHsl = function (e) {
    return n.fromSource(n.sourceFromHsl(e));
  }, t.Color.sourceFromHsl = function (e) {
    var t = e.match(n.reHSLa);
    if (!t)
      return;
    var i = (parseFloat(t[1]) % 360 + 360) % 360 / 360, s = parseFloat(t[2]) / (/%$/.test(t[2]) ? 100 : 1), o = parseFloat(t[3]) / (/%$/.test(t[3]) ? 100 : 1), u, a, f;
    if (s === 0)
      u = a = f = o;
    else {
      var l = o <= 0.5 ? o * (s + 1) : o + s - o * s, c = o * 2 - l;
      u = r(c, l, i + 1 / 3), a = r(c, l, i), f = r(c, l, i - 1 / 3);
    }
    return [
      Math.round(u * 255),
      Math.round(a * 255),
      Math.round(f * 255),
      t[4] ? parseFloat(t[4]) : 1
    ];
  }, t.Color.fromHsla = n.fromHsl, t.Color.fromHex = function (e) {
    return n.fromSource(n.sourceFromHex(e));
  }, t.Color.sourceFromHex = function (e) {
    if (e.match(n.reHex)) {
      var t = e.slice(e.indexOf('#') + 1), r = t.length === 3, i = r ? t.charAt(0) + t.charAt(0) : t.substring(0, 2), s = r ? t.charAt(1) + t.charAt(1) : t.substring(2, 4), o = r ? t.charAt(2) + t.charAt(2) : t.substring(4, 6);
      return [
        parseInt(i, 16),
        parseInt(s, 16),
        parseInt(o, 16),
        1
      ];
    }
  }, t.Color.fromSource = function (e) {
    var t = new n();
    return t.setSource(e), t;
  };
}(typeof exports != 'undefined' ? exports : this), function () {
  function e(e) {
    var t = e.getAttribute('style'), n = e.getAttribute('offset'), r, i, s;
    n = parseFloat(n) / (/%$/.test(n) ? 100 : 1);
    if (t) {
      var o = t.split(/\s*;\s*/);
      o[o.length - 1] === '' && o.pop();
      for (var u = o.length; u--;) {
        var a = o[u].split(/\s*:\s*/), f = a[0].trim(), l = a[1].trim();
        f === 'stop-color' ? r = l : f === 'stop-opacity' && (s = l);
      }
    }
    return r || (r = e.getAttribute('stop-color') || 'rgb(0,0,0)'), s || (s = e.getAttribute('stop-opacity')), r = new fabric.Color(r), i = r.getAlpha(), s = isNaN(parseFloat(s)) ? 1 : parseFloat(s), s *= i, {
      offset: n,
      color: r.toRgb(),
      opacity: s
    };
  }
  function t(e) {
    return {
      x1: e.getAttribute('x1') || 0,
      y1: e.getAttribute('y1') || 0,
      x2: e.getAttribute('x2') || '100%',
      y2: e.getAttribute('y2') || 0
    };
  }
  function n(e) {
    return {
      x1: e.getAttribute('fx') || e.getAttribute('cx') || '50%',
      y1: e.getAttribute('fy') || e.getAttribute('cy') || '50%',
      r1: 0,
      x2: e.getAttribute('cx') || '50%',
      y2: e.getAttribute('cy') || '50%',
      r2: e.getAttribute('r') || '50%'
    };
  }
  function r(e, t) {
    for (var n in t)
      if (typeof t[n] == 'string' && /^\d+%$/.test(t[n])) {
        var r = parseFloat(t[n], 10);
        if (n === 'x1' || n === 'x2' || n === 'r2')
          t[n] = fabric.util.toFixed(e.width * r / 100, 2) + e.left;
        else if (n === 'y1' || n === 'y2')
          t[n] = fabric.util.toFixed(e.height * r / 100, 2) + e.top;
      }
  }
  function i(e, t) {
    for (var n in t)
      if (n === 'x1' || n === 'x2' || n === 'r2')
        t[n] = fabric.util.toFixed((t[n] - e.fill.origX) / e.width * 100, 2) + '%';
      else if (n === 'y1' || n === 'y2')
        t[n] = fabric.util.toFixed((t[n] - e.fill.origY) / e.height * 100, 2) + '%';
  }
  fabric.Gradient = fabric.util.createClass({
    origX: 0,
    origY: 0,
    initialize: function (e) {
      e || (e = {});
      var t = {};
      this.id = fabric.Object.__uid++, this.type = e.type || 'linear', t = {
        x1: e.coords.x1 || 0,
        y1: e.coords.y1 || 0,
        x2: e.coords.x2 || 0,
        y2: e.coords.y2 || 0
      }, this.type === 'radial' && (t.r1 = e.coords.r1 || 0, t.r2 = e.coords.r2 || 0), this.coords = t, this.gradientUnits = e.gradientUnits || 'objectBoundingBox', this.colorStops = e.colorStops.slice(), e.gradientTransform && (this.gradientTransform = e.gradientTransform), this.origX = e.left || this.origX, this.origY = e.top || this.origY;
    },
    addColorStop: function (e) {
      for (var t in e) {
        var n = new fabric.Color(e[t]);
        this.colorStops.push({
          offset: t,
          color: n.toRgb(),
          opacity: n.getAlpha()
        });
      }
      return this;
    },
    toObject: function () {
      return {
        type: this.type,
        coords: this.coords,
        gradientUnits: this.gradientUnits,
        colorStops: this.colorStops
      };
    },
    toSVG: function (e, t) {
      var n = fabric.util.object.clone(this.coords), r, s;
      this.colorStops.sort(function (e, t) {
        return e.offset - t.offset;
      }), t && this.gradientUnits === 'userSpaceOnUse' ? (n.x1 += e.width / 2, n.y1 += e.height / 2, n.x2 += e.width / 2, n.y2 += e.height / 2) : this.gradientUnits === 'objectBoundingBox' && i(e, n), s = 'id="SVGID_' + this.id + '" gradientUnits="' + this.gradientUnits + '"', this.gradientTransform && (s += ' gradientTransform="matrix(' + this.gradientTransform.join(' ') + ')" '), this.type === 'linear' ? r = [
        '<linearGradient ',
        s,
        ' x1="',
        n.x1,
        '" y1="',
        n.y1,
        '" x2="',
        n.x2,
        '" y2="',
        n.y2,
        '">\n'
      ] : this.type === 'radial' && (r = [
        '<radialGradient ',
        s,
        ' cx="',
        n.x2,
        '" cy="',
        n.y2,
        '" r="',
        n.r2,
        '" fx="',
        n.x1,
        '" fy="',
        n.y1,
        '">\n'
      ]);
      for (var o = 0; o < this.colorStops.length; o++)
        r.push('<stop ', 'offset="', this.colorStops[o].offset * 100 + '%', '" style="stop-color:', this.colorStops[o].color, this.colorStops[o].opacity != null ? ';stop-opacity: ' + this.colorStops[o].opacity : ';', '"/>\n');
      return r.push(this.type === 'linear' ? '</linearGradient>\n' : '</radialGradient>\n'), r.join('');
    },
    toLive: function (e) {
      var t;
      if (!this.type)
        return;
      this.type === 'linear' ? t = e.createLinearGradient(this.coords.x1, this.coords.y1, this.coords.x2, this.coords.y2) : this.type === 'radial' && (t = e.createRadialGradient(this.coords.x1, this.coords.y1, this.coords.r1, this.coords.x2, this.coords.y2, this.coords.r2));
      for (var n = 0, r = this.colorStops.length; n < r; n++) {
        var i = this.colorStops[n].color, s = this.colorStops[n].opacity, o = this.colorStops[n].offset;
        typeof s != 'undefined' && (i = new fabric.Color(i).setAlpha(s).toRgba()), t.addColorStop(parseFloat(o), i);
      }
      return t;
    }
  }), fabric.util.object.extend(fabric.Gradient, {
    fromElement: function (i, s) {
      var o = i.getElementsByTagName('stop'), u = i.nodeName === 'linearGradient' ? 'linear' : 'radial', a = i.getAttribute('gradientUnits') || 'objectBoundingBox', f = i.getAttribute('gradientTransform'), l = [], c = {};
      u === 'linear' ? c = t(i) : u === 'radial' && (c = n(i));
      for (var h = o.length; h--;)
        l.push(e(o[h]));
      r(s, c);
      var p = new fabric.Gradient({
          type: u,
          coords: c,
          gradientUnits: a,
          colorStops: l
        });
      return f && (p.gradientTransform = fabric.parseTransformAttribute(f)), p;
    },
    forObject: function (e, t) {
      return t || (t = {}), r(e, t), new fabric.Gradient(t);
    }
  });
}(), fabric.Pattern = fabric.util.createClass({
  repeat: 'repeat',
  offsetX: 0,
  offsetY: 0,
  initialize: function (e) {
    e || (e = {}), this.id = fabric.Object.__uid++;
    if (e.source)
      if (typeof e.source == 'string')
        if (typeof fabric.util.getFunctionBody(e.source) != 'undefined')
          this.source = new Function(fabric.util.getFunctionBody(e.source));
        else {
          var t = this;
          this.source = fabric.util.createImage(), fabric.util.loadImage(e.source, function (e) {
            t.source = e;
          });
        }
      else
        this.source = e.source;
    e.repeat && (this.repeat = e.repeat), e.offsetX && (this.offsetX = e.offsetX), e.offsetY && (this.offsetY = e.offsetY);
  },
  toObject: function () {
    var e;
    return typeof this.source == 'function' ? e = String(this.source) : typeof this.source.src == 'string' && (e = this.source.src), {
      source: e,
      repeat: this.repeat,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    };
  },
  toSVG: function (e) {
    var t = typeof this.source == 'function' ? this.source() : this.source, n = t.width / e.getWidth(), r = t.height / e.getHeight(), i = '';
    return t.src ? i = t.src : t.toDataURL && (i = t.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + this.offsetX + '" y="' + this.offsetY + '" width="' + n + '" height="' + r + '">' + '<image x="0" y="0"' + ' width="' + t.width + '" height="' + t.height + '" xlink:href="' + i + '"></image>' + '</pattern>';
  },
  toLive: function (e) {
    var t = typeof this.source == 'function' ? this.source() : this.source;
    if (!t)
      return '';
    if (typeof t.src != 'undefined') {
      if (!t.complete)
        return '';
      if (t.naturalWidth === 0 || t.naturalHeight === 0)
        return '';
    }
    return e.createPattern(t, this.repeat);
  }
}), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {});
  if (t.Shadow) {
    t.warn('fabric.Shadow is already defined.');
    return;
  }
  t.Shadow = t.util.createClass({
    color: 'rgb(0,0,0)',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    affectStroke: !1,
    includeDefaultValues: !0,
    initialize: function (e) {
      typeof e == 'string' && (e = this._parseShadow(e));
      for (var n in e)
        this[n] = e[n];
      this.id = t.Object.__uid++;
    },
    _parseShadow: function (e) {
      var n = e.trim(), r = t.Shadow.reOffsetsAndBlur.exec(n) || [], i = n.replace(t.Shadow.reOffsetsAndBlur, '') || 'rgb(0,0,0)';
      return {
        color: i.trim(),
        offsetX: parseInt(r[1], 10) || 0,
        offsetY: parseInt(r[2], 10) || 0,
        blur: parseInt(r[3], 10) || 0
      };
    },
    toString: function () {
      return [
        this.offsetX,
        this.offsetY,
        this.blur,
        this.color
      ].join('px ');
    },
    toSVG: function (e) {
      var t = 'SourceAlpha';
      return e && (e.fill === this.color || e.stroke === this.color) && (t = 'SourceGraphic'), '<filter id="SVGID_' + this.id + '" y="-40%" height="180%">' + '<feGaussianBlur in="' + t + '" stdDeviation="' + (this.blur ? this.blur / 3 : 0) + '"></feGaussianBlur>' + '<feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '"></feOffset>' + '<feMerge>' + '<feMergeNode></feMergeNode>' + '<feMergeNode in="SourceGraphic"></feMergeNode>' + '</feMerge>' + '</filter>';
    },
    toObject: function () {
      if (this.includeDefaultValues)
        return {
          color: this.color,
          blur: this.blur,
          offsetX: this.offsetX,
          offsetY: this.offsetY
        };
      var e = {}, n = t.Shadow.prototype;
      return this.color !== n.color && (e.color = this.color), this.blur !== n.blur && (e.blur = this.blur), this.offsetX !== n.offsetX && (e.offsetX = this.offsetX), this.offsetY !== n.offsetY && (e.offsetY = this.offsetY), e;
    }
  }), t.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/;
}(typeof exports != 'undefined' ? exports : this), function () {
  'use strict';
  if (fabric.StaticCanvas) {
    fabric.warn('fabric.StaticCanvas is already defined.');
    return;
  }
  var e = fabric.util.object.extend, t = fabric.util.getElementOffset, n = fabric.util.removeFromArray, r = new Error('Could not initialize `canvas` element');
  fabric.StaticCanvas = fabric.util.createClass({
    initialize: function (e, t) {
      t || (t = {}), this._initStatic(e, t), fabric.StaticCanvas.activeInstance = this;
    },
    backgroundColor: '',
    backgroundImage: null,
    overlayColor: '',
    overlayImage: null,
    includeDefaultValues: !0,
    stateful: !0,
    renderOnAddRemove: !0,
    clipTo: null,
    controlsAboveOverlay: !1,
    allowTouchScrolling: !1,
    imageSmoothingEnabled: !0,
    viewportTransform: [
      1,
      0,
      0,
      1,
      0,
      0
    ],
    onBeforeScaleRotate: function () {
    },
    _initStatic: function (e, t) {
      this._objects = [], this._createLowerCanvas(e), this._initOptions(t), this._setImageSmoothing(), t.overlayImage && this.setOverlayImage(t.overlayImage, this.renderAll.bind(this)), t.backgroundImage && this.setBackgroundImage(t.backgroundImage, this.renderAll.bind(this)), t.backgroundColor && this.setBackgroundColor(t.backgroundColor, this.renderAll.bind(this)), t.overlayColor && this.setOverlayColor(t.overlayColor, this.renderAll.bind(this)), this.calcOffset();
    },
    calcOffset: function () {
      return this._offset = t(this.lowerCanvasEl), this;
    },
    setOverlayImage: function (e, t, n) {
      return this.__setBgOverlayImage('overlayImage', e, t, n);
    },
    setBackgroundImage: function (e, t, n) {
      return this.__setBgOverlayImage('backgroundImage', e, t, n);
    },
    setOverlayColor: function (e, t) {
      return this.__setBgOverlayColor('overlayColor', e, t);
    },
    setBackgroundColor: function (e, t) {
      return this.__setBgOverlayColor('backgroundColor', e, t);
    },
    _setImageSmoothing: function () {
      var e = this.getContext();
      e.imageSmoothingEnabled = this.imageSmoothingEnabled, e.webkitImageSmoothingEnabled = this.imageSmoothingEnabled, e.mozImageSmoothingEnabled = this.imageSmoothingEnabled, e.msImageSmoothingEnabled = this.imageSmoothingEnabled, e.oImageSmoothingEnabled = this.imageSmoothingEnabled;
    },
    __setBgOverlayImage: function (e, t, n, r) {
      return typeof t == 'string' ? fabric.util.loadImage(t, function (t) {
        this[e] = new fabric.Image(t, r), n && n();
      }, this) : (this[e] = t, n && n()), this;
    },
    __setBgOverlayColor: function (e, t, n) {
      if (t && t.source) {
        var r = this;
        fabric.util.loadImage(t.source, function (i) {
          r[e] = new fabric.Pattern({
            source: i,
            repeat: t.repeat,
            offsetX: t.offsetX,
            offsetY: t.offsetY
          }), n && n();
        });
      } else
        this[e] = t, n && n();
      return this;
    },
    _createCanvasElement: function () {
      var e = fabric.document.createElement('canvas');
      e.style || (e.style = {});
      if (!e)
        throw r;
      return this._initCanvasElement(e), e;
    },
    _initCanvasElement: function (e) {
      fabric.util.createCanvasElement(e);
      if (typeof e.getContext == 'undefined')
        throw r;
    },
    _initOptions: function (e) {
      for (var t in e)
        this[t] = e[t];
      this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0, this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
      if (!this.lowerCanvasEl.style)
        return;
      this.lowerCanvasEl.width = this.width, this.lowerCanvasEl.height = this.height, this.lowerCanvasEl.style.width = this.width + 'px', this.lowerCanvasEl.style.height = this.height + 'px', this.viewportTransform = this.viewportTransform.slice();
    },
    _createLowerCanvas: function (e) {
      this.lowerCanvasEl = fabric.util.getById(e) || this._createCanvasElement(), this._initCanvasElement(this.lowerCanvasEl), fabric.util.addClass(this.lowerCanvasEl, 'lower-canvas'), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext('2d');
    },
    getWidth: function () {
      return this.width;
    },
    getHeight: function () {
      return this.height;
    },
    setWidth: function (e, t) {
      return this.setDimensions({ width: e }, t);
    },
    setHeight: function (e, t) {
      return this.setDimensions({ height: e }, t);
    },
    setDimensions: function (e, t) {
      var n;
      t = t || {};
      for (var r in e)
        n = e[r], t.cssOnly || (this._setBackstoreDimension(r, e[r]), n += 'px'), t.backstoreOnly || this._setCssDimension(r, n);
      return t.cssOnly || this.renderAll(), this.calcOffset(), this;
    },
    _setBackstoreDimension: function (e, t) {
      return this.lowerCanvasEl[e] = t, this.upperCanvasEl && (this.upperCanvasEl[e] = t), this.cacheCanvasEl && (this.cacheCanvasEl[e] = t), this[e] = t, this;
    },
    _setCssDimension: function (e, t) {
      return this.lowerCanvasEl.style[e] = t, this.upperCanvasEl && (this.upperCanvasEl.style[e] = t), this.wrapperEl && (this.wrapperEl.style[e] = t), this;
    },
    getZoom: function () {
      return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3]);
    },
    setViewportTransform: function (e) {
      this.viewportTransform = e, this.renderAll();
      for (var t = 0, n = this._objects.length; t < n; t++)
        this._objects[t].setCoords();
      return this;
    },
    zoomToPoint: function (e, t) {
      var n = e;
      e = fabric.util.transformPoint(e, fabric.util.invertTransform(this.viewportTransform)), this.viewportTransform[0] = t, this.viewportTransform[3] = t;
      var r = fabric.util.transformPoint(e, this.viewportTransform);
      this.viewportTransform[4] += n.x - r.x, this.viewportTransform[5] += n.y - r.y, this.renderAll();
      for (var i = 0, s = this._objects.length; i < s; i++)
        this._objects[i].setCoords();
      return this;
    },
    setZoom: function (e) {
      return this.zoomToPoint(new fabric.Point(0, 0), e), this;
    },
    absolutePan: function (e) {
      this.viewportTransform[4] = -e.x, this.viewportTransform[5] = -e.y, this.renderAll();
      for (var t = 0, n = this._objects.length; t < n; t++)
        this._objects[t].setCoords();
      return this;
    },
    relativePan: function (e) {
      return this.absolutePan(new fabric.Point(-e.x - this.viewportTransform[4], -e.y - this.viewportTransform[5]));
    },
    getElement: function () {
      return this.lowerCanvasEl;
    },
    getActiveObject: function () {
      return null;
    },
    getActiveGroup: function () {
      return null;
    },
    _draw: function (e, t) {
      if (!t)
        return;
      e.save();
      var n = this.viewportTransform;
      e.transform(n[0], n[1], n[2], n[3], n[4], n[5]), t.render(e), e.restore(), this.controlsAboveOverlay || t._renderControls(e);
    },
    _onObjectAdded: function (e) {
      this.stateful && e.setupState(), e.canvas = this, e.setCoords(), this.fire('object:added', { target: e }), e.fire('added');
    },
    _onObjectRemoved: function (e) {
      this.getActiveObject() === e && (this.fire('before:selection:cleared', { target: e }), this._discardActiveObject(), this.fire('selection:cleared')), this.fire('object:removed', { target: e }), e.fire('removed');
    },
    clearContext: function (e) {
      return e.clearRect(0, 0, this.width, this.height), this;
    },
    getContext: function () {
      return this.contextContainer;
    },
    clear: function () {
      return this._objects.length = 0, this.discardActiveGroup && this.discardActiveGroup(), this.discardActiveObject && this.discardActiveObject(), this.clearContext(this.contextContainer), this.contextTop && this.clearContext(this.contextTop), this.fire('canvas:cleared'), this.renderAll(), this;
    },
    renderAll: function (e) {
      var t = this[e === !0 && this.interactive ? 'contextTop' : 'contextContainer'], n = this.getActiveGroup();
      return this.contextTop && this.selection && !this._groupSelector && this.clearContext(this.contextTop), e || this.clearContext(t), this.fire('before:render'), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), this._renderObjects(t, n), this._renderActiveGroup(t, n), this.clipTo && t.restore(), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire('after:render'), this;
    },
    _renderObjects: function (e, t) {
      var n, r;
      if (!t)
        for (n = 0, r = this._objects.length; n < r; ++n)
          this._draw(e, this._objects[n]);
      else
        for (n = 0, r = this._objects.length; n < r; ++n)
          this._objects[n] && !t.contains(this._objects[n]) && this._draw(e, this._objects[n]);
    },
    _renderActiveGroup: function (e, t) {
      if (t) {
        var n = [];
        this.forEachObject(function (e) {
          t.contains(e) && n.push(e);
        }), t._set('objects', n), this._draw(e, t);
      }
    },
    _renderBackground: function (e) {
      this.backgroundColor && (e.fillStyle = this.backgroundColor.toLive ? this.backgroundColor.toLive(e) : this.backgroundColor, e.fillRect(this.backgroundColor.offsetX || 0, this.backgroundColor.offsetY || 0, this.width, this.height)), this.backgroundImage && this._draw(e, this.backgroundImage);
    },
    _renderOverlay: function (e) {
      this.overlayColor && (e.fillStyle = this.overlayColor.toLive ? this.overlayColor.toLive(e) : this.overlayColor, e.fillRect(this.overlayColor.offsetX || 0, this.overlayColor.offsetY || 0, this.width, this.height)), this.overlayImage && this._draw(e, this.overlayImage);
    },
    renderTop: function () {
      var e = this.contextTop || this.contextContainer;
      this.clearContext(e), this.selection && this._groupSelector && this._drawSelection();
      var t = this.getActiveGroup();
      return t && t.render(e), this._renderOverlay(e), this.fire('after:render'), this;
    },
    getCenter: function () {
      return {
        top: this.getHeight() / 2,
        left: this.getWidth() / 2
      };
    },
    centerObjectH: function (e) {
      return this._centerObject(e, new fabric.Point(this.getCenter().left, e.getCenterPoint().y)), this.renderAll(), this;
    },
    centerObjectV: function (e) {
      return this._centerObject(e, new fabric.Point(e.getCenterPoint().x, this.getCenter().top)), this.renderAll(), this;
    },
    centerObject: function (e) {
      var t = this.getCenter();
      return this._centerObject(e, new fabric.Point(t.left, t.top)), this.renderAll(), this;
    },
    _centerObject: function (e, t) {
      return e.setPositionByOrigin(t, 'center', 'center'), this;
    },
    toDatalessJSON: function (e) {
      return this.toDatalessObject(e);
    },
    toObject: function (e) {
      return this._toObjectMethod('toObject', e);
    },
    toDatalessObject: function (e) {
      return this._toObjectMethod('toDatalessObject', e);
    },
    _toObjectMethod: function (t, n) {
      var r = this.getActiveGroup();
      r && this.discardActiveGroup();
      var i = { objects: this._toObjects(t, n) };
      return e(i, this.__serializeBgOverlay()), fabric.util.populateWithProperties(this, i, n), r && (this.setActiveGroup(new fabric.Group(r.getObjects(), {
        originX: 'center',
        originY: 'center'
      })), r.forEachObject(function (e) {
        e.set('active', !0);
      }), this._currentTransform && (this._currentTransform.target = this.getActiveGroup())), i;
    },
    _toObjects: function (e, t) {
      return this.getObjects().map(function (n) {
        return this._toObject(n, e, t);
      }, this);
    },
    _toObject: function (e, t, n) {
      var r;
      this.includeDefaultValues || (r = e.includeDefaultValues, e.includeDefaultValues = !1);
      var i = e[t](n);
      return this.includeDefaultValues || (e.includeDefaultValues = r), i;
    },
    __serializeBgOverlay: function () {
      var e = { background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor };
      return this.overlayColor && (e.overlay = this.overlayColor.toObject ? this.overlayColor.toObject() : this.overlayColor), this.backgroundImage && (e.backgroundImage = this.backgroundImage.toObject()), this.overlayImage && (e.overlayImage = this.overlayImage.toObject()), e;
    },
    toSVG: function (e, t) {
      e || (e = {});
      var n = [];
      return this._setSVGPreamble(n, e), this._setSVGHeader(n, e), this._setSVGBgOverlayColor(n, 'backgroundColor'), this._setSVGBgOverlayImage(n, 'backgroundImage'), this._setSVGObjects(n, t), this._setSVGBgOverlayColor(n, 'overlayColor'), this._setSVGBgOverlayImage(n, 'overlayImage'), n.push('</svg>'), n.join('');
    },
    _setSVGPreamble: function (e, t) {
      t.suppressPreamble || e.push('<?xml version="1.0" encoding="', t.encoding || 'UTF-8', '" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
    },
    _setSVGHeader: function (e, t) {
      e.push('<svg ', 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', t.viewBox ? t.viewBox.width : this.width, '" ', 'height="', t.viewBox ? t.viewBox.height : this.height, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ' : null, t.viewBox ? 'viewBox="' + t.viewBox.x + ' ' + t.viewBox.y + ' ' + t.viewBox.width + ' ' + t.viewBox.height + '" ' : null, 'xml:space="preserve">', '<desc>Created with Fabric.js ', fabric.version, '</desc>', '<defs>', fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), '</defs>');
    },
    _setSVGObjects: function (e, t) {
      var n = this.getActiveGroup();
      n && this.discardActiveGroup();
      for (var r = 0, i = this.getObjects(), s = i.length; r < s; r++)
        e.push(i[r].toSVG(t));
      n && (this.setActiveGroup(new fabric.Group(n.getObjects())), n.forEachObject(function (e) {
        e.set('active', !0);
      }));
    },
    _setSVGBgOverlayImage: function (e, t) {
      this[t] && this[t].toSVG && e.push(this[t].toSVG());
    },
    _setSVGBgOverlayColor: function (e, t) {
      this[t] && this[t].source ? e.push('<rect x="', this[t].offsetX, '" y="', this[t].offsetY, '" ', 'width="', this[t].repeat === 'repeat-y' || this[t].repeat === 'no-repeat' ? this[t].source.width : this.width, '" height="', this[t].repeat === 'repeat-x' || this[t].repeat === 'no-repeat' ? this[t].source.height : this.height, '" fill="url(#' + t + 'Pattern)"', '></rect>') : this[t] && t === 'overlayColor' && e.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[t], '"', '></rect>');
    },
    sendToBack: function (e) {
      return n(this._objects, e), this._objects.unshift(e), this.renderAll && this.renderAll();
    },
    bringToFront: function (e) {
      return n(this._objects, e), this._objects.push(e), this.renderAll && this.renderAll();
    },
    sendBackwards: function (e, t) {
      var r = this._objects.indexOf(e);
      if (r !== 0) {
        var i = this._findNewLowerIndex(e, r, t);
        n(this._objects, e), this._objects.splice(i, 0, e), this.renderAll && this.renderAll();
      }
      return this;
    },
    _findNewLowerIndex: function (e, t, n) {
      var r;
      if (n) {
        r = t;
        for (var i = t - 1; i >= 0; --i) {
          var s = e.intersectsWithObject(this._objects[i]) || e.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(e);
          if (s) {
            r = i;
            break;
          }
        }
      } else
        r = t - 1;
      return r;
    },
    bringForward: function (e, t) {
      var r = this._objects.indexOf(e);
      if (r !== this._objects.length - 1) {
        var i = this._findNewUpperIndex(e, r, t);
        n(this._objects, e), this._objects.splice(i, 0, e), this.renderAll && this.renderAll();
      }
      return this;
    },
    _findNewUpperIndex: function (e, t, n) {
      var r;
      if (n) {
        r = t;
        for (var i = t + 1; i < this._objects.length; ++i) {
          var s = e.intersectsWithObject(this._objects[i]) || e.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(e);
          if (s) {
            r = i;
            break;
          }
        }
      } else
        r = t + 1;
      return r;
    },
    moveTo: function (e, t) {
      return n(this._objects, e), this._objects.splice(t, 0, e), this.renderAll && this.renderAll();
    },
    dispose: function () {
      return this.clear(), this.interactive && this.removeListeners(), this;
    },
    toString: function () {
      return '#<fabric.Canvas (' + this.complexity() + '): ' + '{ objects: ' + this.getObjects().length + ' }>';
    }
  }), e(fabric.StaticCanvas.prototype, fabric.Observable), e(fabric.StaticCanvas.prototype, fabric.Collection), e(fabric.StaticCanvas.prototype, fabric.DataURLExporter), e(fabric.StaticCanvas, {
    EMPTY_JSON: '{"objects": [], "background": "white"}',
    supports: function (e) {
      var t = fabric.util.createCanvasElement();
      if (!t || !t.getContext)
        return null;
      var n = t.getContext('2d');
      if (!n)
        return null;
      switch (e) {
      case 'getImageData':
        return typeof n.getImageData != 'undefined';
      case 'setLineDash':
        return typeof n.setLineDash != 'undefined';
      case 'toDataURL':
        return typeof t.toDataURL != 'undefined';
      case 'toDataURLWithQuality':
        try {
          return t.toDataURL('image/jpeg', 0), !0;
        } catch (r) {
        }
        return !1;
      default:
        return null;
      }
    }
  }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject;
}(), fabric.BaseBrush = fabric.util.createClass({
  color: 'rgb(0, 0, 0)',
  width: 1,
  shadow: null,
  strokeLineCap: 'round',
  strokeLineJoin: 'round',
  setShadow: function (e) {
    return this.shadow = new fabric.Shadow(e), this;
  },
  _setBrushStyles: function () {
    var e = this.canvas.contextTop;
    e.strokeStyle = this.color, e.lineWidth = this.width, e.lineCap = this.strokeLineCap, e.lineJoin = this.strokeLineJoin;
  },
  _setShadow: function () {
    if (!this.shadow)
      return;
    var e = this.canvas.contextTop;
    e.shadowColor = this.shadow.color, e.shadowBlur = this.shadow.blur, e.shadowOffsetX = this.shadow.offsetX, e.shadowOffsetY = this.shadow.offsetY;
  },
  _resetShadow: function () {
    var e = this.canvas.contextTop;
    e.shadowColor = '', e.shadowBlur = e.shadowOffsetX = e.shadowOffsetY = 0;
  }
}), function () {
  var e = fabric.util.array.min, t = fabric.util.array.max;
  fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
    initialize: function (e) {
      this.canvas = e, this._points = [];
    },
    onMouseDown: function (e) {
      this._prepareForDrawing(e), this._captureDrawingPath(e), this._render();
    },
    onMouseMove: function (e) {
      this._captureDrawingPath(e), this.canvas.clearContext(this.canvas.contextTop), this._render();
    },
    onMouseUp: function () {
      this._finalizeAndAddPath();
    },
    _prepareForDrawing: function (e) {
      var t = new fabric.Point(e.x, e.y);
      this._reset(), this._addPoint(t), this.canvas.contextTop.moveTo(t.x, t.y);
    },
    _addPoint: function (e) {
      this._points.push(e);
    },
    _reset: function () {
      this._points.length = 0, this._setBrushStyles(), this._setShadow();
    },
    _captureDrawingPath: function (e) {
      var t = new fabric.Point(e.x, e.y);
      this._addPoint(t);
    },
    _render: function () {
      var e = this.canvas.contextTop, t = this.canvas.viewportTransform, n = this._points[0], r = this._points[1];
      e.save(), e.transform(t[0], t[1], t[2], t[3], t[4], t[5]), e.beginPath(), this._points.length === 2 && n.x === r.x && n.y === r.y && (n.x -= 0.5, r.x += 0.5), e.moveTo(n.x, n.y);
      for (var i = 1, s = this._points.length; i < s; i++) {
        var o = n.midPointFrom(r);
        e.quadraticCurveTo(n.x, n.y, o.x, o.y), n = this._points[i], r = this._points[i + 1];
      }
      e.lineTo(n.x, n.y), e.stroke(), e.restore();
    },
    _getSVGPathData: function () {
      return this.box = this.getPathBoundingBox(this._points), this.convertPointsToSVGPath(this._points, this.box.minX, this.box.minY);
    },
    getPathBoundingBox: function (n) {
      var r = [], i = [], s = n[0], o = n[1], u = s;
      for (var a = 1, f = n.length; a < f; a++) {
        var l = s.midPointFrom(o);
        r.push(u.x), r.push(l.x), i.push(u.y), i.push(l.y), s = n[a], o = n[a + 1], u = l;
      }
      return r.push(s.x), i.push(s.y), {
        minX: e(r),
        minY: e(i),
        maxX: t(r),
        maxY: t(i)
      };
    },
    convertPointsToSVGPath: function (e, t, n) {
      var r = [], i = new fabric.Point(e[0].x - t, e[0].y - n), s = new fabric.Point(e[1].x - t, e[1].y - n);
      r.push('M ', e[0].x - t, ' ', e[0].y - n, ' ');
      for (var o = 1, u = e.length; o < u; o++) {
        var a = i.midPointFrom(s);
        r.push('Q ', i.x, ' ', i.y, ' ', a.x, ' ', a.y, ' '), i = new fabric.Point(e[o].x - t, e[o].y - n), o + 1 < e.length && (s = new fabric.Point(e[o + 1].x - t, e[o + 1].y - n));
      }
      return r.push('L ', i.x, ' ', i.y, ' '), r;
    },
    createPath: function (e) {
      var t = new fabric.Path(e);
      return t.fill = null, t.stroke = this.color, t.strokeWidth = this.width, t.strokeLineCap = this.strokeLineCap, t.strokeLineJoin = this.strokeLineJoin, this.shadow && (this.shadow.affectStroke = !0, t.setShadow(this.shadow)), t;
    },
    _finalizeAndAddPath: function () {
      var e = this.canvas.contextTop;
      e.closePath();
      var t = this._getSVGPathData().join('');
      if (t === 'M 0 0 Q 0 0 0 0 L 0 0') {
        this.canvas.renderAll();
        return;
      }
      var n = this.box.minX + (this.box.maxX - this.box.minX) / 2, r = this.box.minY + (this.box.maxY - this.box.minY) / 2;
      this.canvas.contextTop.arc(n, r, 3, 0, Math.PI * 2, !1);
      var i = this.createPath(t);
      i.set({
        left: n,
        top: r,
        originX: 'center',
        originY: 'center'
      }), this.canvas.add(i), i.setCoords(), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderAll(), this.canvas.fire('path:created', { path: i });
    }
  });
}(), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
  width: 10,
  initialize: function (e) {
    this.canvas = e, this.points = [];
  },
  drawDot: function (e) {
    var t = this.addPoint(e), n = this.canvas.contextTop, r = this.canvas.viewportTransform;
    n.save(), n.transform(r[0], r[1], r[2], r[3], r[4], r[5]), n.fillStyle = t.fill, n.beginPath(), n.arc(t.x, t.y, t.radius, 0, Math.PI * 2, !1), n.closePath(), n.fill(), n.restore();
  },
  onMouseDown: function (e) {
    this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(e);
  },
  onMouseMove: function (e) {
    this.drawDot(e);
  },
  onMouseUp: function () {
    var e = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = !1;
    var t = [];
    for (var n = 0, r = this.points.length; n < r; n++) {
      var i = this.points[n], s = new fabric.Circle({
          radius: i.radius,
          left: i.x,
          top: i.y,
          originX: 'center',
          originY: 'center',
          fill: i.fill
        });
      this.shadow && s.setShadow(this.shadow), t.push(s);
    }
    var o = new fabric.Group(t, {
        originX: 'center',
        originY: 'center'
      });
    o.canvas = this.canvas, this.canvas.add(o), this.canvas.fire('path:created', { path: o }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = e, this.canvas.renderAll();
  },
  addPoint: function (e) {
    var t = new fabric.Point(e.x, e.y), n = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2, r = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
    return t.radius = n, t.fill = r, this.points.push(t), t;
  }
}), fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
  width: 10,
  density: 20,
  dotWidth: 1,
  dotWidthVariance: 1,
  randomOpacity: !1,
  optimizeOverlapping: !0,
  initialize: function (e) {
    this.canvas = e, this.sprayChunks = [];
  },
  onMouseDown: function (e) {
    this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(e), this.render();
  },
  onMouseMove: function (e) {
    this.addSprayChunk(e), this.render();
  },
  onMouseUp: function () {
    var e = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = !1;
    var t = [];
    for (var n = 0, r = this.sprayChunks.length; n < r; n++) {
      var i = this.sprayChunks[n];
      for (var s = 0, o = i.length; s < o; s++) {
        var u = new fabric.Rect({
            width: i[s].width,
            height: i[s].width,
            left: i[s].x + 1,
            top: i[s].y + 1,
            originX: 'center',
            originY: 'center',
            fill: this.color
          });
        this.shadow && u.setShadow(this.shadow), t.push(u);
      }
    }
    this.optimizeOverlapping && (t = this._getOptimizedRects(t));
    var a = new fabric.Group(t, {
        originX: 'center',
        originY: 'center'
      });
    a.canvas = this.canvas, this.canvas.add(a), this.canvas.fire('path:created', { path: a }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = e, this.canvas.renderAll();
  },
  _getOptimizedRects: function (e) {
    var t = {}, n;
    for (var r = 0, i = e.length; r < i; r++)
      n = e[r].left + '' + e[r].top, t[n] || (t[n] = e[r]);
    var s = [];
    for (n in t)
      s.push(t[n]);
    return s;
  },
  render: function () {
    var e = this.canvas.contextTop;
    e.fillStyle = this.color;
    var t = this.canvas.viewportTransform;
    e.save(), e.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
    for (var n = 0, r = this.sprayChunkPoints.length; n < r; n++) {
      var i = this.sprayChunkPoints[n];
      typeof i.opacity != 'undefined' && (e.globalAlpha = i.opacity), e.fillRect(i.x, i.y, i.width, i.width);
    }
    e.restore();
  },
  addSprayChunk: function (e) {
    this.sprayChunkPoints = [];
    var t, n, r, i = this.width / 2;
    for (var s = 0; s < this.density; s++) {
      t = fabric.util.getRandomInt(e.x - i, e.x + i), n = fabric.util.getRandomInt(e.y - i, e.y + i), this.dotWidthVariance ? r = fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : r = this.dotWidth;
      var o = new fabric.Point(t, n);
      o.width = r, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o);
    }
    this.sprayChunks.push(this.sprayChunkPoints);
  }
}), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
  getPatternSrc: function () {
    var e = 20, t = 5, n = fabric.document.createElement('canvas'), r = n.getContext('2d');
    return n.width = n.height = e + t, r.fillStyle = this.color, r.beginPath(), r.arc(e / 2, e / 2, e / 2, 0, Math.PI * 2, !1), r.closePath(), r.fill(), n;
  },
  getPatternSrcFunction: function () {
    return String(this.getPatternSrc).replace('this.color', '"' + this.color + '"');
  },
  getPattern: function () {
    return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), 'repeat');
  },
  _setBrushStyles: function () {
    this.callSuper('_setBrushStyles'), this.canvas.contextTop.strokeStyle = this.getPattern();
  },
  createPath: function (e) {
    var t = this.callSuper('createPath', e);
    return t.stroke = new fabric.Pattern({ source: this.source || this.getPatternSrcFunction() }), t;
  }
}), function () {
  var e = fabric.util.getPointer, t = fabric.util.degreesToRadians, n = fabric.util.radiansToDegrees, r = Math.atan2, i = Math.abs, s = 0.5;
  fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
    initialize: function (e, t) {
      t || (t = {}), this._initStatic(e, t), this._initInteractive(), this._createCacheCanvas(), fabric.Canvas.activeInstance = this;
    },
    uniScaleTransform: !1,
    centeredScaling: !1,
    centeredRotation: !1,
    interactive: !0,
    selection: !0,
    selectionColor: 'rgba(100, 100, 255, 0.3)',
    selectionDashArray: [],
    selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
    selectionLineWidth: 1,
    hoverCursor: 'move',
    moveCursor: 'move',
    defaultCursor: 'default',
    freeDrawingCursor: 'crosshair',
    rotationCursor: 'crosshair',
    containerClass: 'canvas-container',
    perPixelTargetFind: !1,
    targetFindTolerance: 0,
    skipTargetFind: !1,
    _initInteractive: function () {
      this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset();
    },
    _resetCurrentTransform: function (e) {
      var t = this._currentTransform;
      t.target.set({
        scaleX: t.original.scaleX,
        scaleY: t.original.scaleY,
        left: t.original.left,
        top: t.original.top
      }), this._shouldCenterTransform(e, t.target) ? t.action === 'rotate' ? this._setOriginToCenter(t.target) : (t.originX !== 'center' && (t.originX === 'right' ? t.mouseXSign = -1 : t.mouseXSign = 1), t.originY !== 'center' && (t.originY === 'bottom' ? t.mouseYSign = -1 : t.mouseYSign = 1), t.originX = 'center', t.originY = 'center') : (t.originX = t.original.originX, t.originY = t.original.originY);
    },
    containsPoint: function (e, t) {
      var n = this.getPointer(e, !0), r = this._normalizePointer(t, n);
      return t.containsPoint(r) || t._findTargetCorner(n);
    },
    _normalizePointer: function (e, t) {
      var n = this.getActiveGroup(), r = t.x, i = t.y, s = n && e.type !== 'group' && n.contains(e), o;
      return s && (o = new fabric.Point(n.left, n.top), o = fabric.util.transformPoint(o, this.viewportTransform, !0), r -= o.x, i -= o.y), {
        x: r,
        y: i
      };
    },
    isTargetTransparent: function (e, t, n) {
      var r = e.hasBorders, i = e.transparentCorners;
      e.hasBorders = e.transparentCorners = !1, this._draw(this.contextCache, e), e.hasBorders = r, e.transparentCorners = i;
      var s = fabric.util.isTransparent(this.contextCache, t, n, this.targetFindTolerance);
      return this.clearContext(this.contextCache), s;
    },
    _shouldClearSelection: function (e, t) {
      var n = this.getActiveGroup(), r = this.getActiveObject();
      return !t || t && n && !n.contains(t) && n !== t && !e.shiftKey || t && !t.evented || t && !t.selectable && r && r !== t;
    },
    _shouldCenterTransform: function (e, t) {
      if (!t)
        return;
      var n = this._currentTransform, r;
      return n.action === 'scale' || n.action === 'scaleX' || n.action === 'scaleY' ? r = this.centeredScaling || t.centeredScaling : n.action === 'rotate' && (r = this.centeredRotation || t.centeredRotation), r ? !e.altKey : e.altKey;
    },
    _getOriginFromCorner: function (e, t) {
      var n = {
          x: e.originX,
          y: e.originY
        };
      if (t === 'ml' || t === 'tl' || t === 'bl')
        n.x = 'right';
      else if (t === 'mr' || t === 'tr' || t === 'br')
        n.x = 'left';
      if (t === 'tl' || t === 'mt' || t === 'tr')
        n.y = 'bottom';
      else if (t === 'bl' || t === 'mb' || t === 'br')
        n.y = 'top';
      return n;
    },
    _getActionFromCorner: function (e, t) {
      var n = 'drag';
      return t && (n = t === 'ml' || t === 'mr' ? 'scaleX' : t === 'mt' || t === 'mb' ? 'scaleY' : t === 'mtr' ? 'rotate' : 'scale'), n;
    },
    _setupCurrentTransform: function (e, n) {
      if (!n)
        return;
      var r = this.getPointer(e), i = n._findTargetCorner(this.getPointer(e, !0)), s = this._getActionFromCorner(n, i), o = this._getOriginFromCorner(n, i);
      this._currentTransform = {
        target: n,
        action: s,
        scaleX: n.scaleX,
        scaleY: n.scaleY,
        offsetX: r.x - n.left,
        offsetY: r.y - n.top,
        originX: o.x,
        originY: o.y,
        ex: r.x,
        ey: r.y,
        left: n.left,
        top: n.top,
        theta: t(n.angle),
        width: n.width * n.scaleX,
        mouseXSign: 1,
        mouseYSign: 1
      }, this._currentTransform.original = {
        left: n.left,
        top: n.top,
        scaleX: n.scaleX,
        scaleY: n.scaleY,
        originX: o.x,
        originY: o.y
      }, this._resetCurrentTransform(e);
    },
    _translateObject: function (e, t) {
      var n = this._currentTransform.target;
      n.get('lockMovementX') || n.set('left', e - this._currentTransform.offsetX), n.get('lockMovementY') || n.set('top', t - this._currentTransform.offsetY);
    },
    _scaleObject: function (e, t, n) {
      var r = this._currentTransform, i = r.target, s = i.get('lockScalingX'), o = i.get('lockScalingY'), u = i.get('lockScalingFlip');
      if (s && o)
        return;
      var a = i.translateToOriginPoint(i.getCenterPoint(), r.originX, r.originY), f = i.toLocalPoint(new fabric.Point(e, t), r.originX, r.originY);
      this._setLocalMouse(f, r), this._setObjectScale(f, r, s, o, n, u), i.setPositionByOrigin(a, r.originX, r.originY);
    },
    _setObjectScale: function (e, t, n, r, i, s) {
      var o = t.target, u = !1, a = !1;
      t.newScaleX = e.x / (o.width + o.strokeWidth), t.newScaleY = e.y / (o.height + o.strokeWidth), s && t.newScaleX <= 0 && t.newScaleX < o.scaleX && (u = !0), s && t.newScaleY <= 0 && t.newScaleY < o.scaleY && (a = !0), i === 'equally' && !n && !r ? u || a || this._scaleObjectEqually(e, o, t) : i ? i === 'x' && !o.get('lockUniScaling') ? u || n || o.set('scaleX', t.newScaleX) : i === 'y' && !o.get('lockUniScaling') && (a || r || o.set('scaleY', t.newScaleY)) : (u || n || o.set('scaleX', t.newScaleX), a || r || o.set('scaleY', t.newScaleY)), u || a || this._flipObject(t);
    },
    _scaleObjectEqually: function (e, t, n) {
      var r = e.y + e.x, i = (t.height + t.strokeWidth) * n.original.scaleY + (t.width + t.strokeWidth) * n.original.scaleX;
      n.newScaleX = n.original.scaleX * r / i, n.newScaleY = n.original.scaleY * r / i, t.set('scaleX', n.newScaleX), t.set('scaleY', n.newScaleY);
    },
    _flipObject: function (e) {
      e.newScaleX < 0 && (e.originX === 'left' ? e.originX = 'right' : e.originX === 'right' && (e.originX = 'left')), e.newScaleY < 0 && (e.originY === 'top' ? e.originY = 'bottom' : e.originY === 'bottom' && (e.originY = 'top'));
    },
    _setLocalMouse: function (e, t) {
      var n = t.target;
      t.originX === 'right' ? e.x *= -1 : t.originX === 'center' && (e.x *= t.mouseXSign * 2, e.x < 0 && (t.mouseXSign = -t.mouseXSign)), t.originY === 'bottom' ? e.y *= -1 : t.originY === 'center' && (e.y *= t.mouseYSign * 2, e.y < 0 && (t.mouseYSign = -t.mouseYSign)), i(e.x) > n.padding ? e.x < 0 ? e.x += n.padding : e.x -= n.padding : e.x = 0, i(e.y) > n.padding ? e.y < 0 ? e.y += n.padding : e.y -= n.padding : e.y = 0;
    },
    _rotateObject: function (e, t) {
      var i = this._currentTransform;
      if (i.target.get('lockRotation'))
        return;
      var s = r(i.ey - i.top, i.ex - i.left), o = r(t - i.top, e - i.left), u = n(o - s + i.theta);
      u < 0 && (u = 360 + u), i.target.angle = u;
    },
    setCursor: function (e) {
      this.upperCanvasEl.style.cursor = e;
    },
    _resetObjectTransform: function (e) {
      e.scaleX = 1, e.scaleY = 1, e.setAngle(0);
    },
    _drawSelection: function () {
      var e = this.contextTop, t = this._groupSelector, n = t.left, r = t.top, o = i(n), u = i(r);
      e.fillStyle = this.selectionColor, e.fillRect(t.ex - (n > 0 ? 0 : -n), t.ey - (r > 0 ? 0 : -r), o, u), e.lineWidth = this.selectionLineWidth, e.strokeStyle = this.selectionBorderColor;
      if (this.selectionDashArray.length > 1) {
        var a = t.ex + s - (n > 0 ? 0 : o), f = t.ey + s - (r > 0 ? 0 : u);
        e.beginPath(), fabric.util.drawDashedLine(e, a, f, a + o, f, this.selectionDashArray), fabric.util.drawDashedLine(e, a, f + u - 1, a + o, f + u - 1, this.selectionDashArray), fabric.util.drawDashedLine(e, a, f, a, f + u, this.selectionDashArray), fabric.util.drawDashedLine(e, a + o - 1, f, a + o - 1, f + u, this.selectionDashArray), e.closePath(), e.stroke();
      } else
        e.strokeRect(t.ex + s - (n > 0 ? 0 : o), t.ey + s - (r > 0 ? 0 : u), o, u);
    },
    _isLastRenderedObject: function (e) {
      return this.controlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay.visible && this.containsPoint(e, this.lastRenderedObjectWithControlsAboveOverlay) && this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(this.getPointer(e, !0));
    },
    findTarget: function (e, t) {
      if (this.skipTargetFind)
        return;
      if (this._isLastRenderedObject(e))
        return this.lastRenderedObjectWithControlsAboveOverlay;
      var n = this.getActiveGroup();
      if (n && !t && this.containsPoint(e, n))
        return n;
      var r = this._searchPossibleTargets(e);
      return this._fireOverOutEvents(r), r;
    },
    _fireOverOutEvents: function (e) {
      e ? this._hoveredTarget !== e && (this.fire('mouse:over', { target: e }), e.fire('mouseover'), this._hoveredTarget && (this.fire('mouse:out', { target: this._hoveredTarget }), this._hoveredTarget.fire('mouseout')), this._hoveredTarget = e) : this._hoveredTarget && (this.fire('mouse:out', { target: this._hoveredTarget }), this._hoveredTarget.fire('mouseout'), this._hoveredTarget = null);
    },
    _checkTarget: function (e, t, n) {
      if (t && t.visible && t.evented && this.containsPoint(e, t)) {
        if (!this.perPixelTargetFind && !t.perPixelTargetFind || !!t.isEditing)
          return !0;
        var r = this.isTargetTransparent(t, n.x, n.y);
        if (!r)
          return !0;
      }
    },
    _searchPossibleTargets: function (e) {
      var t, n = this.getPointer(e, !0), r = this._objects.length;
      while (r--)
        if (this._checkTarget(e, this._objects[r], n)) {
          this.relatedTarget = this._objects[r], t = this._objects[r];
          break;
        }
      return t;
    },
    getPointer: function (t, n, r) {
      r || (r = this.upperCanvasEl);
      var i = e(t, r), s = r.getBoundingClientRect(), o;
      return this.calcOffset(), i.x = i.x - this._offset.left, i.y = i.y - this._offset.top, n || (i = fabric.util.transformPoint(i, fabric.util.invertTransform(this.viewportTransform))), s.width === 0 || s.height === 0 ? o = {
        width: 1,
        height: 1
      } : o = {
        width: r.width / s.width,
        height: r.height / s.height
      }, {
        x: i.x * o.width,
        y: i.y * o.height
      };
    },
    _createUpperCanvas: function () {
      var e = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, '');
      this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, 'upper-canvas ' + e), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext('2d');
    },
    _createCacheCanvas: function () {
      this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute('width', this.width), this.cacheCanvasEl.setAttribute('height', this.height), this.contextCache = this.cacheCanvasEl.getContext('2d');
    },
    _initWrapperElement: function () {
      this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, 'div', { 'class': this.containerClass }), fabric.util.setStyle(this.wrapperEl, {
        width: this.getWidth() + 'px',
        height: this.getHeight() + 'px',
        position: 'relative'
      }), fabric.util.makeElementUnselectable(this.wrapperEl);
    },
    _applyCanvasStyle: function (e) {
      var t = this.getWidth() || e.width, n = this.getHeight() || e.height;
      fabric.util.setStyle(e, {
        position: 'absolute',
        width: t + 'px',
        height: n + 'px',
        left: 0,
        top: 0
      }), e.width = t, e.height = n, fabric.util.makeElementUnselectable(e);
    },
    _copyCanvasStyle: function (e, t) {
      t.style.cssText = e.style.cssText;
    },
    getSelectionContext: function () {
      return this.contextTop;
    },
    getSelectionElement: function () {
      return this.upperCanvasEl;
    },
    _setActiveObject: function (e) {
      this._activeObject && this._activeObject.set('active', !1), this._activeObject = e, e.set('active', !0);
    },
    setActiveObject: function (e, t) {
      return this._setActiveObject(e), this.renderAll(), this.fire('object:selected', {
        target: e,
        e: t
      }), e.fire('selected', { e: t }), this;
    },
    getActiveObject: function () {
      return this._activeObject;
    },
    _discardActiveObject: function () {
      this._activeObject && this._activeObject.set('active', !1), this._activeObject = null;
    },
    discardActiveObject: function (e) {
      return this._discardActiveObject(), this.renderAll(), this.fire('selection:cleared', { e: e }), this;
    },
    _setActiveGroup: function (e) {
      this._activeGroup = e, e && e.set('active', !0);
    },
    setActiveGroup: function (e, t) {
      return this._setActiveGroup(e), e && (this.fire('object:selected', {
        target: e,
        e: t
      }), e.fire('selected', { e: t })), this;
    },
    getActiveGroup: function () {
      return this._activeGroup;
    },
    _discardActiveGroup: function () {
      var e = this.getActiveGroup();
      e && e.destroy(), this.setActiveGroup(null);
    },
    discardActiveGroup: function (e) {
      return this._discardActiveGroup(), this.fire('selection:cleared', { e: e }), this;
    },
    deactivateAll: function () {
      var e = this.getObjects(), t = 0, n = e.length;
      for (; t < n; t++)
        e[t].set('active', !1);
      return this._discardActiveGroup(), this._discardActiveObject(), this;
    },
    deactivateAllWithDispatch: function (e) {
      var t = this.getActiveGroup() || this.getActiveObject();
      return t && this.fire('before:selection:cleared', {
        target: t,
        e: e
      }), this.deactivateAll(), t && this.fire('selection:cleared', { e: e }), this;
    },
    drawControls: function (e) {
      var t = this.getActiveGroup();
      t ? this._drawGroupControls(e, t) : this._drawObjectsControls(e);
    },
    _drawGroupControls: function (e, t) {
      t._renderControls(e);
    },
    _drawObjectsControls: function (e) {
      for (var t = 0, n = this._objects.length; t < n; ++t) {
        if (!this._objects[t] || !this._objects[t].active)
          continue;
        this._objects[t]._renderControls(e), this.lastRenderedObjectWithControlsAboveOverlay = this._objects[t];
      }
    }
  });
  for (var o in fabric.StaticCanvas)
    o !== 'prototype' && (fabric.Canvas[o] = fabric.StaticCanvas[o]);
  fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function () {
  }), fabric.Element = fabric.Canvas;
}(), function () {
  var e = {
      mt: 0,
      tr: 1,
      mr: 2,
      br: 3,
      mb: 4,
      bl: 5,
      ml: 6,
      tl: 7
    }, t = fabric.util.addListener, n = fabric.util.removeListener;
  fabric.util.object.extend(fabric.Canvas.prototype, {
    cursorMap: [
      'n-resize',
      'ne-resize',
      'e-resize',
      'se-resize',
      's-resize',
      'sw-resize',
      'w-resize',
      'nw-resize'
    ],
    _initEventListeners: function () {
      this._bindEvents(), t(fabric.window, 'resize', this._onResize), t(this.upperCanvasEl, 'mousedown', this._onMouseDown), t(this.upperCanvasEl, 'mousemove', this._onMouseMove), t(this.upperCanvasEl, 'mousewheel', this._onMouseWheel), t(this.upperCanvasEl, 'touchstart', this._onMouseDown), t(this.upperCanvasEl, 'touchmove', this._onMouseMove), typeof Event != 'undefined' && 'add' in Event && (Event.add(this.upperCanvasEl, 'gesture', this._onGesture), Event.add(this.upperCanvasEl, 'drag', this._onDrag), Event.add(this.upperCanvasEl, 'orientation', this._onOrientationChange), Event.add(this.upperCanvasEl, 'shake', this._onShake));
    },
    _bindEvents: function () {
      this._onMouseDown = this._onMouseDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this);
    },
    removeListeners: function () {
      n(fabric.window, 'resize', this._onResize), n(this.upperCanvasEl, 'mousedown', this._onMouseDown), n(this.upperCanvasEl, 'mousemove', this._onMouseMove), n(this.upperCanvasEl, 'mousewheel', this._onMouseWheel), n(this.upperCanvasEl, 'touchstart', this._onMouseDown), n(this.upperCanvasEl, 'touchmove', this._onMouseMove), typeof Event != 'undefined' && 'remove' in Event && (Event.remove(this.upperCanvasEl, 'gesture', this._onGesture), Event.remove(this.upperCanvasEl, 'drag', this._onDrag), Event.remove(this.upperCanvasEl, 'orientation', this._onOrientationChange), Event.remove(this.upperCanvasEl, 'shake', this._onShake));
    },
    _onGesture: function (e, t) {
      this.__onTransformGesture && this.__onTransformGesture(e, t);
    },
    _onDrag: function (e, t) {
      this.__onDrag && this.__onDrag(e, t);
    },
    _onMouseWheel: function (e, t) {
      this.__onMouseWheel && this.__onMouseWheel(e, t);
    },
    _onOrientationChange: function (e, t) {
      this.__onOrientationChange && this.__onOrientationChange(e, t);
    },
    _onShake: function (e, t) {
      this.__onShake && this.__onShake(e, t);
    },
    _onMouseDown: function (e) {
      this.__onMouseDown(e), t(fabric.document, 'touchend', this._onMouseUp), t(fabric.document, 'touchmove', this._onMouseMove), n(this.upperCanvasEl, 'mousemove', this._onMouseMove), n(this.upperCanvasEl, 'touchmove', this._onMouseMove), e.type === 'touchstart' ? n(this.upperCanvasEl, 'mousedown', this._onMouseDown) : (t(fabric.document, 'mouseup', this._onMouseUp), t(fabric.document, 'mousemove', this._onMouseMove));
    },
    _onMouseUp: function (e) {
      this.__onMouseUp(e), n(fabric.document, 'mouseup', this._onMouseUp), n(fabric.document, 'touchend', this._onMouseUp), n(fabric.document, 'mousemove', this._onMouseMove), n(fabric.document, 'touchmove', this._onMouseMove), t(this.upperCanvasEl, 'mousemove', this._onMouseMove), t(this.upperCanvasEl, 'touchmove', this._onMouseMove);
      if (e.type === 'touchend') {
        var r = this;
        setTimeout(function () {
          t(r.upperCanvasEl, 'mousedown', r._onMouseDown);
        }, 400);
      }
    },
    _onMouseMove: function (e) {
      !this.allowTouchScrolling && e.preventDefault && e.preventDefault(), this.__onMouseMove(e);
    },
    _onResize: function () {
      this.calcOffset();
    },
    _shouldRender: function (e, t) {
      var n = this.getActiveGroup() || this.getActiveObject();
      return !!(e && (e.isMoving || e !== n) || !e && !!n || !e && !n && !this._groupSelector || t && this._previousPointer && this.selection && (t.x !== this._previousPointer.x || t.y !== this._previousPointer.y));
    },
    __onMouseUp: function (e) {
      var t;
      if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this._onMouseUpInDrawingMode(e);
        return;
      }
      this._currentTransform ? (this._finalizeCurrentTransform(), t = this._currentTransform.target) : t = this.findTarget(e, !0);
      var n = this._shouldRender(t, this.getPointer(e));
      this._maybeGroupObjects(e), t && (t.isMoving = !1), n && this.renderAll(), this._handleCursorAndEvent(e, t);
    },
    _handleCursorAndEvent: function (e, t) {
      this._setCursorFromEvent(e, t);
      var n = this;
      setTimeout(function () {
        n._setCursorFromEvent(e, t);
      }, 50), this.fire('mouse:up', {
        target: t,
        e: e
      }), t && t.fire('mouseup', { e: e });
    },
    _finalizeCurrentTransform: function () {
      var e = this._currentTransform, t = e.target;
      t._scaling && (t._scaling = !1), t.setCoords(), this.stateful && t.hasStateChanged() && (this.fire('object:modified', { target: t }), t.fire('modified')), this._restoreOriginXY(t);
    },
    _restoreOriginXY: function (e) {
      if (this._previousOriginX && this._previousOriginY) {
        var t = e.translateToOriginPoint(e.getCenterPoint(), this._previousOriginX, this._previousOriginY);
        e.originX = this._previousOriginX, e.originY = this._previousOriginY, e.left = t.x, e.top = t.y, this._previousOriginX = null, this._previousOriginY = null;
      }
    },
    _onMouseDownInDrawingMode: function (e) {
      this._isCurrentlyDrawing = !0, this.discardActiveObject(e).renderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
      var t = fabric.util.invertTransform(this.viewportTransform), n = fabric.util.transformPoint(this.getPointer(e, !0), t);
      this.freeDrawingBrush.onMouseDown(n), this.fire('mouse:down', { e: e });
    },
    _onMouseMoveInDrawingMode: function (e) {
      if (this._isCurrentlyDrawing) {
        var t = fabric.util.invertTransform(this.viewportTransform), n = fabric.util.transformPoint(this.getPointer(e, !0), t);
        this.freeDrawingBrush.onMouseMove(n);
      }
      this.setCursor(this.freeDrawingCursor), this.fire('mouse:move', { e: e });
    },
    _onMouseUpInDrawingMode: function (e) {
      this._isCurrentlyDrawing = !1, this.clipTo && this.contextTop.restore(), this.freeDrawingBrush.onMouseUp(), this.fire('mouse:up', { e: e });
    },
    __onMouseDown: function (e) {
      var t = 'which' in e ? e.which === 1 : e.button === 1;
      if (!t && !fabric.isTouchSupported)
        return;
      if (this.isDrawingMode) {
        this._onMouseDownInDrawingMode(e);
        return;
      }
      if (this._currentTransform)
        return;
      var n = this.findTarget(e), r = this.getPointer(e, !0);
      this._previousPointer = r;
      var i = this._shouldRender(n, r), s = this._shouldGroup(e, n);
      this._shouldClearSelection(e, n) ? this._clearSelection(e, n, r) : s && (this._handleGrouping(e, n), n = this.getActiveGroup()), n && n.selectable && !s && (this._beforeTransform(e, n), this._setupCurrentTransform(e, n)), i && this.renderAll(), this.fire('mouse:down', {
        target: n,
        e: e
      }), n && n.fire('mousedown', { e: e });
    },
    _beforeTransform: function (e, t) {
      var n;
      this.stateful && t.saveState(), (n = t._findTargetCorner(this.getPointer(e))) && this.onBeforeScaleRotate(t), t !== this.getActiveGroup() && t !== this.getActiveObject() && (this.deactivateAll(), this.setActiveObject(t, e));
    },
    _clearSelection: function (e, t, n) {
      this.deactivateAllWithDispatch(e), t && t.selectable ? this.setActiveObject(t, e) : this.selection && (this._groupSelector = {
        ex: n.x,
        ey: n.y,
        top: 0,
        left: 0
      });
    },
    _setOriginToCenter: function (e) {
      this._previousOriginX = this._currentTransform.target.originX, this._previousOriginY = this._currentTransform.target.originY;
      var t = e.getCenterPoint();
      e.originX = 'center', e.originY = 'center', e.left = t.x, e.top = t.y, this._currentTransform.left = e.left, this._currentTransform.top = e.top;
    },
    _setCenterToOrigin: function (e) {
      var t = e.translateToOriginPoint(e.getCenterPoint(), this._previousOriginX, this._previousOriginY);
      e.originX = this._previousOriginX, e.originY = this._previousOriginY, e.left = t.x, e.top = t.y, this._previousOriginX = null, this._previousOriginY = null;
    },
    __onMouseMove: function (e) {
      var t, n;
      if (this.isDrawingMode) {
        this._onMouseMoveInDrawingMode(e);
        return;
      }
      var r = this._groupSelector;
      r ? (n = this.getPointer(e, !0), r.left = n.x - r.ex, r.top = n.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(e) : (t = this.findTarget(e), !t || t && !t.selectable ? this.setCursor(this.defaultCursor) : this._setCursorFromEvent(e, t)), this.fire('mouse:move', {
        target: t,
        e: e
      }), t && t.fire('mousemove', { e: e });
    },
    _transformObject: function (e) {
      var t = this.getPointer(e), n = this._currentTransform;
      n.reset = !1, n.target.isMoving = !0, this._beforeScaleTransform(e, n), this._performTransformAction(e, n, t), this.renderAll();
    },
    _performTransformAction: function (e, t, n) {
      var r = n.x, i = n.y, s = t.target, o = t.action;
      o === 'rotate' ? (this._rotateObject(r, i), this._fire('rotating', s, e)) : o === 'scale' ? (this._onScale(e, t, r, i), this._fire('scaling', s, e)) : o === 'scaleX' ? (this._scaleObject(r, i, 'x'), this._fire('scaling', s, e)) : o === 'scaleY' ? (this._scaleObject(r, i, 'y'), this._fire('scaling', s, e)) : (this._translateObject(r, i), this._fire('moving', s, e), this.setCursor(this.moveCursor));
    },
    _fire: function (e, t, n) {
      this.fire('object:' + e, {
        target: t,
        e: n
      }), t.fire(e, { e: n });
    },
    _beforeScaleTransform: function (e, t) {
      if (t.action === 'scale' || t.action === 'scaleX' || t.action === 'scaleY') {
        var n = this._shouldCenterTransform(e, t.target);
        if (n && (t.originX !== 'center' || t.originY !== 'center') || !n && t.originX === 'center' && t.originY === 'center')
          this._resetCurrentTransform(e), t.reset = !0;
      }
    },
    _onScale: function (e, t, n, r) {
      (e.shiftKey || this.uniScaleTransform) && !t.target.get('lockUniScaling') ? (t.currentAction = 'scale', this._scaleObject(n, r)) : (!t.reset && t.currentAction === 'scale' && this._resetCurrentTransform(e, t.target), t.currentAction = 'scaleEqually', this._scaleObject(n, r, 'equally'));
    },
    _setCursorFromEvent: function (e, t) {
      if (!t || !t.selectable)
        return this.setCursor(this.defaultCursor), !1;
      var n = this.getActiveGroup(), r = t._findTargetCorner && (!n || !n.contains(t)) && t._findTargetCorner(this.getPointer(e, !0));
      return r ? this._setCornerCursor(r, t) : this.setCursor(t.hoverCursor || this.hoverCursor), !0;
    },
    _setCornerCursor: function (t, n) {
      if (t in e)
        this.setCursor(this._getRotatedCornerCursor(t, n));
      else {
        if (t !== 'mtr' || !n.hasRotatingPoint)
          return this.setCursor(this.defaultCursor), !1;
        this.setCursor(this.rotationCursor);
      }
    },
    _getRotatedCornerCursor: function (t, n) {
      var r = Math.round(n.getAngle() % 360 / 45);
      return r < 0 && (r += 8), r += e[t], r %= 8, this.cursorMap[r];
    }
  });
}(), function () {
  var e = Math.min, t = Math.max;
  fabric.util.object.extend(fabric.Canvas.prototype, {
    _shouldGroup: function (e, t) {
      var n = this.getActiveObject();
      return e.shiftKey && (this.getActiveGroup() || n && n !== t) && this.selection;
    },
    _handleGrouping: function (e, t) {
      if (t === this.getActiveGroup()) {
        t = this.findTarget(e, !0);
        if (!t || t.isType('group'))
          return;
      }
      this.getActiveGroup() ? this._updateActiveGroup(t, e) : this._createActiveGroup(t, e), this._activeGroup && this._activeGroup.saveCoords();
    },
    _updateActiveGroup: function (e, t) {
      var n = this.getActiveGroup();
      if (n.contains(e)) {
        n.removeWithUpdate(e), this._resetObjectTransform(n), e.set('active', !1);
        if (n.size() === 1) {
          this.discardActiveGroup(t), this.setActiveObject(n.item(0));
          return;
        }
      } else
        n.addWithUpdate(e), this._resetObjectTransform(n);
      this.fire('selection:created', {
        target: n,
        e: t
      }), n.set('active', !0);
    },
    _createActiveGroup: function (e, t) {
      if (this._activeObject && e !== this._activeObject) {
        var n = this._createGroup(e);
        n.addWithUpdate(), this.setActiveGroup(n), this._activeObject = null, this.fire('selection:created', {
          target: n,
          e: t
        });
      }
      e.set('active', !0);
    },
    _createGroup: function (e) {
      var t = this.getObjects(), n = t.indexOf(this._activeObject) < t.indexOf(e), r = n ? [
          this._activeObject,
          e
        ] : [
          e,
          this._activeObject
        ];
      return new fabric.Group(r, {
        originX: 'center',
        originY: 'center',
        canvas: this
      });
    },
    _groupSelectedObjects: function (e) {
      var t = this._collectObjects();
      t.length === 1 ? this.setActiveObject(t[0], e) : t.length > 1 && (t = new fabric.Group(t.reverse(), {
        originX: 'center',
        originY: 'center',
        canvas: this
      }), t.addWithUpdate(), this.setActiveGroup(t, e), t.saveCoords(), this.fire('selection:created', { target: t }), this.renderAll());
    },
    _collectObjects: function () {
      var n = [], r, i = this._groupSelector.ex, s = this._groupSelector.ey, o = i + this._groupSelector.left, u = s + this._groupSelector.top, a = new fabric.Point(e(i, o), e(s, u)), f = new fabric.Point(t(i, o), t(s, u)), l = i === o && s === u;
      for (var c = this._objects.length; c--;) {
        r = this._objects[c];
        if (!r || !r.selectable || !r.visible)
          continue;
        if (r.intersectsWithRect(a, f) || r.isContainedWithinRect(a, f) || r.containsPoint(a) || r.containsPoint(f)) {
          r.set('active', !0), n.push(r);
          if (l)
            break;
        }
      }
      return n;
    },
    _maybeGroupObjects: function (e) {
      this.selection && this._groupSelector && this._groupSelectedObjects(e);
      var t = this.getActiveGroup();
      t && (t.setObjectsCoords().setCoords(), t.isMoving = !1, this.setCursor(this.defaultCursor)), this._groupSelector = null, this._currentTransform = null;
    }
  });
}(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  toDataURL: function (e) {
    e || (e = {});
    var t = e.format || 'png', n = e.quality || 1, r = e.multiplier || 1, i = {
        left: e.left,
        top: e.top,
        width: e.width,
        height: e.height
      };
    return r !== 1 ? this.__toDataURLWithMultiplier(t, n, i, r) : this.__toDataURL(t, n, i);
  },
  __toDataURL: function (e, t, n) {
    this.renderAll(!0);
    var r = this.upperCanvasEl || this.lowerCanvasEl, i = this.__getCroppedCanvas(r, n);
    e === 'jpg' && (e = 'jpeg');
    var s = fabric.StaticCanvas.supports('toDataURLWithQuality') ? (i || r).toDataURL('image/' + e, t) : (i || r).toDataURL('image/' + e);
    return this.contextTop && this.clearContext(this.contextTop), this.renderAll(), i && (i = null), s;
  },
  __getCroppedCanvas: function (e, t) {
    var n, r, i = 'left' in t || 'top' in t || 'width' in t || 'height' in t;
    return i && (n = fabric.util.createCanvasElement(), r = n.getContext('2d'), n.width = t.width || this.width, n.height = t.height || this.height, r.drawImage(e, -t.left || 0, -t.top || 0)), n;
  },
  __toDataURLWithMultiplier: function (e, t, n, r) {
    var i = this.getWidth(), s = this.getHeight(), o = i * r, u = s * r, a = this.getActiveObject(), f = this.getActiveGroup(), l = this.contextTop || this.contextContainer;
    r > 1 && this.setWidth(o).setHeight(u), l.scale(r, r), n.left && (n.left *= r), n.top && (n.top *= r), n.width ? n.width *= r : r < 1 && (n.width = o), n.height ? n.height *= r : r < 1 && (n.height = u), f ? this._tempRemoveBordersControlsFromGroup(f) : a && this.deactivateAll && this.deactivateAll(), this.renderAll(!0);
    var c = this.__toDataURL(e, t, n);
    return this.width = i, this.height = s, l.scale(1 / r, 1 / r), this.setWidth(i).setHeight(s), f ? this._restoreBordersControlsOnGroup(f) : a && this.setActiveObject && this.setActiveObject(a), this.contextTop && this.clearContext(this.contextTop), this.renderAll(), c;
  },
  toDataURLWithMultiplier: function (e, t, n) {
    return this.toDataURL({
      format: e,
      multiplier: t,
      quality: n
    });
  },
  _tempRemoveBordersControlsFromGroup: function (e) {
    e.origHasControls = e.hasControls, e.origBorderColor = e.borderColor, e.hasControls = !0, e.borderColor = 'rgba(0,0,0,0)', e.forEachObject(function (e) {
      e.origBorderColor = e.borderColor, e.borderColor = 'rgba(0,0,0,0)';
    });
  },
  _restoreBordersControlsOnGroup: function (e) {
    e.hideControls = e.origHideControls, e.borderColor = e.origBorderColor, e.forEachObject(function (e) {
      e.borderColor = e.origBorderColor, delete e.origBorderColor;
    });
  }
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  loadFromDatalessJSON: function (e, t, n) {
    return this.loadFromJSON(e, t, n);
  },
  loadFromJSON: function (e, t, n) {
    if (!e)
      return;
    var r = typeof e == 'string' ? JSON.parse(e) : e;
    this.clear();
    var i = this;
    return this._enlivenObjects(r.objects, function () {
      i._setBgOverlay(r, t);
    }, n), this;
  },
  _setBgOverlay: function (e, t) {
    var n = this, r = {
        backgroundColor: !1,
        overlayColor: !1,
        backgroundImage: !1,
        overlayImage: !1
      };
    if (!e.backgroundImage && !e.overlayImage && !e.background && !e.overlay) {
      t && t();
      return;
    }
    var i = function () {
      r.backgroundImage && r.overlayImage && r.backgroundColor && r.overlayColor && (n.renderAll(), t && t());
    };
    this.__setBgOverlay('backgroundImage', e.backgroundImage, r, i), this.__setBgOverlay('overlayImage', e.overlayImage, r, i), this.__setBgOverlay('backgroundColor', e.background, r, i), this.__setBgOverlay('overlayColor', e.overlay, r, i), i();
  },
  __setBgOverlay: function (e, t, n, r) {
    var i = this;
    if (!t) {
      n[e] = !0;
      return;
    }
    e === 'backgroundImage' || e === 'overlayImage' ? fabric.Image.fromObject(t, function (t) {
      i[e] = t, n[e] = !0, r && r();
    }) : this['set' + fabric.util.string.capitalize(e, !0)](t, function () {
      n[e] = !0, r && r();
    });
  },
  _enlivenObjects: function (e, t, n) {
    var r = this;
    if (!e || e.length === 0) {
      t && t();
      return;
    }
    var i = this.renderOnAddRemove;
    this.renderOnAddRemove = !1, fabric.util.enlivenObjects(e, function (e) {
      e.forEach(function (e, t) {
        r.insertAt(e, t, !0);
      }), r.renderOnAddRemove = i, t && t();
    }, null, n);
  },
  _toDataURL: function (e, t) {
    this.clone(function (n) {
      t(n.toDataURL(e));
    });
  },
  _toDataURLWithMultiplier: function (e, t, n) {
    this.clone(function (r) {
      n(r.toDataURLWithMultiplier(e, t));
    });
  },
  clone: function (e, t) {
    var n = JSON.stringify(this.toJSON(t));
    this.cloneWithoutData(function (t) {
      t.loadFromJSON(n, function () {
        e && e(t);
      });
    });
  },
  cloneWithoutData: function (e) {
    var t = fabric.document.createElement('canvas');
    t.width = this.getWidth(), t.height = this.getHeight();
    var n = new fabric.Canvas(t);
    n.clipTo = this.clipTo, this.backgroundImage ? (n.setBackgroundImage(this.backgroundImage.src, function () {
      n.renderAll(), e && e(n);
    }), n.backgroundImageOpacity = this.backgroundImageOpacity, n.backgroundImageStretch = this.backgroundImageStretch) : e && e(n);
  }
}), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = t.util.toFixed, i = t.util.string.capitalize, s = t.util.degreesToRadians, o = t.StaticCanvas.supports('setLineDash');
  if (t.Object)
    return;
  t.Object = t.util.createClass({
    type: 'object',
    originX: 'left',
    originY: 'top',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    flipX: !1,
    flipY: !1,
    opacity: 1,
    angle: 0,
    cornerSize: 12,
    transparentCorners: !0,
    hoverCursor: null,
    padding: 0,
    borderColor: 'rgba(102,153,255,0.75)',
    cornerColor: 'rgba(102,153,255,0.5)',
    centeredScaling: !1,
    centeredRotation: !0,
    fill: 'rgb(0,0,0)',
    fillRule: 'source-over',
    backgroundColor: '',
    stroke: null,
    strokeWidth: 1,
    strokeDashArray: null,
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter',
    strokeMiterLimit: 10,
    shadow: null,
    borderOpacityWhenMoving: 0.4,
    borderScaleFactor: 1,
    transformMatrix: null,
    minScaleLimit: 0.01,
    selectable: !0,
    evented: !0,
    visible: !0,
    hasControls: !0,
    hasBorders: !0,
    hasRotatingPoint: !0,
    rotatingPointOffset: 40,
    perPixelTargetFind: !1,
    includeDefaultValues: !0,
    clipTo: null,
    lockMovementX: !1,
    lockMovementY: !1,
    lockRotation: !1,
    lockScalingX: !1,
    lockScalingY: !1,
    lockUniScaling: !1,
    lockScalingFlip: !1,
    stateProperties: 'top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule shadow clipTo visible backgroundColor'.split(' '),
    initialize: function (e) {
      e && this.setOptions(e);
    },
    _initGradient: function (e) {
      e.fill && e.fill.colorStops && !(e.fill instanceof t.Gradient) && this.set('fill', new t.Gradient(e.fill));
    },
    _initPattern: function (e) {
      e.fill && e.fill.source && !(e.fill instanceof t.Pattern) && this.set('fill', new t.Pattern(e.fill)), e.stroke && e.stroke.source && !(e.stroke instanceof t.Pattern) && this.set('stroke', new t.Pattern(e.stroke));
    },
    _initClipping: function (e) {
      if (!e.clipTo || typeof e.clipTo != 'string')
        return;
      var n = t.util.getFunctionBody(e.clipTo);
      typeof n != 'undefined' && (this.clipTo = new Function('ctx', n));
    },
    setOptions: function (e) {
      for (var t in e)
        this.set(t, e[t]);
      this._initGradient(e), this._initPattern(e), this._initClipping(e);
    },
    transform: function (e, t) {
      this.group && this.group.transform(e, t), e.globalAlpha = this.opacity;
      var n = t ? this._getLeftTopCoords() : this.getCenterPoint();
      e.translate(n.x, n.y), e.rotate(s(this.angle)), e.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
    },
    toObject: function (e) {
      var n = t.Object.NUM_FRACTION_DIGITS, i = {
          type: this.type,
          originX: this.originX,
          originY: this.originY,
          left: r(this.left, n),
          top: r(this.top, n),
          width: r(this.width, n),
          height: r(this.height, n),
          fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
          stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
          strokeWidth: r(this.strokeWidth, n),
          strokeDashArray: this.strokeDashArray,
          strokeLineCap: this.strokeLineCap,
          strokeLineJoin: this.strokeLineJoin,
          strokeMiterLimit: r(this.strokeMiterLimit, n),
          scaleX: r(this.scaleX, n),
          scaleY: r(this.scaleY, n),
          angle: r(this.getAngle(), n),
          flipX: this.flipX,
          flipY: this.flipY,
          opacity: r(this.opacity, n),
          shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
          visible: this.visible,
          clipTo: this.clipTo && String(this.clipTo),
          backgroundColor: this.backgroundColor
        };
      return this.includeDefaultValues || (i = this._removeDefaultValues(i)), t.util.populateWithProperties(this, i, e), i;
    },
    toDatalessObject: function (e) {
      return this.toObject(e);
    },
    _removeDefaultValues: function (e) {
      var n = t.util.getKlass(e.type).prototype, r = n.stateProperties;
      return r.forEach(function (t) {
        e[t] === n[t] && delete e[t];
      }), e;
    },
    toString: function () {
      return '#<fabric.' + i(this.type) + '>';
    },
    get: function (e) {
      return this[e];
    },
    _setObject: function (e) {
      for (var t in e)
        this._set(t, e[t]);
    },
    set: function (e, t) {
      return typeof e == 'object' ? this._setObject(e) : typeof t == 'function' && e !== 'clipTo' ? this._set(e, t(this.get(e))) : this._set(e, t), this;
    },
    _set: function (e, n) {
      var i = e === 'scaleX' || e === 'scaleY';
      return i && (n = this._constrainScale(n)), e === 'scaleX' && n < 0 ? (this.flipX = !this.flipX, n *= -1) : e === 'scaleY' && n < 0 ? (this.flipY = !this.flipY, n *= -1) : e === 'width' || e === 'height' ? this.minScaleLimit = r(Math.min(0.1, 1 / Math.max(this.width, this.height)), 2) : e === 'shadow' && n && !(n instanceof t.Shadow) && (n = new t.Shadow(n)), this[e] = n, this;
    },
    toggle: function (e) {
      var t = this.get(e);
      return typeof t == 'boolean' && this.set(e, !t), this;
    },
    setSourcePath: function (e) {
      return this.sourcePath = e, this;
    },
    getViewportTransform: function () {
      return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : [
        1,
        0,
        0,
        1,
        0,
        0
      ];
    },
    render: function (e, n) {
      if (this.width === 0 || this.height === 0 || !this.visible)
        return;
      e.save(), this._setupFillRule(e), this._transform(e, n), this._setStrokeStyles(e), this._setFillStyles(e);
      if (this.group && this.group.type === 'path-group') {
        e.translate(-this.group.width / 2, -this.group.height / 2);
        var r = this.transformMatrix;
        r && e.transform.apply(e, r);
      }
      e.globalAlpha = this.group ? e.globalAlpha * this.opacity : this.opacity, this._setShadow(e), this.clipTo && t.util.clipContext(this, e), this._render(e, n), this.clipTo && e.restore(), this._removeShadow(e), this._restoreFillRule(e), e.restore();
    },
    _transform: function (e, t) {
      var n = this.transformMatrix;
      n && !this.group && e.setTransform.apply(e, n), t || this.transform(e);
    },
    _setStrokeStyles: function (e) {
      this.stroke && (e.lineWidth = this.strokeWidth, e.lineCap = this.strokeLineCap, e.lineJoin = this.strokeLineJoin, e.miterLimit = this.strokeMiterLimit, e.strokeStyle = this.stroke.toLive ? this.stroke.toLive(e) : this.stroke);
    },
    _setFillStyles: function (e) {
      this.fill && (e.fillStyle = this.fill.toLive ? this.fill.toLive(e) : this.fill);
    },
    _renderControls: function (e, n) {
      var r = this.getViewportTransform();
      e.save();
      if (this.active && !n) {
        var i;
        this.group && (i = t.util.transformPoint(this.group.getCenterPoint(), r), e.translate(i.x, i.y), e.rotate(s(this.group.angle))), i = t.util.transformPoint(this.getCenterPoint(), r, null != this.group), this.group && (i.x *= this.group.scaleX, i.y *= this.group.scaleY), e.translate(i.x, i.y), e.rotate(s(this.angle)), this.drawBorders(e), this.drawControls(e);
      }
      e.restore();
    },
    _setShadow: function (e) {
      if (!this.shadow)
        return;
      e.shadowColor = this.shadow.color, e.shadowBlur = this.shadow.blur, e.shadowOffsetX = this.shadow.offsetX, e.shadowOffsetY = this.shadow.offsetY;
    },
    _removeShadow: function (e) {
      if (!this.shadow)
        return;
      e.shadowColor = '', e.shadowBlur = e.shadowOffsetX = e.shadowOffsetY = 0;
    },
    _renderFill: function (e) {
      if (!this.fill)
        return;
      e.save(), this.fill.toLive && e.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0);
      if (this.fill.gradientTransform) {
        var t = this.fill.gradientTransform;
        e.transform.apply(e, t);
      }
      this.fillRule === 'destination-over' ? e.fill('evenodd') : e.fill(), e.restore(), this.shadow && !this.shadow.affectStroke && this._removeShadow(e);
    },
    _renderStroke: function (e) {
      if (!this.stroke || this.strokeWidth === 0)
        return;
      e.save();
      if (this.strokeDashArray)
        1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), o ? (e.setLineDash(this.strokeDashArray), this._stroke && this._stroke(e)) : this._renderDashedStroke && this._renderDashedStroke(e), e.stroke();
      else {
        if (this.stroke.gradientTransform) {
          var t = this.stroke.gradientTransform;
          e.transform.apply(e, t);
        }
        this._stroke ? this._stroke(e) : e.stroke();
      }
      this._removeShadow(e), e.restore();
    },
    clone: function (e, n) {
      return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(n), e) : new t.Object(this.toObject(n));
    },
    cloneAsImage: function (e) {
      var n = this.toDataURL();
      return t.util.loadImage(n, function (n) {
        e && e(new t.Image(n));
      }), this;
    },
    toDataURL: function (e) {
      e || (e = {});
      var n = t.util.createCanvasElement(), r = this.getBoundingRect();
      n.width = r.width, n.height = r.height, t.util.wrapElement(n, 'div');
      var i = new t.Canvas(n);
      e.format === 'jpg' && (e.format = 'jpeg'), e.format === 'jpeg' && (i.backgroundColor = '#fff');
      var s = {
          active: this.get('active'),
          left: this.getLeft(),
          top: this.getTop()
        };
      this.set('active', !1), this.setPositionByOrigin(new t.Point(n.width / 2, n.height / 2), 'center', 'center');
      var o = this.canvas;
      i.add(this);
      var u = i.toDataURL(e);
      return this.set(s).setCoords(), this.canvas = o, i.dispose(), i = null, u;
    },
    isType: function (e) {
      return this.type === e;
    },
    complexity: function () {
      return 0;
    },
    toJSON: function (e) {
      return this.toObject(e);
    },
    setGradient: function (e, n) {
      n || (n = {});
      var r = { colorStops: [] };
      r.type = n.type || (n.r1 || n.r2 ? 'radial' : 'linear'), r.coords = {
        x1: n.x1,
        y1: n.y1,
        x2: n.x2,
        y2: n.y2
      };
      if (n.r1 || n.r2)
        r.coords.r1 = n.r1, r.coords.r2 = n.r2;
      for (var i in n.colorStops) {
        var s = new t.Color(n.colorStops[i]);
        r.colorStops.push({
          offset: i,
          color: s.toRgb(),
          opacity: s.getAlpha()
        });
      }
      return this.set(e, t.Gradient.forObject(this, r));
    },
    setPatternFill: function (e) {
      return this.set('fill', new t.Pattern(e));
    },
    setShadow: function (e) {
      return this.set('shadow', e ? new t.Shadow(e) : null);
    },
    setColor: function (e) {
      return this.set('fill', e), this;
    },
    setAngle: function (e) {
      var t = (this.originX !== 'center' || this.originY !== 'center') && this.centeredRotation;
      return t && this._setOriginToCenter(), this.set('angle', e), t && this._resetOrigin(), this;
    },
    centerH: function () {
      return this.canvas.centerObjectH(this), this;
    },
    centerV: function () {
      return this.canvas.centerObjectV(this), this;
    },
    center: function () {
      return this.canvas.centerObject(this), this;
    },
    remove: function () {
      return this.canvas.remove(this), this;
    },
    getLocalPointer: function (e, t) {
      t = t || this.canvas.getPointer(e);
      var n = this.translateToOriginPoint(this.getCenterPoint(), 'left', 'top');
      return {
        x: t.x - n.x,
        y: t.y - n.y
      };
    },
    _setupFillRule: function (e) {
      this.fillRule && (this._prevFillRule = e.globalCompositeOperation, e.globalCompositeOperation = this.fillRule);
    },
    _restoreFillRule: function (e) {
      this.fillRule && this._prevFillRule && (e.globalCompositeOperation = this._prevFillRule);
    }
  }), t.util.createAccessors(t.Object), t.Object.prototype.rotate = t.Object.prototype.setAngle, n(t.Object.prototype, t.Observable), t.Object.NUM_FRACTION_DIGITS = 2, t.Object.__uid = 0;
}(typeof exports != 'undefined' ? exports : this), function () {
  var e = fabric.util.degreesToRadians;
  fabric.util.object.extend(fabric.Object.prototype, {
    translateToCenterPoint: function (t, n, r) {
      var i = t.x, s = t.y, o = this.stroke ? this.strokeWidth : 0;
      return n === 'left' ? i = t.x + (this.getWidth() + o * this.scaleX) / 2 : n === 'right' && (i = t.x - (this.getWidth() + o * this.scaleX) / 2), r === 'top' ? s = t.y + (this.getHeight() + o * this.scaleY) / 2 : r === 'bottom' && (s = t.y - (this.getHeight() + o * this.scaleY) / 2), fabric.util.rotatePoint(new fabric.Point(i, s), t, e(this.angle));
    },
    translateToOriginPoint: function (t, n, r) {
      var i = t.x, s = t.y, o = this.stroke ? this.strokeWidth : 0;
      return n === 'left' ? i = t.x - (this.getWidth() + o * this.scaleX) / 2 : n === 'right' && (i = t.x + (this.getWidth() + o * this.scaleX) / 2), r === 'top' ? s = t.y - (this.getHeight() + o * this.scaleY) / 2 : r === 'bottom' && (s = t.y + (this.getHeight() + o * this.scaleY) / 2), fabric.util.rotatePoint(new fabric.Point(i, s), t, e(this.angle));
    },
    getCenterPoint: function () {
      var e = new fabric.Point(this.left, this.top);
      return this.translateToCenterPoint(e, this.originX, this.originY);
    },
    getPointByOrigin: function (e, t) {
      var n = this.getCenterPoint();
      return this.translateToOriginPoint(n, e, t);
    },
    toLocalPoint: function (t, n, r) {
      var i = this.getCenterPoint(), s = this.stroke ? this.strokeWidth : 0, o, u;
      return n && r ? (n === 'left' ? o = i.x - (this.getWidth() + s * this.scaleX) / 2 : n === 'right' ? o = i.x + (this.getWidth() + s * this.scaleX) / 2 : o = i.x, r === 'top' ? u = i.y - (this.getHeight() + s * this.scaleY) / 2 : r === 'bottom' ? u = i.y + (this.getHeight() + s * this.scaleY) / 2 : u = i.y) : (o = this.left, u = this.top), fabric.util.rotatePoint(new fabric.Point(t.x, t.y), i, -e(this.angle)).subtractEquals(new fabric.Point(o, u));
    },
    setPositionByOrigin: function (e, t, n) {
      var r = this.translateToCenterPoint(e, t, n), i = this.translateToOriginPoint(r, this.originX, this.originY);
      this.set('left', i.x), this.set('top', i.y);
    },
    adjustPosition: function (t) {
      var n = e(this.angle), r = this.getWidth() / 2, i = Math.cos(n) * r, s = Math.sin(n) * r, o = this.getWidth(), u = Math.cos(n) * o, a = Math.sin(n) * o;
      this.originX === 'center' && t === 'left' || this.originX === 'right' && t === 'center' ? (this.left -= i, this.top -= s) : this.originX === 'left' && t === 'center' || this.originX === 'center' && t === 'right' ? (this.left += i, this.top += s) : this.originX === 'left' && t === 'right' ? (this.left += u, this.top += a) : this.originX === 'right' && t === 'left' && (this.left -= u, this.top -= a), this.setCoords(), this.originX = t;
    },
    _setOriginToCenter: function () {
      this._originalOriginX = this.originX, this._originalOriginY = this.originY;
      var e = this.getCenterPoint();
      this.originX = 'center', this.originY = 'center', this.left = e.x, this.top = e.y;
    },
    _resetOrigin: function () {
      var e = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
      this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = e.x, this.top = e.y, this._originalOriginX = null, this._originalOriginY = null;
    },
    _getLeftTopCoords: function () {
      return this.translateToOriginPoint(this.getCenterPoint(), 'left', 'center');
    }
  });
}(), function () {
  var e = fabric.util.degreesToRadians;
  fabric.util.object.extend(fabric.Object.prototype, {
    oCoords: null,
    intersectsWithRect: function (e, t) {
      var n = this.oCoords, r = new fabric.Point(n.tl.x, n.tl.y), i = new fabric.Point(n.tr.x, n.tr.y), s = new fabric.Point(n.bl.x, n.bl.y), o = new fabric.Point(n.br.x, n.br.y), u = fabric.Intersection.intersectPolygonRectangle([
          r,
          i,
          o,
          s
        ], e, t);
      return u.status === 'Intersection';
    },
    intersectsWithObject: function (e) {
      function t(e) {
        return {
          tl: new fabric.Point(e.tl.x, e.tl.y),
          tr: new fabric.Point(e.tr.x, e.tr.y),
          bl: new fabric.Point(e.bl.x, e.bl.y),
          br: new fabric.Point(e.br.x, e.br.y)
        };
      }
      var n = t(this.oCoords), r = t(e.oCoords), i = fabric.Intersection.intersectPolygonPolygon([
          n.tl,
          n.tr,
          n.br,
          n.bl
        ], [
          r.tl,
          r.tr,
          r.br,
          r.bl
        ]);
      return i.status === 'Intersection';
    },
    isContainedWithinObject: function (e) {
      var t = e.getBoundingRect(), n = new fabric.Point(t.left, t.top), r = new fabric.Point(t.left + t.width, t.top + t.height);
      return this.isContainedWithinRect(n, r);
    },
    isContainedWithinRect: function (e, t) {
      var n = this.getBoundingRect();
      return n.left >= e.x && n.left + n.width <= t.x && n.top >= e.y && n.top + n.height <= t.y;
    },
    containsPoint: function (e) {
      var t = this._getImageLines(this.oCoords), n = this._findCrossPoints(e, t);
      return n !== 0 && n % 2 === 1;
    },
    _getImageLines: function (e) {
      return {
        topline: {
          o: e.tl,
          d: e.tr
        },
        rightline: {
          o: e.tr,
          d: e.br
        },
        bottomline: {
          o: e.br,
          d: e.bl
        },
        leftline: {
          o: e.bl,
          d: e.tl
        }
      };
    },
    _findCrossPoints: function (e, t) {
      var n, r, i, s, o, u, a = 0, f;
      for (var l in t) {
        f = t[l];
        if (f.o.y < e.y && f.d.y < e.y)
          continue;
        if (f.o.y >= e.y && f.d.y >= e.y)
          continue;
        f.o.x === f.d.x && f.o.x >= e.x ? (o = f.o.x, u = e.y) : (n = 0, r = (f.d.y - f.o.y) / (f.d.x - f.o.x), i = e.y - n * e.x, s = f.o.y - r * f.o.x, o = -(i - s) / (n - r), u = i + n * o), o >= e.x && (a += 1);
        if (a === 2)
          break;
      }
      return a;
    },
    getBoundingRectWidth: function () {
      return this.getBoundingRect().width;
    },
    getBoundingRectHeight: function () {
      return this.getBoundingRect().height;
    },
    getBoundingRect: function () {
      this.oCoords || this.setCoords();
      var e = [
          this.oCoords.tl.x,
          this.oCoords.tr.x,
          this.oCoords.br.x,
          this.oCoords.bl.x
        ], t = fabric.util.array.min(e), n = fabric.util.array.max(e), r = Math.abs(t - n), i = [
          this.oCoords.tl.y,
          this.oCoords.tr.y,
          this.oCoords.br.y,
          this.oCoords.bl.y
        ], s = fabric.util.array.min(i), o = fabric.util.array.max(i), u = Math.abs(s - o);
      return {
        left: t,
        top: s,
        width: r,
        height: u
      };
    },
    getWidth: function () {
      return this.width * this.scaleX;
    },
    getHeight: function () {
      return this.height * this.scaleY;
    },
    _constrainScale: function (e) {
      return Math.abs(e) < this.minScaleLimit ? e < 0 ? -this.minScaleLimit : this.minScaleLimit : e;
    },
    scale: function (e) {
      return e = this._constrainScale(e), e < 0 && (this.flipX = !this.flipX, this.flipY = !this.flipY, e *= -1), this.scaleX = e, this.scaleY = e, this.setCoords(), this;
    },
    scaleToWidth: function (e) {
      var t = this.getBoundingRectWidth() / this.getWidth();
      return this.scale(e / this.width / t);
    },
    scaleToHeight: function (e) {
      var t = this.getBoundingRectHeight() / this.getHeight();
      return this.scale(e / this.height / t);
    },
    setCoords: function () {
      var t = this.strokeWidth > 1 ? this.strokeWidth : 0, n = e(this.angle), r = this.getViewportTransform(), i = function (e) {
          return fabric.util.transformPoint(e, r);
        }, s = this.width, o = this.height, u = this.strokeLineCap === 'round' || this.strokeLineCap === 'square', a = this.type === 'line' && this.width === 1, f = this.type === 'line' && this.height === 1, l = u && f || this.type !== 'line', c = u && a || this.type !== 'line';
      a ? s = t : f && (o = t), l && (s += t), c && (o += t), this.currentWidth = s * this.scaleX, this.currentHeight = o * this.scaleY, this.currentWidth < 0 && (this.currentWidth = Math.abs(this.currentWidth));
      var h = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2)), p = Math.atan(isFinite(this.currentHeight / this.currentWidth) ? this.currentHeight / this.currentWidth : 0), d = Math.cos(p + n) * h, v = Math.sin(p + n) * h, m = Math.sin(n), g = Math.cos(n), y = this.getCenterPoint(), b = new fabric.Point(this.currentWidth, this.currentHeight), w = new fabric.Point(y.x - d, y.y - v), E = new fabric.Point(w.x + b.x * g, w.y + b.x * m), S = new fabric.Point(w.x - b.y * m, w.y + b.y * g), x = new fabric.Point(w.x + b.x / 2 * g, w.y + b.x / 2 * m), T = i(w), N = i(E), C = i(new fabric.Point(E.x - b.y * m, E.y + b.y * g)), k = i(S), L = i(new fabric.Point(w.x - b.y / 2 * m, w.y + b.y / 2 * g)), A = i(x), O = i(new fabric.Point(E.x - b.y / 2 * m, E.y + b.y / 2 * g)), M = i(new fabric.Point(S.x + b.x / 2 * g, S.y + b.x / 2 * m)), _ = i(new fabric.Point(x.x, x.y)), D = Math.cos(p + n) * this.padding * Math.sqrt(2), P = Math.sin(p + n) * this.padding * Math.sqrt(2);
      return T = T.add(new fabric.Point(-D, -P)), N = N.add(new fabric.Point(P, -D)), C = C.add(new fabric.Point(D, P)), k = k.add(new fabric.Point(-P, D)), L = L.add(new fabric.Point((-D - P) / 2, (-P + D) / 2)), A = A.add(new fabric.Point((P - D) / 2, -(P + D) / 2)), O = O.add(new fabric.Point((P + D) / 2, (P - D) / 2)), M = M.add(new fabric.Point((D - P) / 2, (D + P) / 2)), _ = _.add(new fabric.Point((P - D) / 2, -(P + D) / 2)), this.oCoords = {
        tl: T,
        tr: N,
        br: C,
        bl: k,
        ml: L,
        mt: A,
        mr: O,
        mb: M,
        mtr: _
      }, this._setCornerCoords && this._setCornerCoords(), this;
    }
  });
}(), fabric.util.object.extend(fabric.Object.prototype, {
  sendToBack: function () {
    return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this;
  },
  bringToFront: function () {
    return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this;
  },
  sendBackwards: function (e) {
    return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, e) : this.canvas.sendBackwards(this, e), this;
  },
  bringForward: function (e) {
    return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, e) : this.canvas.bringForward(this, e), this;
  },
  moveTo: function (e) {
    return this.group ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, e) : this.canvas.moveTo(this, e), this;
  }
}), fabric.util.object.extend(fabric.Object.prototype, {
  getSvgStyles: function () {
    var e = this.fill ? this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill : 'none', t = this.fillRule === 'destination-over' ? 'evenodd' : this.fillRule, n = this.stroke ? this.stroke.toLive ? 'url(#SVGID_' + this.stroke.id + ')' : this.stroke : 'none', r = this.strokeWidth ? this.strokeWidth : '0', i = this.strokeDashArray ? this.strokeDashArray.join(' ') : '', s = this.strokeLineCap ? this.strokeLineCap : 'butt', o = this.strokeLineJoin ? this.strokeLineJoin : 'miter', u = this.strokeMiterLimit ? this.strokeMiterLimit : '4', a = typeof this.opacity != 'undefined' ? this.opacity : '1', f = this.visible ? '' : ' visibility: hidden;', l = this.shadow && this.type !== 'text' ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';
    return [
      'stroke: ',
      n,
      '; ',
      'stroke-width: ',
      r,
      '; ',
      'stroke-dasharray: ',
      i,
      '; ',
      'stroke-linecap: ',
      s,
      '; ',
      'stroke-linejoin: ',
      o,
      '; ',
      'stroke-miterlimit: ',
      u,
      '; ',
      'fill: ',
      e,
      '; ',
      'fill-rule: ',
      t,
      '; ',
      'opacity: ',
      a,
      ';',
      l,
      f
    ].join('');
  },
  getSvgTransform: function () {
    if (this.group)
      return '';
    var e = fabric.util.toFixed, t = this.getAngle(), n = this.getViewportTransform(), r = fabric.util.transformPoint(this.getCenterPoint(), n), i = fabric.Object.NUM_FRACTION_DIGITS, s = this.type === 'path-group' ? '' : 'translate(' + e(r.x, i) + ' ' + e(r.y, i) + ')', o = t !== 0 ? ' rotate(' + e(t, i) + ')' : '', u = this.scaleX === 1 && this.scaleY === 1 && n[0] === 1 && n[3] === 1 ? '' : ' scale(' + e(this.scaleX * n[0], i) + ' ' + e(this.scaleY * n[3], i) + ')', a = this.type === 'path-group' ? this.width * n[0] : 0, f = this.flipX ? ' matrix(-1 0 0 1 ' + a + ' 0) ' : '', l = this.type === 'path-group' ? this.height * n[3] : 0, c = this.flipY ? ' matrix(1 0 0 -1 0 ' + l + ')' : '';
    return [
      s,
      o,
      u,
      f,
      c
    ].join('');
  },
  getSvgTransformMatrix: function () {
    return this.transformMatrix ? ' matrix(' + this.transformMatrix.join(' ') + ')' : '';
  },
  _createBaseSVGMarkup: function () {
    var e = [];
    return this.fill && this.fill.toLive && e.push(this.fill.toSVG(this, !1)), this.stroke && this.stroke.toLive && e.push(this.stroke.toSVG(this, !1)), this.shadow && e.push(this.shadow.toSVG(this)), e;
  }
}), fabric.util.object.extend(fabric.Object.prototype, {
  hasStateChanged: function () {
    return this.stateProperties.some(function (e) {
      return this.get(e) !== this.originalState[e];
    }, this);
  },
  saveState: function (e) {
    return this.stateProperties.forEach(function (e) {
      this.originalState[e] = this.get(e);
    }, this), e && e.stateProperties && e.stateProperties.forEach(function (e) {
      this.originalState[e] = this.get(e);
    }, this), this;
  },
  setupState: function () {
    return this.originalState = {}, this.saveState(), this;
  }
}), function () {
  var e = fabric.util.degreesToRadians, t = function () {
      return typeof G_vmlCanvasManager != 'undefined';
    };
  fabric.util.object.extend(fabric.Object.prototype, {
    _controlsVisibility: null,
    _findTargetCorner: function (e) {
      if (!this.hasControls || !this.active)
        return !1;
      var t = e.x, n = e.y, r, i;
      for (var s in this.oCoords) {
        if (!this.isControlVisible(s))
          continue;
        if (s === 'mtr' && !this.hasRotatingPoint)
          continue;
        if (!(!this.get('lockUniScaling') || s !== 'mt' && s !== 'mr' && s !== 'mb' && s !== 'ml'))
          continue;
        i = this._getImageLines(this.oCoords[s].corner), r = this._findCrossPoints({
          x: t,
          y: n
        }, i);
        if (r !== 0 && r % 2 === 1)
          return this.__corner = s, s;
      }
      return !1;
    },
    _setCornerCoords: function () {
      var t = this.oCoords, n = e(this.angle), r = e(45 - this.angle), i = Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2, s = i * Math.cos(r), o = i * Math.sin(r), u = Math.sin(n), a = Math.cos(n);
      t.tl.corner = {
        tl: {
          x: t.tl.x - o,
          y: t.tl.y - s
        },
        tr: {
          x: t.tl.x + s,
          y: t.tl.y - o
        },
        bl: {
          x: t.tl.x - s,
          y: t.tl.y + o
        },
        br: {
          x: t.tl.x + o,
          y: t.tl.y + s
        }
      }, t.tr.corner = {
        tl: {
          x: t.tr.x - o,
          y: t.tr.y - s
        },
        tr: {
          x: t.tr.x + s,
          y: t.tr.y - o
        },
        br: {
          x: t.tr.x + o,
          y: t.tr.y + s
        },
        bl: {
          x: t.tr.x - s,
          y: t.tr.y + o
        }
      }, t.bl.corner = {
        tl: {
          x: t.bl.x - o,
          y: t.bl.y - s
        },
        bl: {
          x: t.bl.x - s,
          y: t.bl.y + o
        },
        br: {
          x: t.bl.x + o,
          y: t.bl.y + s
        },
        tr: {
          x: t.bl.x + s,
          y: t.bl.y - o
        }
      }, t.br.corner = {
        tr: {
          x: t.br.x + s,
          y: t.br.y - o
        },
        bl: {
          x: t.br.x - s,
          y: t.br.y + o
        },
        br: {
          x: t.br.x + o,
          y: t.br.y + s
        },
        tl: {
          x: t.br.x - o,
          y: t.br.y - s
        }
      }, t.ml.corner = {
        tl: {
          x: t.ml.x - o,
          y: t.ml.y - s
        },
        tr: {
          x: t.ml.x + s,
          y: t.ml.y - o
        },
        bl: {
          x: t.ml.x - s,
          y: t.ml.y + o
        },
        br: {
          x: t.ml.x + o,
          y: t.ml.y + s
        }
      }, t.mt.corner = {
        tl: {
          x: t.mt.x - o,
          y: t.mt.y - s
        },
        tr: {
          x: t.mt.x + s,
          y: t.mt.y - o
        },
        bl: {
          x: t.mt.x - s,
          y: t.mt.y + o
        },
        br: {
          x: t.mt.x + o,
          y: t.mt.y + s
        }
      }, t.mr.corner = {
        tl: {
          x: t.mr.x - o,
          y: t.mr.y - s
        },
        tr: {
          x: t.mr.x + s,
          y: t.mr.y - o
        },
        bl: {
          x: t.mr.x - s,
          y: t.mr.y + o
        },
        br: {
          x: t.mr.x + o,
          y: t.mr.y + s
        }
      }, t.mb.corner = {
        tl: {
          x: t.mb.x - o,
          y: t.mb.y - s
        },
        tr: {
          x: t.mb.x + s,
          y: t.mb.y - o
        },
        bl: {
          x: t.mb.x - s,
          y: t.mb.y + o
        },
        br: {
          x: t.mb.x + o,
          y: t.mb.y + s
        }
      }, t.mtr.corner = {
        tl: {
          x: t.mtr.x - o + u * this.rotatingPointOffset,
          y: t.mtr.y - s - a * this.rotatingPointOffset
        },
        tr: {
          x: t.mtr.x + s + u * this.rotatingPointOffset,
          y: t.mtr.y - o - a * this.rotatingPointOffset
        },
        bl: {
          x: t.mtr.x - s + u * this.rotatingPointOffset,
          y: t.mtr.y + o - a * this.rotatingPointOffset
        },
        br: {
          x: t.mtr.x + o + u * this.rotatingPointOffset,
          y: t.mtr.y + s - a * this.rotatingPointOffset
        }
      };
    },
    drawBorders: function (e) {
      if (!this.hasBorders)
        return this;
      var t = this.padding, n = t * 2, r = this.getViewportTransform();
      e.save(), e.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, e.strokeStyle = this.borderColor;
      var i = 1 / this._constrainScale(this.scaleX), s = 1 / this._constrainScale(this.scaleY);
      e.lineWidth = 1 / this.borderScaleFactor;
      var o = this.getWidth(), u = this.getHeight(), a = this.strokeWidth > 1 ? this.strokeWidth : 0, f = this.strokeLineCap === 'round' || this.strokeLineCap === 'square', l = this.type === 'line' && this.width === 1, c = this.type === 'line' && this.height === 1, h = f && c || this.type !== 'line', p = f && l || this.type !== 'line';
      l ? o = a / i : c && (u = a / s), h && (o += a / i), p && (u += a / s);
      var d = fabric.util.transformPoint(new fabric.Point(o, u), r, !0), v = d.x, m = d.y;
      this.group && (v *= this.group.scaleX, m *= this.group.scaleY), e.strokeRect(~~(-(v / 2) - t) - 0.5, ~~(-(m / 2) - t) - 0.5, ~~(v + n) + 1, ~~(m + n) + 1);
      if (this.hasRotatingPoint && this.isControlVisible('mtr') && !this.get('lockRotation') && this.hasControls) {
        var g = (-m - t * 2) / 2;
        e.beginPath(), e.moveTo(0, g), e.lineTo(0, g - this.rotatingPointOffset), e.closePath(), e.stroke();
      }
      return e.restore(), this;
    },
    drawControls: function (e) {
      if (!this.hasControls)
        return this;
      var t = this.cornerSize, n = t / 2, r = this.getViewportTransform(), i = this.strokeWidth > 1 ? this.strokeWidth : 0, s = this.width, o = this.height, u = this.strokeLineCap === 'round' || this.strokeLineCap === 'square', a = this.type === 'line' && this.width === 1, f = this.type === 'line' && this.height === 1, l = u && f || this.type !== 'line', c = u && a || this.type !== 'line';
      a ? s = i : f && (o = i), l && (s += i), c && (o += i), s *= this.scaleX, o *= this.scaleY;
      var h = fabric.util.transformPoint(new fabric.Point(s, o), r, !0), p = h.x, d = h.y, v = -(p / 2), m = -(d / 2), g = this.padding, y = n, b = n - t, w = this.transparentCorners ? 'strokeRect' : 'fillRect';
      return e.save(), e.lineWidth = 1, e.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, e.strokeStyle = e.fillStyle = this.cornerColor, this._drawControl('tl', e, w, v - y - g, m - y - g), this._drawControl('tr', e, w, v + p - y + g, m - y - g), this._drawControl('bl', e, w, v - y - g, m + d + b + g), this._drawControl('br', e, w, v + p + b + g, m + d + b + g), this.get('lockUniScaling') || (this._drawControl('mt', e, w, v + p / 2 - y, m - y - g), this._drawControl('mb', e, w, v + p / 2 - y, m + d + b + g), this._drawControl('mr', e, w, v + p + b + g, m + d / 2 - y), this._drawControl('ml', e, w, v - y - g, m + d / 2 - y)), this.hasRotatingPoint && this._drawControl('mtr', e, w, v + p / 2 - y, m - this.rotatingPointOffset - this.cornerSize / 2 - g), e.restore(), this;
    },
    _drawControl: function (e, n, r, i, s) {
      var o = this.cornerSize;
      this.isControlVisible(e) && (t() || this.transparentCorners || n.clearRect(i, s, o, o), n[r](i, s, o, o));
    },
    isControlVisible: function (e) {
      return this._getControlsVisibility()[e];
    },
    setControlVisible: function (e, t) {
      return this._getControlsVisibility()[e] = t, this;
    },
    setControlsVisibility: function (e) {
      e || (e = {});
      for (var t in e)
        this.setControlVisible(t, e[t]);
      return this;
    },
    _getControlsVisibility: function () {
      return this._controlsVisibility || (this._controlsVisibility = {
        tl: !0,
        tr: !0,
        br: !0,
        bl: !0,
        ml: !0,
        mt: !0,
        mr: !0,
        mb: !0,
        mtr: !0
      }), this._controlsVisibility;
    }
  });
}(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  FX_DURATION: 500,
  fxCenterObjectH: function (e, t) {
    t = t || {};
    var n = function () {
      }, r = t.onComplete || n, i = t.onChange || n, s = this;
    return fabric.util.animate({
      startValue: e.get('left'),
      endValue: this.getCenter().left,
      duration: this.FX_DURATION,
      onChange: function (t) {
        e.set('left', t), s.renderAll(), i();
      },
      onComplete: function () {
        e.setCoords(), r();
      }
    }), this;
  },
  fxCenterObjectV: function (e, t) {
    t = t || {};
    var n = function () {
      }, r = t.onComplete || n, i = t.onChange || n, s = this;
    return fabric.util.animate({
      startValue: e.get('top'),
      endValue: this.getCenter().top,
      duration: this.FX_DURATION,
      onChange: function (t) {
        e.set('top', t), s.renderAll(), i();
      },
      onComplete: function () {
        e.setCoords(), r();
      }
    }), this;
  },
  fxRemove: function (e, t) {
    t = t || {};
    var n = function () {
      }, r = t.onComplete || n, i = t.onChange || n, s = this;
    return fabric.util.animate({
      startValue: e.get('opacity'),
      endValue: 0,
      duration: this.FX_DURATION,
      onStart: function () {
        e.set('active', !1);
      },
      onChange: function (t) {
        e.set('opacity', t), s.renderAll(), i();
      },
      onComplete: function () {
        s.remove(e), r();
      }
    }), this;
  }
}), fabric.util.object.extend(fabric.Object.prototype, {
  animate: function () {
    if (arguments[0] && typeof arguments[0] == 'object') {
      var e = [], t, n;
      for (t in arguments[0])
        e.push(t);
      for (var r = 0, i = e.length; r < i; r++)
        t = e[r], n = r !== i - 1, this._animate(t, arguments[0][t], arguments[1], n);
    } else
      this._animate.apply(this, arguments);
    return this;
  },
  _animate: function (e, t, n, r) {
    var i = this, s;
    t = t.toString(), n ? n = fabric.util.object.clone(n) : n = {}, ~e.indexOf('.') && (s = e.split('.'));
    var o = s ? this.get(s[0])[s[1]] : this.get(e);
    'from' in n || (n.from = o), ~t.indexOf('=') ? t = o + parseFloat(t.replace('=', '')) : t = parseFloat(t), fabric.util.animate({
      startValue: n.from,
      endValue: t,
      byValue: n.by,
      easing: n.easing,
      duration: n.duration,
      abort: n.abort && function () {
        return n.abort.call(i);
      },
      onChange: function (t) {
        s ? i[s[0]][s[1]] = t : i.set(e, t);
        if (r)
          return;
        n.onChange && n.onChange();
      },
      onComplete: function () {
        if (r)
          return;
        i.setCoords(), n.onComplete && n.onComplete();
      }
    });
  }
}), function (e) {
  'use strict';
  function s(e, t) {
    var n = e.origin, r = e.axis1, i = e.axis2, s = e.dimension, o = t.nearest, u = t.center, a = t.farthest;
    return function () {
      switch (this.get(n)) {
      case o:
        return Math.min(this.get(r), this.get(i));
      case u:
        return Math.min(this.get(r), this.get(i)) + 0.5 * this.get(s);
      case a:
        return Math.max(this.get(r), this.get(i));
      }
    };
  }
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = {
      x1: 1,
      x2: 1,
      y1: 1,
      y2: 1
    }, i = t.StaticCanvas.supports('setLineDash');
  if (t.Line) {
    t.warn('fabric.Line is already defined');
    return;
  }
  t.Line = t.util.createClass(t.Object, {
    type: 'line',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    initialize: function (e, t) {
      t = t || {}, e || (e = [
        0,
        0,
        0,
        0
      ]), this.callSuper('initialize', t), this.set('x1', e[0]), this.set('y1', e[1]), this.set('x2', e[2]), this.set('y2', e[3]), this._setWidthHeight(t);
    },
    _setWidthHeight: function (e) {
      e || (e = {}), this.width = Math.abs(this.x2 - this.x1) || 1, this.height = Math.abs(this.y2 - this.y1) || 1, this.left = 'left' in e ? e.left : this._getLeftToOriginX(), this.top = 'top' in e ? e.top : this._getTopToOriginY();
    },
    _set: function (e, t) {
      return this[e] = t, typeof r[e] != 'undefined' && this._setWidthHeight(), this;
    },
    _getLeftToOriginX: s({
      origin: 'originX',
      axis1: 'x1',
      axis2: 'x2',
      dimension: 'width'
    }, {
      nearest: 'left',
      center: 'center',
      farthest: 'right'
    }),
    _getTopToOriginY: s({
      origin: 'originY',
      axis1: 'y1',
      axis2: 'y2',
      dimension: 'height'
    }, {
      nearest: 'top',
      center: 'center',
      farthest: 'bottom'
    }),
    _render: function (e, t) {
      e.beginPath();
      if (t) {
        var n = this.getCenterPoint();
        e.translate(n.x, n.y);
      }
      if (!this.strokeDashArray || this.strokeDashArray && i) {
        var r = this.x1 <= this.x2 ? -1 : 1, s = this.y1 <= this.y2 ? -1 : 1;
        e.moveTo(this.width === 1 ? 0 : r * this.width / 2, this.height === 1 ? 0 : s * this.height / 2), e.lineTo(this.width === 1 ? 0 : r * -1 * this.width / 2, this.height === 1 ? 0 : s * -1 * this.height / 2);
      }
      e.lineWidth = this.strokeWidth;
      var o = e.strokeStyle;
      e.strokeStyle = this.stroke || e.fillStyle, this.stroke && this._renderStroke(e), e.strokeStyle = o;
    },
    _renderDashedStroke: function (e) {
      var n = this.x1 <= this.x2 ? -1 : 1, r = this.y1 <= this.y2 ? -1 : 1, i = this.width === 1 ? 0 : n * this.width / 2, s = this.height === 1 ? 0 : r * this.height / 2;
      e.beginPath(), t.util.drawDashedLine(e, i, s, -i, -s, this.strokeDashArray), e.closePath();
    },
    toObject: function (e) {
      return n(this.callSuper('toObject', e), {
        x1: this.get('x1'),
        y1: this.get('y1'),
        x2: this.get('x2'),
        y2: this.get('y2')
      });
    },
    toSVG: function (e) {
      var t = this._createBaseSVGMarkup(), n = '';
      if (!this.group) {
        var r = -this.width / 2 - (this.x1 > this.x2 ? this.x2 : this.x1), i = -this.height / 2 - (this.y1 > this.y2 ? this.y2 : this.y1);
        n = 'translate(' + r + ', ' + i + ') ';
      }
      return t.push('<line ', 'x1="', this.x1, '" y1="', this.y1, '" x2="', this.x2, '" y2="', this.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), n, this.getSvgTransformMatrix(), '"/>\n'), e ? e(t.join('')) : t.join('');
    },
    complexity: function () {
      return 1;
    }
  }), t.Line.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat('x1 y1 x2 y2'.split(' ')), t.Line.fromElement = function (e, r) {
    var i = t.parseAttributes(e, t.Line.ATTRIBUTE_NAMES), s = [
        i.x1 || 0,
        i.y1 || 0,
        i.x2 || 0,
        i.y2 || 0
      ];
    return new t.Line(s, n(i, r));
  }, t.Line.fromObject = function (e) {
    var n = [
        e.x1,
        e.y1,
        e.x2,
        e.y2
      ];
    return new t.Line(n, e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  function i(e) {
    return 'radius' in e && e.radius > 0;
  }
  var t = e.fabric || (e.fabric = {}), n = Math.PI * 2, r = t.util.object.extend;
  if (t.Circle) {
    t.warn('fabric.Circle is already defined.');
    return;
  }
  t.Circle = t.util.createClass(t.Object, {
    type: 'circle',
    radius: 0,
    initialize: function (e) {
      e = e || {}, this.callSuper('initialize', e), this.set('radius', e.radius || 0);
    },
    _set: function (e, t) {
      return this.callSuper('_set', e, t), e === 'radius' && this.setRadius(t), this;
    },
    toObject: function (e) {
      return r(this.callSuper('toObject', e), { radius: this.get('radius') });
    },
    toSVG: function (e) {
      var t = this._createBaseSVGMarkup(), n = 0, r = 0;
      return this.group && (n = this.left + this.radius, r = this.top + this.radius), t.push('<circle ', 'cx="' + n + '" cy="' + r + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), ' ', this.getSvgTransformMatrix(), '"/>\n'), e ? e(t.join('')) : t.join('');
    },
    _render: function (e, t) {
      e.beginPath(), e.arc(t ? this.left + this.radius : 0, t ? this.top + this.radius : 0, this.radius, 0, n, !1), this._renderFill(e), this._renderStroke(e);
    },
    getRadiusX: function () {
      return this.get('radius') * this.get('scaleX');
    },
    getRadiusY: function () {
      return this.get('radius') * this.get('scaleY');
    },
    setRadius: function (e) {
      this.radius = e, this.set('width', e * 2).set('height', e * 2);
    },
    complexity: function () {
      return 1;
    }
  }), t.Circle.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat('cx cy r'.split(' ')), t.Circle.fromElement = function (e, n) {
    n || (n = {});
    var s = t.parseAttributes(e, t.Circle.ATTRIBUTE_NAMES);
    if (!i(s))
      throw new Error('value of `r` attribute is required and can not be negative');
    s.left = s.left || 0, s.top = s.top || 0;
    var o = new t.Circle(r(s, n));
    return o.left -= o.radius, o.top -= o.radius, o;
  }, t.Circle.fromObject = function (e) {
    return new t.Circle(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {});
  if (t.Triangle) {
    t.warn('fabric.Triangle is already defined');
    return;
  }
  t.Triangle = t.util.createClass(t.Object, {
    type: 'triangle',
    initialize: function (e) {
      e = e || {}, this.callSuper('initialize', e), this.set('width', e.width || 100).set('height', e.height || 100);
    },
    _render: function (e) {
      var t = this.width / 2, n = this.height / 2;
      e.beginPath(), e.moveTo(-t, n), e.lineTo(0, -n), e.lineTo(t, n), e.closePath(), this._renderFill(e), this._renderStroke(e);
    },
    _renderDashedStroke: function (e) {
      var n = this.width / 2, r = this.height / 2;
      e.beginPath(), t.util.drawDashedLine(e, -n, r, 0, -r, this.strokeDashArray), t.util.drawDashedLine(e, 0, -r, n, r, this.strokeDashArray), t.util.drawDashedLine(e, n, r, -n, r, this.strokeDashArray), e.closePath();
    },
    toSVG: function (e) {
      var t = this._createBaseSVGMarkup(), n = this.width / 2, r = this.height / 2, i = [
          -n + ' ' + r,
          '0 ' + -r,
          n + ' ' + r
        ].join(',');
      return t.push('<polygon ', 'points="', i, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>'), e ? e(t.join('')) : t.join('');
    },
    complexity: function () {
      return 1;
    }
  }), t.Triangle.fromObject = function (e) {
    return new t.Triangle(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = Math.PI * 2, r = t.util.object.extend;
  if (t.Ellipse) {
    t.warn('fabric.Ellipse is already defined.');
    return;
  }
  t.Ellipse = t.util.createClass(t.Object, {
    type: 'ellipse',
    rx: 0,
    ry: 0,
    initialize: function (e) {
      e = e || {}, this.callSuper('initialize', e), this.set('rx', e.rx || 0), this.set('ry', e.ry || 0), this.set('width', this.get('rx') * 2), this.set('height', this.get('ry') * 2);
    },
    toObject: function (e) {
      return r(this.callSuper('toObject', e), {
        rx: this.get('rx'),
        ry: this.get('ry')
      });
    },
    toSVG: function (e) {
      var t = this._createBaseSVGMarkup(), n = 0, r = 0;
      return this.group && (n = this.left + this.rx, r = this.top + this.ry), t.push('<ellipse ', 'cx="', n, '" cy="', r, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), e ? e(t.join('')) : t.join('');
    },
    _render: function (e, t) {
      e.beginPath(), e.save(), e.transform(1, 0, 0, this.ry / this.rx, 0, 0), e.arc(t ? this.left + this.rx : 0, t ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, n, !1), e.restore(), this._renderFill(e), this._renderStroke(e);
    },
    complexity: function () {
      return 1;
    }
  }), t.Ellipse.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat('cx cy rx ry'.split(' ')), t.Ellipse.fromElement = function (e, n) {
    n || (n = {});
    var i = t.parseAttributes(e, t.Ellipse.ATTRIBUTE_NAMES);
    i.left = i.left || 0, i.top = i.top || 0;
    var s = new t.Ellipse(r(i, n));
    return s.top -= s.ry, s.left -= s.rx, s;
  }, t.Ellipse.fromObject = function (e) {
    return new t.Ellipse(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  if (t.Rect) {
    console.warn('fabric.Rect is already defined');
    return;
  }
  var r = t.Object.prototype.stateProperties.concat();
  r.push('rx', 'ry', 'x', 'y'), t.Rect = t.util.createClass(t.Object, {
    stateProperties: r,
    type: 'rect',
    rx: 0,
    ry: 0,
    strokeDashArray: null,
    initialize: function (e) {
      e = e || {}, this.callSuper('initialize', e), this._initRxRy();
    },
    _initRxRy: function () {
      this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry);
    },
    _render: function (e, t) {
      if (this.width === 1 && this.height === 1) {
        e.fillRect(0, 0, 1, 1);
        return;
      }
      var n = this.rx ? Math.min(this.rx, this.width / 2) : 0, r = this.ry ? Math.min(this.ry, this.height / 2) : 0, i = this.width, s = this.height, o = t ? this.left : 0, u = t ? this.top : 0, a = n !== 0 || r !== 0, f = 0.4477152502;
      e.beginPath(), t || e.translate(-this.width / 2, -this.height / 2), e.moveTo(o + n, u), e.lineTo(o + i - n, u), a && e.bezierCurveTo(o + i - f * n, u, o + i, u + f * r, o + i, u + r), e.lineTo(o + i, u + s - r), a && e.bezierCurveTo(o + i, u + s - f * r, o + i - f * n, u + s, o + i - n, u + s), e.lineTo(o + n, u + s), a && e.bezierCurveTo(o + f * n, u + s, o, u + s - f * r, o, u + s - r), e.lineTo(o, u + r), a && e.bezierCurveTo(o, u + f * r, o + f * n, u, o + n, u), e.closePath(), this._renderFill(e), this._renderStroke(e);
    },
    _renderDashedStroke: function (e) {
      var n = -this.width / 2, r = -this.height / 2, i = this.width, s = this.height;
      e.beginPath(), t.util.drawDashedLine(e, n, r, n + i, r, this.strokeDashArray), t.util.drawDashedLine(e, n + i, r, n + i, r + s, this.strokeDashArray), t.util.drawDashedLine(e, n + i, r + s, n, r + s, this.strokeDashArray), t.util.drawDashedLine(e, n, r + s, n, r, this.strokeDashArray), e.closePath();
    },
    toObject: function (e) {
      var t = n(this.callSuper('toObject', e), {
          rx: this.get('rx') || 0,
          ry: this.get('ry') || 0
        });
      return this.includeDefaultValues || this._removeDefaultValues(t), t;
    },
    toSVG: function (e) {
      var t = this._createBaseSVGMarkup(), n = this.left, r = this.top;
      return this.group || (n = -this.width / 2, r = -this.height / 2), t.push('<rect ', 'x="', n, '" y="', r, '" rx="', this.get('rx'), '" ry="', this.get('ry'), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), e ? e(t.join('')) : t.join('');
    },
    complexity: function () {
      return 1;
    }
  }), t.Rect.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat('x y rx ry width height'.split(' ')), t.Rect.fromElement = function (e, r) {
    if (!e)
      return null;
    r = r || {};
    var i = t.parseAttributes(e, t.Rect.ATTRIBUTE_NAMES);
    return i.left = i.left || 0, i.top = i.top || 0, new t.Rect(n(r ? t.util.object.clone(r) : {}, i));
  }, t.Rect.fromObject = function (e) {
    return new t.Rect(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.toFixed;
  if (t.Polyline) {
    t.warn('fabric.Polyline is already defined');
    return;
  }
  t.Polyline = t.util.createClass(t.Object, {
    type: 'polyline',
    points: null,
    initialize: function (e, t, n) {
      t = t || {}, this.set('points', e), this.callSuper('initialize', t), this._calcDimensions(n);
    },
    _calcDimensions: function (e) {
      return t.Polygon.prototype._calcDimensions.call(this, e);
    },
    toObject: function (e) {
      return t.Polygon.prototype.toObject.call(this, e);
    },
    toSVG: function (e) {
      var t = [], r = this._createBaseSVGMarkup();
      for (var i = 0, s = this.points.length; i < s; i++)
        t.push(n(this.points[i].x, 2), ',', n(this.points[i].y, 2), ' ');
      return r.push('<polyline ', 'points="', t.join(''), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), ' ', this.getSvgTransformMatrix(), '"/>\n'), e ? e(r.join('')) : r.join('');
    },
    _render: function (e) {
      var t;
      e.beginPath(), e.moveTo(this.points[0].x, this.points[0].y);
      for (var n = 0, r = this.points.length; n < r; n++)
        t = this.points[n], e.lineTo(t.x, t.y);
      this._renderFill(e), this._renderStroke(e);
    },
    _renderDashedStroke: function (e) {
      var n, r;
      e.beginPath();
      for (var i = 0, s = this.points.length; i < s; i++)
        n = this.points[i], r = this.points[i + 1] || n, t.util.drawDashedLine(e, n.x, n.y, r.x, r.y, this.strokeDashArray);
    },
    complexity: function () {
      return this.get('points').length;
    }
  }), t.Polyline.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat(), t.Polyline.fromElement = function (e, n) {
    if (!e)
      return null;
    n || (n = {});
    var r = t.parsePointsAttribute(e.getAttribute('points')), i = t.parseAttributes(e, t.Polyline.ATTRIBUTE_NAMES);
    return r === null ? null : new t.Polyline(r, t.util.object.extend(i, n), !0);
  }, t.Polyline.fromObject = function (e) {
    var n = e.points;
    return new t.Polyline(n, e, !0);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = t.util.array.min, i = t.util.array.max, s = t.util.toFixed;
  if (t.Polygon) {
    t.warn('fabric.Polygon is already defined');
    return;
  }
  t.Polygon = t.util.createClass(t.Object, {
    type: 'polygon',
    points: null,
    initialize: function (e, t, n) {
      t = t || {}, this.points = e, this.callSuper('initialize', t), this._calcDimensions(n);
    },
    _calcDimensions: function (e) {
      var t = this.points, n = r(t, 'x'), s = r(t, 'y'), o = i(t, 'x'), u = i(t, 'y');
      this.width = o - n || 1, this.height = u - s || 1, this.minX = n, this.minY = s;
      if (e)
        return;
      var a = this.width / 2 + this.minX, f = this.height / 2 + this.minY;
      this.points.forEach(function (e) {
        e.x -= a, e.y -= f;
      }, this);
    },
    toObject: function (e) {
      return n(this.callSuper('toObject', e), { points: this.points.concat() });
    },
    toSVG: function (e) {
      var t = [], n = this._createBaseSVGMarkup();
      for (var r = 0, i = this.points.length; r < i; r++)
        t.push(s(this.points[r].x, 2), ',', s(this.points[r].y, 2), ' ');
      return n.push('<polygon ', 'points="', t.join(''), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), ' ', this.getSvgTransformMatrix(), '"/>\n'), e ? e(n.join('')) : n.join('');
    },
    _render: function (e) {
      var t;
      e.beginPath(), e.moveTo(this.points[0].x, this.points[0].y);
      for (var n = 0, r = this.points.length; n < r; n++)
        t = this.points[n], e.lineTo(t.x, t.y);
      this._renderFill(e);
      if (this.stroke || this.strokeDashArray)
        e.closePath(), this._renderStroke(e);
    },
    _renderDashedStroke: function (e) {
      var n, r;
      e.beginPath();
      for (var i = 0, s = this.points.length; i < s; i++)
        n = this.points[i], r = this.points[i + 1] || this.points[0], t.util.drawDashedLine(e, n.x, n.y, r.x, r.y, this.strokeDashArray);
      e.closePath();
    },
    complexity: function () {
      return this.points.length;
    }
  }), t.Polygon.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat(), t.Polygon.fromElement = function (e, r) {
    if (!e)
      return null;
    r || (r = {});
    var i = t.parsePointsAttribute(e.getAttribute('points')), s = t.parseAttributes(e, t.Polygon.ATTRIBUTE_NAMES);
    return i === null ? null : new t.Polygon(i, n(s, r), !0);
  }, t.Polygon.fromObject = function (e) {
    return new t.Polygon(e.points, e, !0);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  function f(e) {
    return e[0] === 'H' ? e[1] : e[e.length - 2];
  }
  function l(e) {
    return e[0] === 'V' ? e[1] : e[e.length - 1];
  }
  var t = e.fabric || (e.fabric = {}), n = t.util.array.min, r = t.util.array.max, i = t.util.object.extend, s = Object.prototype.toString, o = t.util.drawArc, u = {
      m: 2,
      l: 2,
      h: 1,
      v: 1,
      c: 6,
      s: 4,
      q: 4,
      t: 2,
      a: 7
    }, a = {
      m: 'l',
      M: 'L'
    };
  if (t.Path) {
    t.warn('fabric.Path is already defined');
    return;
  }
  t.Path = t.util.createClass(t.Object, {
    type: 'path',
    path: null,
    initialize: function (e, t) {
      t = t || {}, this.setOptions(t);
      if (!e)
        throw new Error('`path` argument is required');
      var n = s.call(e) === '[object Array]';
      this.path = n ? e : e.match && e.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
      if (!this.path)
        return;
      n || (this.path = this._parsePath()), this._initializePath(t), t.sourcePath && this.setSourcePath(t.sourcePath);
    },
    _initializePath: function (e) {
      var t = 'width' in e && e.width != null, n = 'height' in e && e.width != null, r = 'left' in e, s = 'top' in e, o = r ? this.left : 0, u = s ? this.top : 0;
      !t || !n ? (i(this, this._parseDimensions()), t && (this.width = e.width), n && (this.height = e.height)) : (s || (this.top = this.height / 2), r || (this.left = this.width / 2)), this.pathOffset = this.pathOffset || this._calculatePathOffset(o, u);
    },
    _calculatePathOffset: function (e, t) {
      return {
        x: this.left - e - this.width / 2,
        y: this.top - t - this.height / 2
      };
    },
    _render: function (e, t) {
      var n, r = null, i = 0, s = 0, u = 0, a = 0, f = 0, l = 0, c, h, p, d, v = -(this.width / 2 + this.pathOffset.x), m = -(this.height / 2 + this.pathOffset.y);
      t && (v += this.width / 2, m += this.height / 2);
      for (var g = 0, y = this.path.length; g < y; ++g) {
        n = this.path[g];
        switch (n[0]) {
        case 'l':
          u += n[1], a += n[2], e.lineTo(u + v, a + m);
          break;
        case 'L':
          u = n[1], a = n[2], e.lineTo(u + v, a + m);
          break;
        case 'h':
          u += n[1], e.lineTo(u + v, a + m);
          break;
        case 'H':
          u = n[1], e.lineTo(u + v, a + m);
          break;
        case 'v':
          a += n[1], e.lineTo(u + v, a + m);
          break;
        case 'V':
          a = n[1], e.lineTo(u + v, a + m);
          break;
        case 'm':
          u += n[1], a += n[2], i = u, s = a, e.moveTo(u + v, a + m);
          break;
        case 'M':
          u = n[1], a = n[2], i = u, s = a, e.moveTo(u + v, a + m);
          break;
        case 'c':
          c = u + n[5], h = a + n[6], f = u + n[3], l = a + n[4], e.bezierCurveTo(u + n[1] + v, a + n[2] + m, f + v, l + m, c + v, h + m), u = c, a = h;
          break;
        case 'C':
          u = n[5], a = n[6], f = n[3], l = n[4], e.bezierCurveTo(n[1] + v, n[2] + m, f + v, l + m, u + v, a + m);
          break;
        case 's':
          c = u + n[3], h = a + n[4], f = f ? 2 * u - f : u, l = l ? 2 * a - l : a, e.bezierCurveTo(f + v, l + m, u + n[1] + v, a + n[2] + m, c + v, h + m), f = u + n[1], l = a + n[2], u = c, a = h;
          break;
        case 'S':
          c = n[3], h = n[4], f = 2 * u - f, l = 2 * a - l, e.bezierCurveTo(f + v, l + m, n[1] + v, n[2] + m, c + v, h + m), u = c, a = h, f = n[1], l = n[2];
          break;
        case 'q':
          c = u + n[3], h = a + n[4], f = u + n[1], l = a + n[2], e.quadraticCurveTo(f + v, l + m, c + v, h + m), u = c, a = h;
          break;
        case 'Q':
          c = n[3], h = n[4], e.quadraticCurveTo(n[1] + v, n[2] + m, c + v, h + m), u = c, a = h, f = n[1], l = n[2];
          break;
        case 't':
          c = u + n[1], h = a + n[2], r[0].match(/[QqTt]/) === null ? (f = u, l = a) : r[0] === 't' ? (f = 2 * u - p, l = 2 * a - d) : r[0] === 'q' && (f = 2 * u - f, l = 2 * a - l), p = f, d = l, e.quadraticCurveTo(f + v, l + m, c + v, h + m), u = c, a = h, f = u + n[1], l = a + n[2];
          break;
        case 'T':
          c = n[1], h = n[2], f = 2 * u - f, l = 2 * a - l, e.quadraticCurveTo(f + v, l + m, c + v, h + m), u = c, a = h;
          break;
        case 'a':
          o(e, u + v, a + m, [
            n[1],
            n[2],
            n[3],
            n[4],
            n[5],
            n[6] + u + v,
            n[7] + a + m
          ]), u += n[6], a += n[7];
          break;
        case 'A':
          o(e, u + v, a + m, [
            n[1],
            n[2],
            n[3],
            n[4],
            n[5],
            n[6] + v,
            n[7] + m
          ]), u = n[6], a = n[7];
          break;
        case 'z':
        case 'Z':
          u = i, a = s, e.closePath();
        }
        r = n;
      }
    },
    render: function (e, n) {
      if (!this.visible)
        return;
      e.save(), n && e.translate(-this.width / 2, -this.height / 2);
      var r = this.transformMatrix;
      r && e.transform(r[0], r[1], r[2], r[3], r[4], r[5]), n || this.transform(e), this._setStrokeStyles(e), this._setFillStyles(e), this._setShadow(e), this.clipTo && t.util.clipContext(this, e), e.beginPath(), e.globalAlpha = this.group ? e.globalAlpha * this.opacity : this.opacity, this._render(e, n), this._renderFill(e), this._renderStroke(e), this.clipTo && e.restore(), this._removeShadow(e), e.restore();
    },
    toString: function () {
      return '#<fabric.Path (' + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + ' }>';
    },
    toObject: function (e) {
      var t = i(this.callSuper('toObject', e), {
          path: this.path.map(function (e) {
            return e.slice();
          }),
          pathOffset: this.pathOffset
        });
      return this.sourcePath && (t.sourcePath = this.sourcePath), this.transformMatrix && (t.transformMatrix = this.transformMatrix), t;
    },
    toDatalessObject: function (e) {
      var t = this.toObject(e);
      return this.sourcePath && (t.path = this.sourcePath), delete t.sourcePath, t;
    },
    toSVG: function (e) {
      var t = [], n = this._createBaseSVGMarkup();
      for (var r = 0, i = this.path.length; r < i; r++)
        t.push(this.path[r].join(' '));
      var s = t.join(' ');
      return n.push('<path ', 'd="', s, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" stroke-linecap="round" ', '/>\n'), e ? e(n.join('')) : n.join('');
    },
    complexity: function () {
      return this.path.length;
    },
    _parsePath: function () {
      var e = [], t = [], n, r, i = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, s, o;
      for (var f = 0, l, c = this.path.length; f < c; f++) {
        n = this.path[f], o = n.slice(1).trim(), t.length = 0;
        while (s = i.exec(o))
          t.push(s[0]);
        l = [n.charAt(0)];
        for (var h = 0, p = t.length; h < p; h++)
          r = parseFloat(t[h]), isNaN(r) || l.push(r);
        var d = l[0], v = u[d.toLowerCase()], m = a[d] || d;
        if (l.length - 1 > v)
          for (var g = 1, y = l.length; g < y; g += v)
            e.push([d].concat(l.slice(g, g + v))), d = m;
        else
          e.push(l);
      }
      return e;
    },
    _parseDimensions: function () {
      var e = [], t = [], i = {};
      this.path.forEach(function (n, r) {
        this._getCoordsFromCommand(n, r, e, t, i);
      }, this);
      var s = n(e), o = n(t), u = r(e), a = r(t), f = u - s, l = a - o, c = {
          left: this.left + (s + f / 2),
          top: this.top + (o + l / 2),
          width: f,
          height: l
        };
      return c;
    },
    _getCoordsFromCommand: function (e, t, n, r, i) {
      var s = !1;
      e[0] !== 'H' && (i.x = t === 0 ? f(e) : f(this.path[t - 1])), e[0] !== 'V' && (i.y = t === 0 ? l(e) : l(this.path[t - 1])), e[0] === e[0].toLowerCase() && (s = !0);
      var o = this._getXY(e, s, i), u;
      u = parseInt(o.x, 10), isNaN(u) || n.push(u), u = parseInt(o.y, 10), isNaN(u) || r.push(u);
    },
    _getXY: function (e, t, n) {
      var r = t ? n.x + f(e) : e[0] === 'V' ? n.x : f(e), i = t ? n.y + l(e) : e[0] === 'H' ? n.y : l(e);
      return {
        x: r,
        y: i
      };
    }
  }), t.Path.fromObject = function (e, n) {
    typeof e.path == 'string' ? t.loadSVGFromURL(e.path, function (r) {
      var i = r[0], s = e.path;
      delete e.path, t.util.object.extend(i, e), i.setSourcePath(s), n(i);
    }) : n(new t.Path(e.path, e));
  }, t.Path.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat(['d']), t.Path.fromElement = function (e, n, r) {
    var s = t.parseAttributes(e, t.Path.ATTRIBUTE_NAMES);
    n && n(new t.Path(s.d, i(s, r)));
  }, t.Path.async = !0;
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = t.util.array.invoke, i = t.Object.prototype.toObject;
  if (t.PathGroup) {
    t.warn('fabric.PathGroup is already defined');
    return;
  }
  t.PathGroup = t.util.createClass(t.Path, {
    type: 'path-group',
    fill: '',
    initialize: function (e, t) {
      t = t || {}, this.paths = e || [];
      for (var n = this.paths.length; n--;)
        this.paths[n].group = this;
      this.setOptions(t), t.widthAttr && (this.scaleX = t.widthAttr / t.width), t.heightAttr && (this.scaleY = t.heightAttr / t.height), this.setCoords(), t.sourcePath && this.setSourcePath(t.sourcePath);
    },
    render: function (e) {
      if (!this.visible)
        return;
      e.save();
      var n = this.transformMatrix;
      n && e.transform(n[0], n[1], n[2], n[3], n[4], n[5]), this.transform(e), this._setShadow(e), this.clipTo && t.util.clipContext(this, e);
      for (var r = 0, i = this.paths.length; r < i; ++r)
        this.paths[r].render(e, !0);
      this.clipTo && e.restore(), this._removeShadow(e), e.restore();
    },
    _set: function (e, t) {
      if (e === 'fill' && t && this.isSameColor()) {
        var n = this.paths.length;
        while (n--)
          this.paths[n]._set(e, t);
      }
      return this.callSuper('_set', e, t);
    },
    toObject: function (e) {
      var t = n(i.call(this, e), { paths: r(this.getObjects(), 'toObject', e) });
      return this.sourcePath && (t.sourcePath = this.sourcePath), t;
    },
    toDatalessObject: function (e) {
      var t = this.toObject(e);
      return this.sourcePath && (t.paths = this.sourcePath), t;
    },
    toSVG: function (e) {
      var t = this.getObjects(), n = 'translate(' + this.left + ' ' + this.top + ')', r = [
          '<g ',
          'style="',
          this.getSvgStyles(),
          '" ',
          'transform="',
          n,
          this.getSvgTransform(),
          '" ',
          '>\n'
        ];
      for (var i = 0, s = t.length; i < s; i++)
        r.push(t[i].toSVG(e));
      return r.push('</g>\n'), e ? e(r.join('')) : r.join('');
    },
    toString: function () {
      return '#<fabric.PathGroup (' + this.complexity() + '): { top: ' + this.top + ', left: ' + this.left + ' }>';
    },
    isSameColor: function () {
      var e = (this.getObjects()[0].get('fill') || '').toLowerCase();
      return this.getObjects().every(function (t) {
        return (t.get('fill') || '').toLowerCase() === e;
      });
    },
    complexity: function () {
      return this.paths.reduce(function (e, t) {
        return e + (t && t.complexity ? t.complexity() : 0);
      }, 0);
    },
    getObjects: function () {
      return this.paths;
    }
  }), t.PathGroup.fromObject = function (e, n) {
    typeof e.paths == 'string' ? t.loadSVGFromURL(e.paths, function (r) {
      var i = e.paths;
      delete e.paths;
      var s = t.util.groupSVGElements(r, e, i);
      n(s);
    }) : t.util.enlivenObjects(e.paths, function (r) {
      delete e.paths, n(new t.PathGroup(r, e));
    });
  }, t.PathGroup.async = !0;
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = t.util.array.min, i = t.util.array.max, s = t.util.array.invoke;
  if (t.Group)
    return;
  var o = {
      lockMovementX: !0,
      lockMovementY: !0,
      lockRotation: !0,
      lockScalingX: !0,
      lockScalingY: !0,
      lockUniScaling: !0
    };
  t.Group = t.util.createClass(t.Object, t.Collection, {
    type: 'group',
    initialize: function (e, t) {
      t = t || {}, this._objects = e || [];
      for (var r = this._objects.length; r--;)
        this._objects[r].group = this;
      this.originalState = {}, this.callSuper('initialize'), this._calcBounds(), this._updateObjectsCoords(), t && n(this, t), this._setOpacityIfSame(), this.setCoords(), this.saveCoords();
    },
    _updateObjectsCoords: function () {
      this.forEachObject(this._updateObjectCoords, this);
    },
    _updateObjectCoords: function (e) {
      var t = e.getLeft(), n = e.getTop();
      e.set({
        originalLeft: t,
        originalTop: n,
        left: t - this.left,
        top: n - this.top
      }), e.setCoords(), e.__origHasControls = e.hasControls, e.hasControls = !1;
    },
    toString: function () {
      return '#<fabric.Group: (' + this.complexity() + ')>';
    },
    addWithUpdate: function (e) {
      return this._restoreObjectsState(), e && (this._objects.push(e), e.group = this), this.forEachObject(this._setObjectActive, this), this._calcBounds(), this._updateObjectsCoords(), this;
    },
    _setObjectActive: function (e) {
      e.set('active', !0), e.group = this;
    },
    removeWithUpdate: function (e) {
      return this._moveFlippedObject(e), this._restoreObjectsState(), this.forEachObject(this._setObjectActive, this), this.remove(e), this._calcBounds(), this._updateObjectsCoords(), this;
    },
    _onObjectAdded: function (e) {
      e.group = this;
    },
    _onObjectRemoved: function (e) {
      delete e.group, e.set('active', !1);
    },
    delegatedProperties: {
      fill: !0,
      opacity: !0,
      fontFamily: !0,
      fontWeight: !0,
      fontSize: !0,
      fontStyle: !0,
      lineHeight: !0,
      textDecoration: !0,
      textAlign: !0,
      backgroundColor: !0
    },
    _set: function (e, t) {
      if (e in this.delegatedProperties) {
        var n = this._objects.length;
        this[e] = t;
        while (n--)
          this._objects[n].set(e, t);
      } else
        this[e] = t;
    },
    toObject: function (e) {
      return n(this.callSuper('toObject', e), { objects: s(this._objects, 'toObject', e) });
    },
    render: function (e) {
      if (!this.visible)
        return;
      e.save(), this.clipTo && t.util.clipContext(this, e);
      for (var n = 0, r = this._objects.length; n < r; n++)
        this._renderObject(this._objects[n], e);
      this.clipTo && e.restore(), e.restore();
    },
    _renderControls: function (e, t) {
      this.callSuper('_renderControls', e, t);
      for (var n = 0, r = this._objects.length; n < r; n++)
        this._objects[n]._renderControls(e);
    },
    _renderObject: function (e, t) {
      var n = e.hasRotatingPoint;
      if (!e.visible)
        return;
      e.hasRotatingPoint = !1, e.render(t), e.hasRotatingPoint = n;
    },
    _restoreObjectsState: function () {
      return this._objects.forEach(this._restoreObjectState, this), this;
    },
    _moveFlippedObject: function (e) {
      var t = e.get('originX'), n = e.get('originY'), r = e.getCenterPoint();
      e.set({
        originX: 'center',
        originY: 'center',
        left: r.x,
        top: r.y
      }), this._toggleFlipping(e);
      var i = e.getPointByOrigin(t, n);
      return e.set({
        originX: t,
        originY: n,
        left: i.x,
        top: i.y
      }), this;
    },
    _toggleFlipping: function (e) {
      this.flipX && (e.toggle('flipX'), e.set('left', -e.get('left')), e.setAngle(-e.getAngle())), this.flipY && (e.toggle('flipY'), e.set('top', -e.get('top')), e.setAngle(-e.getAngle()));
    },
    _restoreObjectState: function (e) {
      return this._setObjectPosition(e), e.setCoords(), e.hasControls = e.__origHasControls, delete e.__origHasControls, e.set('active', !1), e.setCoords(), delete e.group, this;
    },
    _setObjectPosition: function (e) {
      var t = this.getLeft(), n = this.getTop(), r = this._getRotatedLeftTop(e);
      e.set({
        angle: e.getAngle() + this.getAngle(),
        left: t + r.left,
        top: n + r.top,
        scaleX: e.get('scaleX') * this.get('scaleX'),
        scaleY: e.get('scaleY') * this.get('scaleY')
      });
    },
    _getRotatedLeftTop: function (e) {
      var t = this.getAngle() * (Math.PI / 180);
      return {
        left: -Math.sin(t) * e.getTop() * this.get('scaleY') + Math.cos(t) * e.getLeft() * this.get('scaleX'),
        top: Math.cos(t) * e.getTop() * this.get('scaleY') + Math.sin(t) * e.getLeft() * this.get('scaleX')
      };
    },
    destroy: function () {
      return this._objects.forEach(this._moveFlippedObject, this), this._restoreObjectsState();
    },
    saveCoords: function () {
      return this._originalLeft = this.get('left'), this._originalTop = this.get('top'), this;
    },
    hasMoved: function () {
      return this._originalLeft !== this.get('left') || this._originalTop !== this.get('top');
    },
    setObjectsCoords: function () {
      return this.forEachObject(function (e) {
        e.setCoords();
      }), this;
    },
    _setOpacityIfSame: function () {
      var e = this.getObjects(), t = e[0] ? e[0].get('opacity') : 1, n = e.every(function (e) {
          return e.get('opacity') === t;
        });
      n && (this.opacity = t);
    },
    _calcBounds: function (e) {
      var t = [], n = [], r;
      for (var i = 0, s = this._objects.length; i < s; ++i) {
        r = this._objects[i], r.setCoords();
        for (var o in r.oCoords)
          t.push(r.oCoords[o].x), n.push(r.oCoords[o].y);
      }
      this.set(this._getBounds(t, n, e));
    },
    _getBounds: function (e, n, s) {
      var o = t.util.invertTransform(this.getViewportTransform()), u = t.util.transformPoint(new t.Point(r(e), r(n)), o), a = t.util.transformPoint(new t.Point(i(e), i(n)), o), f = {
          width: a.x - u.x || 0,
          height: a.y - u.y || 0
        };
      return s || (f.left = (u.x + a.x) / 2 || 0, f.top = (u.y + a.y) / 2 || 0), f;
    },
    toSVG: function (e) {
      var t = [
          '<g ',
          'transform="',
          this.getSvgTransform(),
          '">\n'
        ];
      for (var n = 0, r = this._objects.length; n < r; n++)
        t.push(this._objects[n].toSVG(e));
      return t.push('</g>\n'), e ? e(t.join('')) : t.join('');
    },
    get: function (e) {
      if (e in o) {
        if (this[e])
          return this[e];
        for (var t = 0, n = this._objects.length; t < n; t++)
          if (this._objects[t][e])
            return !0;
        return !1;
      }
      return e in this.delegatedProperties ? this._objects[0] && this._objects[0].get(e) : this[e];
    }
  }), t.Group.fromObject = function (e, n) {
    t.util.enlivenObjects(e.objects, function (r) {
      delete e.objects, n && n(new t.Group(r, e));
    });
  }, t.Group.async = !0;
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = fabric.util.object.extend;
  e.fabric || (e.fabric = {});
  if (e.fabric.Image) {
    fabric.warn('fabric.Image is already defined.');
    return;
  }
  fabric.Image = fabric.util.createClass(fabric.Object, {
    type: 'image',
    crossOrigin: '',
    initialize: function (e, t) {
      t || (t = {}), this.filters = [], this.callSuper('initialize', t), this._initElement(e, t), this._initConfig(t), t.filters && (this.filters = t.filters, this.applyFilters());
    },
    getElement: function () {
      return this._element;
    },
    setElement: function (e, t) {
      return this._element = e, this._originalElement = e, this._initConfig(), this.filters.length !== 0 && this.applyFilters(t), this;
    },
    setCrossOrigin: function (e) {
      return this.crossOrigin = e, this._element.crossOrigin = e, this;
    },
    getOriginalSize: function () {
      var e = this.getElement();
      return {
        width: e.width,
        height: e.height
      };
    },
    _stroke: function (e) {
      e.save(), this._setStrokeStyles(e), e.beginPath(), e.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height), e.closePath(), e.restore();
    },
    _renderDashedStroke: function (e) {
      var t = -this.width / 2, n = -this.height / 2, r = this.width, i = this.height;
      e.save(), this._setStrokeStyles(e), e.beginPath(), fabric.util.drawDashedLine(e, t, n, t + r, n, this.strokeDashArray), fabric.util.drawDashedLine(e, t + r, n, t + r, n + i, this.strokeDashArray), fabric.util.drawDashedLine(e, t + r, n + i, t, n + i, this.strokeDashArray), fabric.util.drawDashedLine(e, t, n + i, t, n, this.strokeDashArray), e.closePath(), e.restore();
    },
    toObject: function (e) {
      return t(this.callSuper('toObject', e), {
        src: this._originalElement.src || this._originalElement._src,
        filters: this.filters.map(function (e) {
          return e && e.toObject();
        }),
        crossOrigin: this.crossOrigin
      });
    },
    toSVG: function (e) {
      var t = [], n = -this.width / 2, r = -this.height / 2;
      this.group && (n = this.left, r = this.top), t.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', '<image xlink:href="', this.getSvgSrc(), '" x="', n, '" y="', r, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="none"', '></image>\n');
      if (this.stroke || this.strokeDashArray) {
        var i = this.fill;
        this.fill = null, t.push('<rect ', 'x="', n, '" y="', r, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'), this.fill = i;
      }
      return t.push('</g>\n'), e ? e(t.join('')) : t.join('');
    },
    getSrc: function () {
      if (this.getElement())
        return this.getElement().src || this.getElement()._src;
    },
    toString: function () {
      return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
    },
    clone: function (e, t) {
      this.constructor.fromObject(this.toObject(t), e);
    },
    applyFilters: function (e) {
      if (!this._originalElement)
        return;
      if (this.filters.length === 0) {
        this._element = this._originalElement, e && e();
        return;
      }
      var t = this._originalElement, n = fabric.util.createCanvasElement(), r = fabric.util.createImage(), i = this;
      return n.width = t.width, n.height = t.height, n.getContext('2d').drawImage(t, 0, 0, t.width, t.height), this.filters.forEach(function (e) {
        e && e.applyTo(n);
      }), r.width = t.width, r.height = t.height, fabric.isLikelyNode ? (r.src = n.toBuffer(undefined, fabric.Image.pngCompression), i._element = r, e && e()) : (r.onload = function () {
        i._element = r, e && e(), r.onload = n = t = null;
      }, r.src = n.toDataURL('image/png')), this;
    },
    _render: function (e, t) {
      this._element && e.drawImage(this._element, t ? this.left : -this.width / 2, t ? this.top : -this.height / 2, this.width, this.height), this._renderStroke(e);
    },
    _resetWidthHeight: function () {
      var e = this.getElement();
      this.set('width', e.width), this.set('height', e.height);
    },
    _initElement: function (e) {
      this.setElement(fabric.util.getById(e)), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
    },
    _initConfig: function (e) {
      e || (e = {}), this.setOptions(e), this._setWidthHeight(e), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin);
    },
    _initFilters: function (e, t) {
      e.filters && e.filters.length ? fabric.util.enlivenObjects(e.filters, function (e) {
        t && t(e);
      }, 'fabric.Image.filters') : t && t();
    },
    _setWidthHeight: function (e) {
      this.width = 'width' in e ? e.width : this.getElement() ? this.getElement().width || 0 : 0, this.height = 'height' in e ? e.height : this.getElement() ? this.getElement().height || 0 : 0;
    },
    complexity: function () {
      return 1;
    }
  }), fabric.Image.CSS_CANVAS = 'canvas-img', fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function (e, t) {
    fabric.util.loadImage(e.src, function (n) {
      fabric.Image.prototype._initFilters.call(e, e, function (r) {
        e.filters = r || [];
        var i = new fabric.Image(n, e);
        t && t(i);
      });
    }, null, e.crossOrigin);
  }, fabric.Image.fromURL = function (e, t, n) {
    fabric.util.loadImage(e, function (e) {
      t(new fabric.Image(e, n));
    }, null, n && n.crossOrigin);
  }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat('x y width height xlink:href'.split(' ')), fabric.Image.fromElement = function (e, n, r) {
    var i = fabric.parseAttributes(e, fabric.Image.ATTRIBUTE_NAMES);
    fabric.Image.fromURL(i['xlink:href'], n, t(r ? fabric.util.object.clone(r) : {}, i));
  }, fabric.Image.async = !0, fabric.Image.pngCompression = 1;
}(typeof exports != 'undefined' ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
  _getAngleValueForStraighten: function () {
    var e = this.getAngle() % 360;
    return e > 0 ? Math.round((e - 1) / 90) * 90 : Math.round(e / 90) * 90;
  },
  straighten: function () {
    return this.setAngle(this._getAngleValueForStraighten()), this;
  },
  fxStraighten: function (e) {
    e = e || {};
    var t = function () {
      }, n = e.onComplete || t, r = e.onChange || t, i = this;
    return fabric.util.animate({
      startValue: this.get('angle'),
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: function (e) {
        i.setAngle(e), r();
      },
      onComplete: function () {
        i.setCoords(), n();
      },
      onStart: function () {
        i.set('active', !1);
      }
    }), this;
  }
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  straightenObject: function (e) {
    return e.straighten(), this.renderAll(), this;
  },
  fxStraightenObject: function (e) {
    return e.fxStraighten({ onChange: this.renderAll.bind(this) }), this;
  }
}), fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
  type: 'BaseFilter',
  toObject: function () {
    return { type: this.type };
  },
  toJSON: function () {
    return this.toObject();
  }
}), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Brightness = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Brightness',
    initialize: function (e) {
      e = e || {}, this.brightness = e.brightness || 0;
    },
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = this.brightness;
      for (var s = 0, o = r.length; s < o; s += 4)
        r[s] += i, r[s + 1] += i, r[s + 2] += i;
      t.putImageData(n, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), { brightness: this.brightness });
    }
  }), t.Image.filters.Brightness.fromObject = function (e) {
    return new t.Image.filters.Brightness(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Convolute = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Convolute',
    initialize: function (e) {
      e = e || {}, this.opaque = e.opaque, this.matrix = e.matrix || [
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ];
      var n = t.util.createCanvasElement();
      this.tmpCtx = n.getContext('2d');
    },
    _createImageData: function (e, t) {
      return this.tmpCtx.createImageData(e, t);
    },
    applyTo: function (e) {
      var t = this.matrix, n = e.getContext('2d'), r = n.getImageData(0, 0, e.width, e.height), i = Math.round(Math.sqrt(t.length)), s = Math.floor(i / 2), o = r.data, u = r.width, a = r.height, f = u, l = a, c = this._createImageData(f, l), h = c.data, p = this.opaque ? 1 : 0;
      for (var d = 0; d < l; d++)
        for (var v = 0; v < f; v++) {
          var m = d, g = v, y = (d * f + v) * 4, b = 0, w = 0, E = 0, S = 0;
          for (var x = 0; x < i; x++)
            for (var T = 0; T < i; T++) {
              var N = m + x - s, C = g + T - s;
              if (N < 0 || N > a || C < 0 || C > u)
                continue;
              var k = (N * u + C) * 4, L = t[x * i + T];
              b += o[k] * L, w += o[k + 1] * L, E += o[k + 2] * L, S += o[k + 3] * L;
            }
          h[y] = b, h[y + 1] = w, h[y + 2] = E, h[y + 3] = S + p * (255 - S);
        }
      n.putImageData(c, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), {
        opaque: this.opaque,
        matrix: this.matrix
      });
    }
  }), t.Image.filters.Convolute.fromObject = function (e) {
    return new t.Image.filters.Convolute(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.GradientTransparency = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'GradientTransparency',
    initialize: function (e) {
      e = e || {}, this.threshold = e.threshold || 100;
    },
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = this.threshold, s = r.length;
      for (var o = 0, u = r.length; o < u; o += 4)
        r[o + 3] = i + 255 * (s - o) / s;
      t.putImageData(n, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), { threshold: this.threshold });
    }
  }), t.Image.filters.GradientTransparency.fromObject = function (e) {
    return new t.Image.filters.GradientTransparency(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {});
  t.Image.filters.Grayscale = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Grayscale',
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = n.width * n.height * 4, s = 0, o;
      while (s < i)
        o = (r[s] + r[s + 1] + r[s + 2]) / 3, r[s] = o, r[s + 1] = o, r[s + 2] = o, s += 4;
      t.putImageData(n, 0, 0);
    }
  }), t.Image.filters.Grayscale.fromObject = function () {
    return new t.Image.filters.Grayscale();
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {});
  t.Image.filters.Invert = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Invert',
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = r.length, s;
      for (s = 0; s < i; s += 4)
        r[s] = 255 - r[s], r[s + 1] = 255 - r[s + 1], r[s + 2] = 255 - r[s + 2];
      t.putImageData(n, 0, 0);
    }
  }), t.Image.filters.Invert.fromObject = function () {
    return new t.Image.filters.Invert();
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Mask = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Mask',
    initialize: function (e) {
      e = e || {}, this.mask = e.mask, this.channel = [
        0,
        1,
        2,
        3
      ].indexOf(e.channel) > -1 ? e.channel : 0;
    },
    applyTo: function (e) {
      if (!this.mask)
        return;
      var n = e.getContext('2d'), r = n.getImageData(0, 0, e.width, e.height), i = r.data, s = this.mask.getElement(), o = t.util.createCanvasElement(), u = this.channel, a, f = r.width * r.height * 4;
      o.width = s.width, o.height = s.height, o.getContext('2d').drawImage(s, 0, 0, s.width, s.height);
      var l = o.getContext('2d').getImageData(0, 0, s.width, s.height), c = l.data;
      for (a = 0; a < f; a += 4)
        i[a + 3] = c[a + u];
      n.putImageData(r, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), {
        mask: this.mask.toObject(),
        channel: this.channel
      });
    }
  }), t.Image.filters.Mask.fromObject = function (e, n) {
    t.util.loadImage(e.mask.src, function (r) {
      e.mask = new t.Image(r, e.mask), n && n(new t.Image.filters.Mask(e));
    });
  }, t.Image.filters.Mask.async = !0;
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Noise = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Noise',
    initialize: function (e) {
      e = e || {}, this.noise = e.noise || 0;
    },
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = this.noise, s;
      for (var o = 0, u = r.length; o < u; o += 4)
        s = (0.5 - Math.random()) * i, r[o] += s, r[o + 1] += s, r[o + 2] += s;
      t.putImageData(n, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), { noise: this.noise });
    }
  }), t.Image.filters.Noise.fromObject = function (e) {
    return new t.Image.filters.Noise(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Pixelate = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Pixelate',
    initialize: function (e) {
      e = e || {}, this.blocksize = e.blocksize || 4;
    },
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = n.height, s = n.width, o, u, a, f, l, c, h;
      for (u = 0; u < i; u += this.blocksize)
        for (a = 0; a < s; a += this.blocksize) {
          o = u * 4 * s + a * 4, f = r[o], l = r[o + 1], c = r[o + 2], h = r[o + 3];
          for (var p = u, d = u + this.blocksize; p < d; p++)
            for (var v = a, m = a + this.blocksize; v < m; v++)
              o = p * 4 * s + v * 4, r[o] = f, r[o + 1] = l, r[o + 2] = c, r[o + 3] = h;
        }
      t.putImageData(n, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), { blocksize: this.blocksize });
    }
  }), t.Image.filters.Pixelate.fromObject = function (e) {
    return new t.Image.filters.Pixelate(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.RemoveWhite = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'RemoveWhite',
    initialize: function (e) {
      e = e || {}, this.threshold = e.threshold || 30, this.distance = e.distance || 20;
    },
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = this.threshold, s = this.distance, o = 255 - i, u = Math.abs, a, f, l;
      for (var c = 0, h = r.length; c < h; c += 4)
        a = r[c], f = r[c + 1], l = r[c + 2], a > o && f > o && l > o && u(a - f) < s && u(a - l) < s && u(f - l) < s && (r[c + 3] = 1);
      t.putImageData(n, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), {
        threshold: this.threshold,
        distance: this.distance
      });
    }
  }), t.Image.filters.RemoveWhite.fromObject = function (e) {
    return new t.Image.filters.RemoveWhite(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {});
  t.Image.filters.Sepia = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Sepia',
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = r.length, s, o;
      for (s = 0; s < i; s += 4)
        o = 0.3 * r[s] + 0.59 * r[s + 1] + 0.11 * r[s + 2], r[s] = o + 100, r[s + 1] = o + 50, r[s + 2] = o + 255;
      t.putImageData(n, 0, 0);
    }
  }), t.Image.filters.Sepia.fromObject = function () {
    return new t.Image.filters.Sepia();
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {});
  t.Image.filters.Sepia2 = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Sepia2',
    applyTo: function (e) {
      var t = e.getContext('2d'), n = t.getImageData(0, 0, e.width, e.height), r = n.data, i = r.length, s, o, u, a;
      for (s = 0; s < i; s += 4)
        o = r[s], u = r[s + 1], a = r[s + 2], r[s] = (o * 0.393 + u * 0.769 + a * 0.189) / 1.351, r[s + 1] = (o * 0.349 + u * 0.686 + a * 0.168) / 1.203, r[s + 2] = (o * 0.272 + u * 0.534 + a * 0.131) / 2.14;
      t.putImageData(n, 0, 0);
    }
  }), t.Image.filters.Sepia2.fromObject = function () {
    return new t.Image.filters.Sepia2();
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Tint = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Tint',
    initialize: function (e) {
      e = e || {}, this.color = e.color || '#000000', this.opacity = typeof e.opacity != 'undefined' ? e.opacity : new t.Color(this.color).getAlpha();
    },
    applyTo: function (e) {
      var n = e.getContext('2d'), r = n.getImageData(0, 0, e.width, e.height), i = r.data, s = i.length, o, u, a, f, l, c, h, p, d;
      d = new t.Color(this.color).getSource(), u = d[0] * this.opacity, a = d[1] * this.opacity, f = d[2] * this.opacity, p = 1 - this.opacity;
      for (o = 0; o < s; o += 4)
        l = i[o], c = i[o + 1], h = i[o + 2], i[o] = u + l * p, i[o + 1] = a + c * p, i[o + 2] = f + h * p;
      n.putImageData(r, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), {
        color: this.color,
        opacity: this.opacity
      });
    }
  }), t.Image.filters.Tint.fromObject = function (e) {
    return new t.Image.filters.Tint(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend;
  t.Image.filters.Multiply = t.util.createClass(t.Image.filters.BaseFilter, {
    type: 'Multiply',
    initialize: function (e) {
      e = e || {}, this.color = e.color || '#000000';
    },
    applyTo: function (e) {
      var n = e.getContext('2d'), r = n.getImageData(0, 0, e.width, e.height), i = r.data, s = i.length, o, u;
      u = new t.Color(this.color).getSource();
      for (o = 0; o < s; o += 4)
        i[o] *= u[0] / 255, i[o + 1] *= u[1] / 255, i[o + 2] *= u[2] / 255;
      n.putImageData(r, 0, 0);
    },
    toObject: function () {
      return n(this.callSuper('toObject'), { color: this.color });
    }
  }), t.Image.filters.Multiply.fromObject = function (e) {
    return new t.Image.filters.Multiply(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric;
  t.Image.filters.Blend = t.util.createClass({
    type: 'Blend',
    initialize: function (e) {
      e = e || {}, this.color = e.color || '#000', this.image = e.image || !1, this.mode = e.mode || 'multiply', this.alpha = e.alpha || 1;
    },
    applyTo: function (e) {
      var n = e.getContext('2d'), r = n.getImageData(0, 0, e.width, e.height), i = r.data, s, o, u, a, f, l, c, h = !1;
      if (this.image) {
        h = !0;
        var p = t.util.createCanvasElement();
        p.width = this.image.width, p.height = this.image.height;
        var d = new t.StaticCanvas(p);
        d.add(this.image);
        var v = d.getContext('2d');
        c = v.getImageData(0, 0, d.width, d.height).data;
      } else
        c = new t.Color(this.color).getSource(), s = c[0] * this.alpha, o = c[1] * this.alpha, u = c[2] * this.alpha;
      for (var m = 0, g = i.length; m < g; m += 4) {
        a = i[m], f = i[m + 1], l = i[m + 2], h && (s = c[m] * this.alpha, o = c[m + 1] * this.alpha, u = c[m + 2] * this.alpha);
        switch (this.mode) {
        case 'multiply':
          i[m] = a * s / 255, i[m + 1] = f * o / 255, i[m + 2] = l * u / 255;
          break;
        case 'screen':
          i[m] = 1 - (1 - a) * (1 - s), i[m + 1] = 1 - (1 - f) * (1 - o), i[m + 2] = 1 - (1 - l) * (1 - u);
          break;
        case 'add':
          i[m] = Math.min(255, a + s), i[m + 1] = Math.min(255, f + o), i[m + 2] = Math.min(255, l + u);
          break;
        case 'diff':
        case 'difference':
          i[m] = Math.abs(a - s), i[m + 1] = Math.abs(f - o), i[m + 2] = Math.abs(l - u);
          break;
        case 'subtract':
          var y = a - s, b = f - o, w = l - u;
          i[m] = y < 0 ? 0 : y, i[m + 1] = b < 0 ? 0 : b, i[m + 2] = w < 0 ? 0 : w;
          break;
        case 'darken':
          i[m] = Math.min(a, s), i[m + 1] = Math.min(f, o), i[m + 2] = Math.min(l, u);
          break;
        case 'lighten':
          i[m] = Math.max(a, s), i[m + 1] = Math.max(f, o), i[m + 2] = Math.max(l, u);
        }
      }
      n.putImageData(r, 0, 0);
    }
  }), t.Image.filters.Blend.fromObject = function (e) {
    return new t.Image.filters.Blend(e);
  };
}(typeof exports != 'undefined' ? exports : this), function (e) {
  'use strict';
  var t = e.fabric || (e.fabric = {}), n = t.util.object.extend, r = t.util.object.clone, i = t.util.toFixed, s = t.StaticCanvas.supports('setLineDash');
  if (t.Text) {
    t.warn('fabric.Text is already defined');
    return;
  }
  var o = t.Object.prototype.stateProperties.concat();
  o.push('fontFamily', 'fontWeight', 'fontSize', 'text', 'textDecoration', 'textAlign', 'fontStyle', 'lineHeight', 'textBackgroundColor', 'useNative', 'path'), t.Text = t.util.createClass(t.Object, {
    _dimensionAffectingProps: {
      fontSize: !0,
      fontWeight: !0,
      fontFamily: !0,
      textDecoration: !0,
      fontStyle: !0,
      lineHeight: !0,
      stroke: !0,
      strokeWidth: !0,
      text: !0
    },
    _reNewline: /\r?\n/,
    type: 'text',
    fontSize: 40,
    fontWeight: 'normal',
    fontFamily: 'Times New Roman',
    textDecoration: '',
    textAlign: 'left',
    fontStyle: '',
    lineHeight: 1.3,
    textBackgroundColor: '',
    path: null,
    useNative: !0,
    stateProperties: o,
    stroke: null,
    shadow: null,
    initialize: function (e, t) {
      t = t || {}, this.text = e, this.__skipDimension = !0, this.setOptions(t), this.__skipDimension = !1, this._initDimensions();
    },
    _initDimensions: function () {
      if (this.__skipDimension)
        return;
      var e = t.util.createCanvasElement();
      this._render(e.getContext('2d'));
    },
    toString: function () {
      return '#<fabric.Text (' + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
    },
    _render: function (e) {
      typeof Cufon == 'undefined' || this.useNative === !0 ? this._renderViaNative(e) : this._renderViaCufon(e);
    },
    _renderViaNative: function (e) {
      var n = this.text.split(this._reNewline);
      this._setTextStyles(e), this.width = this._getTextWidth(e, n), this.height = this._getTextHeight(e, n), this.clipTo && t.util.clipContext(this, e), this._renderTextBackground(e, n), this._translateForTextAlign(e), this._renderText(e, n), this.textAlign !== 'left' && this.textAlign !== 'justify' && e.restore(), this._renderTextDecoration(e, n), this.clipTo && e.restore(), this._setBoundaries(e, n), this._totalLineHeight = 0;
    },
    _renderText: function (e, t) {
      e.save(), this._setShadow(e), this._setupFillRule(e), this._renderTextFill(e, t), this._renderTextStroke(e, t), this._restoreFillRule(e), this._removeShadow(e), e.restore();
    },
    _translateForTextAlign: function (e) {
      this.textAlign !== 'left' && this.textAlign !== 'justify' && (e.save(), e.translate(this.textAlign === 'center' ? this.width / 2 : this.width, 0));
    },
    _setBoundaries: function (e, t) {
      this._boundaries = [];
      for (var n = 0, r = t.length; n < r; n++) {
        var i = this._getLineWidth(e, t[n]), s = this._getLineLeftOffset(i);
        this._boundaries.push({
          height: this.fontSize * this.lineHeight,
          width: i,
          left: s
        });
      }
    },
    _setTextStyles: function (e) {
      this._setFillStyles(e), this._setStrokeStyles(e), e.textBaseline = 'alphabetic', this.skipTextAlign || (e.textAlign = this.textAlign), e.font = this._getFontDeclaration();
    },
    _getTextHeight: function (e, t) {
      return this.fontSize * t.length * this.lineHeight;
    },
    _getTextWidth: function (e, t) {
      var n = e.measureText(t[0] || '|').width;
      for (var r = 1, i = t.length; r < i; r++) {
        var s = e.measureText(t[r]).width;
        s > n && (n = s);
      }
      return n;
    },
    _renderChars: function (e, t, n, r, i) {
      t[e](n, r, i);
    },
    _renderTextLine: function (e, t, n, r, i, s) {
      i -= this.fontSize / 4;
      if (this.textAlign !== 'justify') {
        this._renderChars(e, t, n, r, i, s);
        return;
      }
      var o = t.measureText(n).width, u = this.width;
      if (u > o) {
        var a = n.split(/\s+/), f = t.measureText(n.replace(/\s+/g, '')).width, l = u - f, c = a.length - 1, h = l / c, p = 0;
        for (var d = 0, v = a.length; d < v; d++)
          this._renderChars(e, t, a[d], r + p, i, s), p += t.measureText(a[d]).width + h;
      } else
        this._renderChars(e, t, n, r, i, s);
    },
    _getLeftOffset: function () {
      return t.isLikelyNode ? 0 : -this.width / 2;
    },
    _getTopOffset: function () {
      return -this.height / 2;
    },
    _renderTextFill: function (e, t) {
      if (!this.fill && !this._skipFillStrokeCheck)
        return;
      this._boundaries = [];
      var n = 0;
      for (var r = 0, i = t.length; r < i; r++) {
        var s = this._getHeightOfLine(e, r, t);
        n += s, this._renderTextLine('fillText', e, t[r], this._getLeftOffset(), this._getTopOffset() + n, r);
      }
    },
    _renderTextStroke: function (e, t) {
      if ((!this.stroke || this.strokeWidth === 0) && !this._skipFillStrokeCheck)
        return;
      var n = 0;
      e.save(), this.strokeDashArray && (1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), s && e.setLineDash(this.strokeDashArray)), e.beginPath();
      for (var r = 0, i = t.length; r < i; r++) {
        var o = this._getHeightOfLine(e, r, t);
        n += o, this._renderTextLine('strokeText', e, t[r], this._getLeftOffset(), this._getTopOffset() + n, r);
      }
      e.closePath(), e.restore();
    },
    _getHeightOfLine: function () {
      return this.fontSize * this.lineHeight;
    },
    _renderTextBackground: function (e, t) {
      this._renderTextBoxBackground(e), this._renderTextLinesBackground(e, t);
    },
    _renderTextBoxBackground: function (e) {
      if (!this.backgroundColor)
        return;
      e.save(), e.fillStyle = this.backgroundColor, e.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height), e.restore();
    },
    _renderTextLinesBackground: function (e, t) {
      if (!this.textBackgroundColor)
        return;
      e.save(), e.fillStyle = this.textBackgroundColor;
      for (var n = 0, r = t.length; n < r; n++)
        if (t[n] !== '') {
          var i = this._getLineWidth(e, t[n]), s = this._getLineLeftOffset(i);
          e.fillRect(this._getLeftOffset() + s, this._getTopOffset() + n * this.fontSize * this.lineHeight, i, this.fontSize * this.lineHeight);
        }
      e.restore();
    },
    _getLineLeftOffset: function (e) {
      return this.textAlign === 'center' ? (this.width - e) / 2 : this.textAlign === 'right' ? this.width - e : 0;
    },
    _getLineWidth: function (e, t) {
      return this.textAlign === 'justify' ? this.width : e.measureText(t).width;
    },
    _renderTextDecoration: function (e, t) {
      function i(i) {
        for (var s = 0, o = t.length; s < o; s++) {
          var u = r._getLineWidth(e, t[s]), a = r._getLineLeftOffset(u);
          e.fillRect(r._getLeftOffset() + a, ~~(i + s * r._getHeightOfLine(e, s, t) - n), u, 1);
        }
      }
      if (!this.textDecoration)
        return;
      var n = this._getTextHeight(e, t) / 2, r = this;
      this.textDecoration.indexOf('underline') > -1 && i(this.fontSize * this.lineHeight), this.textDecoration.indexOf('line-through') > -1 && i(this.fontSize * this.lineHeight - this.fontSize / 2), this.textDecoration.indexOf('overline') > -1 && i(this.fontSize * this.lineHeight - this.fontSize);
    },
    _getFontDeclaration: function () {
      return [
        t.isLikelyNode ? this.fontWeight : this.fontStyle,
        t.isLikelyNode ? this.fontStyle : this.fontWeight,
        this.fontSize + 'px',
        t.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily
      ].join(' ');
    },
    render: function (e, t) {
      if (!this.visible)
        return;
      e.save(), this._transform(e, t);
      var n = this.transformMatrix, r = this.group && this.group.type === 'path-group';
      r && e.translate(-this.group.width / 2, -this.group.height / 2), n && e.transform(n[0], n[1], n[2], n[3], n[4], n[5]), r && e.translate(this.left, this.top), this._render(e), e.restore();
    },
    toObject: function (e) {
      var t = n(this.callSuper('toObject', e), {
          text: this.text,
          fontSize: this.fontSize,
          fontWeight: this.fontWeight,
          fontFamily: this.fontFamily,
          fontStyle: this.fontStyle,
          lineHeight: this.lineHeight,
          textDecoration: this.textDecoration,
          textAlign: this.textAlign,
          path: this.path,
          textBackgroundColor: this.textBackgroundColor,
          useNative: this.useNative
        });
      return this.includeDefaultValues || this._removeDefaultValues(t), t;
    },
    toSVG: function (e) {
      var t = [], n = this.text.split(this._reNewline), r = this._getSVGLeftTopOffsets(n), i = this._getSVGTextAndBg(r.lineTop, r.textLeft, n), s = this._getSVGShadows(r.lineTop, n);
      return r.textTop += this._fontAscent ? this._fontAscent / 5 * this.lineHeight : 0, this._wrapSVGTextAndBg(t, i, s, r), e ? e(t.join('')) : t.join('');
    },
    _getSVGLeftTopOffsets: function (e) {
      var t = this.useNative ? this.fontSize * this.lineHeight : -this._fontAscent - this._fontAscent / 5 * this.lineHeight, n = -(this.width / 2), r = this.useNative ? this.fontSize - 1 : this.height / 2 - e.length * this.fontSize - this._totalLineHeight;
      return {
        textLeft: n + (this.group ? this.left : 0),
        textTop: r + (this.group ? this.top : 0),
        lineTop: t
      };
    },
    _wrapSVGTextAndBg: function (e, t, n, r) {
      e.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', t.textBgRects.join(''), '<text ', this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, '\'') + '" ' : '', this.fontSize ? 'font-size="' + this.fontSize + '" ' : '', this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : '', this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : '', this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : '', 'style="', this.getSvgStyles(), '" ', 'transform="translate(', i(r.textLeft, 2), ' ', i(r.textTop, 2), ')">', n.join(''), t.textSpans.join(''), '</text>\n', '</g>\n');
    },
    _getSVGShadows: function (e, n) {
      var r = [], s, o, u = 1;
      if (!this.shadow || !this._boundaries)
        return r;
      for (s = 0, o = n.length; s < o; s++)
        if (n[s] !== '') {
          var a = this._boundaries && this._boundaries[s] ? this._boundaries[s].left : 0;
          r.push('<tspan x="', i(a + u + this.shadow.offsetX, 2), s === 0 || this.useNative ? '" y' : '" dy', '="', i(this.useNative ? e * s - this.height / 2 + this.shadow.offsetY : e + (s === 0 ? this.shadow.offsetY : 0), 2), '" ', this._getFillAttributes(this.shadow.color), '>', t.util.string.escapeXml(n[s]), '</tspan>'), u = 1;
        } else
          u++;
      return r;
    },
    _getSVGTextAndBg: function (e, t, n) {
      var r = [], i = [], s = 1;
      this._setSVGBg(i);
      for (var o = 0, u = n.length; o < u; o++) {
        n[o] !== '' ? (this._setSVGTextLineText(n[o], o, r, e, s, i), s = 1) : s++;
        if (!this.textBackgroundColor || !this._boundaries)
          continue;
        this._setSVGTextLineBg(i, o, t, e);
      }
      return {
        textSpans: r,
        textBgRects: i
      };
    },
    _setSVGTextLineText: function (e, n, r, s, o) {
      var u = this._boundaries && this._boundaries[n] ? i(this._boundaries[n].left, 2) : 0;
      r.push('<tspan x="', u, '" ', n === 0 || this.useNative ? 'y' : 'dy', '="', i(this.useNative ? s * n - this.height / 2 : s * o, 2), '" ', this._getFillAttributes(this.fill), '>', t.util.string.escapeXml(e), '</tspan>');
    },
    _setSVGTextLineBg: function (e, t, n, r) {
      e.push('<rect ', this._getFillAttributes(this.textBackgroundColor), ' x="', i(n + this._boundaries[t].left, 2), '" y="', i(r * t - this.height / 2, 2), '" width="', i(this._boundaries[t].width, 2), '" height="', i(this._boundaries[t].height, 2), '"></rect>\n');
    },
    _setSVGBg: function (e) {
      this.backgroundColor && this._boundaries && e.push('<rect ', this._getFillAttributes(this.backgroundColor), ' x="', i(-this.width / 2, 2), '" y="', i(-this.height / 2, 2), '" width="', i(this.width, 2), '" height="', i(this.height, 2), '"></rect>');
    },
    _getFillAttributes: function (e) {
      var n = e && typeof e == 'string' ? new t.Color(e) : '';
      return !n || !n.getSource() || n.getAlpha() === 1 ? 'fill="' + e + '"' : 'opacity="' + n.getAlpha() + '" fill="' + n.setAlpha(1).toRgb() + '"';
    },
    _set: function (e, t) {
      e === 'fontFamily' && this.path && (this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + t + '$3')), this.callSuper('_set', e, t), e in this._dimensionAffectingProps && (this._initDimensions(), this.setCoords());
    },
    complexity: function () {
      return 1;
    }
  }), t.Text.ATTRIBUTE_NAMES = t.SHARED_ATTRIBUTES.concat('x y dx dy font-family font-style font-weight font-size text-decoration text-anchor'.split(' ')), t.Text.DEFAULT_SVG_FONT_SIZE = 16, t.Text.fromElement = function (e, n) {
    if (!e)
      return null;
    var r = t.parseAttributes(e, t.Text.ATTRIBUTE_NAMES);
    n = t.util.object.extend(n ? t.util.object.clone(n) : {}, r), 'dx' in r && (n.left += r.dx), 'dy' in r && (n.top += r.dy), 'fontSize' in n || (n.fontSize = t.Text.DEFAULT_SVG_FONT_SIZE), n.originX || (n.originX = 'left');
    var i = new t.Text(e.textContent, n), s = 0;
    return i.originX === 'left' && (s = i.getWidth() / 2), i.originX === 'right' && (s = -i.getWidth() / 2), i.set({
      left: i.getLeft() + s,
      top: i.getTop() - i.getHeight() / 2
    }), i;
  }, t.Text.fromObject = function (e) {
    return new t.Text(e.text, r(e));
  }, t.util.createAccessors(t.Text);
}(typeof exports != 'undefined' ? exports : this), function () {
  var e = fabric.util.object.clone;
  fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
    type: 'i-text',
    selectionStart: 0,
    selectionEnd: 0,
    selectionColor: 'rgba(17,119,255,0.3)',
    isEditing: !1,
    editable: !0,
    editingBorderColor: 'rgba(102,153,255,0.25)',
    cursorWidth: 2,
    cursorColor: '#333',
    cursorDelay: 1000,
    cursorDuration: 600,
    styles: null,
    caching: !0,
    _skipFillStrokeCheck: !0,
    _reSpace: /\s|\n/,
    _fontSizeFraction: 4,
    _currentCursorOpacity: 0,
    _selectionDirection: null,
    _abortCursorAnimation: !1,
    _charWidthsCache: {},
    initialize: function (e, t) {
      this.styles = t ? t.styles || {} : {}, this.callSuper('initialize', e, t), this.initBehavior(), fabric.IText.instances.push(this), this.__lineWidths = {}, this.__lineHeights = {}, this.__lineOffsets = {};
    },
    isEmptyStyles: function () {
      if (!this.styles)
        return !0;
      var e = this.styles;
      for (var t in e)
        for (var n in e[t])
          for (var r in e[t][n])
            return !1;
      return !0;
    },
    setSelectionStart: function (e) {
      this.selectionStart !== e && (this.fire('selection:changed'), this.canvas && this.canvas.fire('text:selection:changed', { target: this })), this.selectionStart = e, this.hiddenTextarea && (this.hiddenTextarea.selectionStart = e);
    },
    setSelectionEnd: function (e) {
      this.selectionEnd !== e && (this.fire('selection:changed'), this.canvas && this.canvas.fire('text:selection:changed', { target: this })), this.selectionEnd = e, this.hiddenTextarea && (this.hiddenTextarea.selectionEnd = e);
    },
    getSelectionStyles: function (e, t) {
      if (arguments.length === 2) {
        var n = [];
        for (var r = e; r < t; r++)
          n.push(this.getSelectionStyles(r));
        return n;
      }
      var i = this.get2DCursorLocation(e);
      return this.styles[i.lineIndex] ? this.styles[i.lineIndex][i.charIndex] || {} : {};
    },
    setSelectionStyles: function (e) {
      if (this.selectionStart === this.selectionEnd)
        this._extendStyles(this.selectionStart, e);
      else
        for (var t = this.selectionStart; t < this.selectionEnd; t++)
          this._extendStyles(t, e);
      return this;
    },
    _extendStyles: function (e, t) {
      var n = this.get2DCursorLocation(e);
      this.styles[n.lineIndex] || (this.styles[n.lineIndex] = {}), this.styles[n.lineIndex][n.charIndex] || (this.styles[n.lineIndex][n.charIndex] = {}), fabric.util.object.extend(this.styles[n.lineIndex][n.charIndex], t);
    },
    _render: function (e) {
      this.callSuper('_render', e), this.ctx = e, this.isEditing && this.renderCursorOrSelection();
    },
    renderCursorOrSelection: function () {
      if (!this.active)
        return;
      var e = this.text.split(''), t;
      this.selectionStart === this.selectionEnd ? (t = this._getCursorBoundaries(e, 'cursor'), this.renderCursor(t)) : (t = this._getCursorBoundaries(e, 'selection'), this.renderSelection(e, t));
    },
    get2DCursorLocation: function (e) {
      typeof e == 'undefined' && (e = this.selectionStart);
      var t = this.text.slice(0, e), n = t.split(this._reNewline);
      return {
        lineIndex: n.length - 1,
        charIndex: n[n.length - 1].length
      };
    },
    getCurrentCharStyle: function (e, t) {
      var n = this.styles[e] && this.styles[e][t === 0 ? 0 : t - 1];
      return {
        fontSize: n && n.fontSize || this.fontSize,
        fill: n && n.fill || this.fill,
        textBackgroundColor: n && n.textBackgroundColor || this.textBackgroundColor,
        textDecoration: n && n.textDecoration || this.textDecoration,
        fontFamily: n && n.fontFamily || this.fontFamily,
        fontWeight: n && n.fontWeight || this.fontWeight,
        fontStyle: n && n.fontStyle || this.fontStyle,
        stroke: n && n.stroke || this.stroke,
        strokeWidth: n && n.strokeWidth || this.strokeWidth
      };
    },
    getCurrentCharFontSize: function (e, t) {
      return this.styles[e] && this.styles[e][t === 0 ? 0 : t - 1] && this.styles[e][t === 0 ? 0 : t - 1].fontSize || this.fontSize;
    },
    getCurrentCharColor: function (e, t) {
      return this.styles[e] && this.styles[e][t === 0 ? 0 : t - 1] && this.styles[e][t === 0 ? 0 : t - 1].fill || this.cursorColor;
    },
    _getCursorBoundaries: function (e, t) {
      var n = this.get2DCursorLocation(), r = this.text.split(this._reNewline), i = Math.round(this._getLeftOffset()), s = -this.height / 2, o = this._getCursorBoundariesOffsets(e, t, n, r);
      return {
        left: i,
        top: s,
        leftOffset: o.left + o.lineLeft,
        topOffset: o.top
      };
    },
    _getCursorBoundariesOffsets: function (e, t, n, r) {
      var i = 0, s = 0, o = 0, u = 0, a = t === 'cursor' ? this._getHeightOfLine(this.ctx, 0) - this.getCurrentCharFontSize(n.lineIndex, n.charIndex) : 0;
      for (var f = 0; f < this.selectionStart; f++) {
        if (e[f] === '\n') {
          u = 0;
          var l = s + (t === 'cursor' ? 1 : 0);
          a += this._getCachedLineHeight(l), s++, o = 0;
        } else
          u += this._getWidthOfChar(this.ctx, e[f], s, o), o++;
        i = this._getCachedLineOffset(s, r);
      }
      return this._clearCache(), {
        top: a,
        left: u,
        lineLeft: i
      };
    },
    _clearCache: function () {
      this.__lineWidths = {}, this.__lineHeights = {}, this.__lineOffsets = {};
    },
    _getCachedLineHeight: function (e) {
      return this.__lineHeights[e] || (this.__lineHeights[e] = this._getHeightOfLine(this.ctx, e));
    },
    _getCachedLineWidth: function (e, t) {
      return this.__lineWidths[e] || (this.__lineWidths[e] = this._getWidthOfLine(this.ctx, e, t));
    },
    _getCachedLineOffset: function (e, t) {
      var n = this._getCachedLineWidth(e, t);
      return this.__lineOffsets[e] || (this.__lineOffsets[e] = this._getLineLeftOffset(n));
    },
    renderCursor: function (e) {
      var t = this.ctx;
      t.save();
      var n = this.get2DCursorLocation(), r = n.lineIndex, i = n.charIndex, s = this.getCurrentCharFontSize(r, i), o = r === 0 && i === 0 ? this._getCachedLineOffset(r, this.text.split(this._reNewline)) : e.leftOffset;
      t.fillStyle = this.getCurrentCharColor(r, i), t.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, t.fillRect(e.left + o, e.top + e.topOffset, this.cursorWidth / this.scaleX, s), t.restore();
    },
    renderSelection: function (e, t) {
      var n = this.ctx;
      n.save(), n.fillStyle = this.selectionColor;
      var r = this.get2DCursorLocation(this.selectionStart), i = this.get2DCursorLocation(this.selectionEnd), s = r.lineIndex, o = i.lineIndex, u = this.text.split(this._reNewline);
      for (var a = s; a <= o; a++) {
        var f = this._getCachedLineOffset(a, u) || 0, l = this._getCachedLineHeight(a), c = 0;
        if (a === s)
          for (var h = 0, p = u[a].length; h < p; h++)
            h >= r.charIndex && (a !== o || h < i.charIndex) && (c += this._getWidthOfChar(n, u[a][h], a, h)), h < r.charIndex && (f += this._getWidthOfChar(n, u[a][h], a, h));
        else if (a > s && a < o)
          c += this._getCachedLineWidth(a, u) || 5;
        else if (a === o)
          for (var d = 0, v = i.charIndex; d < v; d++)
            c += this._getWidthOfChar(n, u[a][d], a, d);
        n.fillRect(t.left + f, t.top + t.topOffset, c, l), t.topOffset += l;
      }
      n.restore();
    },
    _renderChars: function (e, t, n, r, i, s) {
      if (this.isEmptyStyles())
        return this._renderCharsFast(e, t, n, r, i);
      this.skipTextAlign = !0, r -= this.textAlign === 'center' ? this.width / 2 : this.textAlign === 'right' ? this.width : 0;
      var o = this.text.split(this._reNewline), u = this._getWidthOfLine(t, s, o), a = this._getHeightOfLine(t, s, o), f = this._getLineLeftOffset(u), l = n.split(''), c, h = '';
      r += f || 0, t.save();
      for (var p = 0, d = l.length; p <= d; p++) {
        c = c || this.getCurrentCharStyle(s, p);
        var v = this.getCurrentCharStyle(s, p + 1);
        if (this._hasStyleChanged(c, v) || p === d)
          this._renderChar(e, t, s, p - 1, h, r, i, a), h = '', c = v;
        h += l[p];
      }
      t.restore();
    },
    _renderCharsFast: function (e, t, n, r, i) {
      this.skipTextAlign = !1, e === 'fillText' && this.fill && this.callSuper('_renderChars', e, t, n, r, i), e === 'strokeText' && this.stroke && this.callSuper('_renderChars', e, t, n, r, i);
    },
    _renderChar: function (e, t, n, r, i, s, o, u) {
      var a, f, l;
      if (this.styles && this.styles[n] && (a = this.styles[n][r])) {
        var c = a.stroke || this.stroke, h = a.fill || this.fill;
        t.save(), f = this._applyCharStylesGetWidth(t, i, n, r, a), l = this._getHeightOfChar(t, i, n, r), h && t.fillText(i, s, o), c && t.strokeText(i, s, o), this._renderCharDecoration(t, a, s, o, f, u, l), t.restore(), t.translate(f, 0);
      } else
        e === 'strokeText' && this.stroke && t[e](i, s, o), e === 'fillText' && this.fill && t[e](i, s, o), f = this._applyCharStylesGetWidth(t, i, n, r), this._renderCharDecoration(t, null, s, o, f, u), t.translate(t.measureText(i).width, 0);
    },
    _hasStyleChanged: function (e, t) {
      return e.fill !== t.fill || e.fontSize !== t.fontSize || e.textBackgroundColor !== t.textBackgroundColor || e.textDecoration !== t.textDecoration || e.fontFamily !== t.fontFamily || e.fontWeight !== t.fontWeight || e.fontStyle !== t.fontStyle || e.stroke !== t.stroke || e.strokeWidth !== t.strokeWidth;
    },
    _renderCharDecoration: function (e, t, n, r, i, s, o) {
      var u = t ? t.textDecoration || this.textDecoration : this.textDecoration, a = (t ? t.fontSize : null) || this.fontSize;
      if (!u)
        return;
      u.indexOf('underline') > -1 && this._renderCharDecorationAtOffset(e, n, r + this.fontSize / this._fontSizeFraction, i, 0, this.fontSize / 20), u.indexOf('line-through') > -1 && this._renderCharDecorationAtOffset(e, n, r + this.fontSize / this._fontSizeFraction, i, o / 2, a / 20), u.indexOf('overline') > -1 && this._renderCharDecorationAtOffset(e, n, r, i, s - this.fontSize / this._fontSizeFraction, this.fontSize / 20);
    },
    _renderCharDecorationAtOffset: function (e, t, n, r, i, s) {
      e.fillRect(t, n - i, r, s);
    },
    _renderTextLine: function (e, t, n, r, i, s) {
      i += this.fontSize / 4, this.callSuper('_renderTextLine', e, t, n, r, i, s);
    },
    _renderTextDecoration: function (e, t) {
      if (this.isEmptyStyles())
        return this.callSuper('_renderTextDecoration', e, t);
    },
    _renderTextLinesBackground: function (e, t) {
      if (!this.textBackgroundColor && !this.styles)
        return;
      e.save(), this.textBackgroundColor && (e.fillStyle = this.textBackgroundColor);
      var n = 0, r = this.fontSize / this._fontSizeFraction;
      for (var i = 0, s = t.length; i < s; i++) {
        var o = this._getHeightOfLine(e, i, t);
        if (t[i] === '') {
          n += o;
          continue;
        }
        var u = this._getWidthOfLine(e, i, t), a = this._getLineLeftOffset(u);
        this.textBackgroundColor && (e.fillStyle = this.textBackgroundColor, e.fillRect(this._getLeftOffset() + a, this._getTopOffset() + n + r, u, o));
        if (this.styles[i])
          for (var f = 0, l = t[i].length; f < l; f++)
            if (this.styles[i] && this.styles[i][f] && this.styles[i][f].textBackgroundColor) {
              var c = t[i][f];
              e.fillStyle = this.styles[i][f].textBackgroundColor, e.fillRect(this._getLeftOffset() + a + this._getWidthOfCharsAt(e, i, f, t), this._getTopOffset() + n + r, this._getWidthOfChar(e, c, i, f, t) + 1, o);
            }
        n += o;
      }
      e.restore();
    },
    _getCacheProp: function (e, t) {
      return e + t.fontFamily + t.fontSize + t.fontWeight + t.fontStyle + t.shadow;
    },
    _applyCharStylesGetWidth: function (t, n, r, i, s) {
      var o = s || this.styles[r] && this.styles[r][i];
      o ? o = e(o) : o = {}, this._applyFontStyles(o);
      var u = this._getCacheProp(n, o);
      if (this.isEmptyStyles() && this._charWidthsCache[u] && this.caching)
        return this._charWidthsCache[u];
      typeof o.shadow == 'string' && (o.shadow = new fabric.Shadow(o.shadow));
      var a = o.fill || this.fill;
      return t.fillStyle = a.toLive ? a.toLive(t) : a, o.stroke && (t.strokeStyle = o.stroke && o.stroke.toLive ? o.stroke.toLive(t) : o.stroke), t.lineWidth = o.strokeWidth || this.strokeWidth, t.font = this._getFontDeclaration.call(o), this._setShadow.call(o, t), this.caching ? (this._charWidthsCache[u] || (this._charWidthsCache[u] = t.measureText(n).width), this._charWidthsCache[u]) : t.measureText(n).width;
    },
    _applyFontStyles: function (e) {
      e.fontFamily || (e.fontFamily = this.fontFamily), e.fontSize || (e.fontSize = this.fontSize), e.fontWeight || (e.fontWeight = this.fontWeight), e.fontStyle || (e.fontStyle = this.fontStyle);
    },
    _getStyleDeclaration: function (t, n) {
      return this.styles[t] && this.styles[t][n] ? e(this.styles[t][n]) : {};
    },
    _getWidthOfChar: function (e, t, n, r) {
      var i = this._getStyleDeclaration(n, r);
      this._applyFontStyles(i);
      var s = this._getCacheProp(t, i);
      if (this._charWidthsCache[s] && this.caching)
        return this._charWidthsCache[s];
      if (e) {
        e.save();
        var o = this._applyCharStylesGetWidth(e, t, n, r);
        return e.restore(), o;
      }
    },
    _getHeightOfChar: function (e, t, n, r) {
      return this.styles[n] && this.styles[n][r] ? this.styles[n][r].fontSize || this.fontSize : this.fontSize;
    },
    _getWidthOfCharAt: function (e, t, n, r) {
      r = r || this.text.split(this._reNewline);
      var i = r[t].split('')[n];
      return this._getWidthOfChar(e, i, t, n);
    },
    _getHeightOfCharAt: function (e, t, n, r) {
      r = r || this.text.split(this._reNewline);
      var i = r[t].split('')[n];
      return this._getHeightOfChar(e, i, t, n);
    },
    _getWidthOfCharsAt: function (e, t, n, r) {
      var i = 0;
      for (var s = 0; s < n; s++)
        i += this._getWidthOfCharAt(e, t, s, r);
      return i;
    },
    _getWidthOfLine: function (e, t, n) {
      return this._getWidthOfCharsAt(e, t, n[t].length, n);
    },
    _getTextWidth: function (e, t) {
      if (this.isEmptyStyles())
        return this.callSuper('_getTextWidth', e, t);
      var n = this._getWidthOfLine(e, 0, t);
      for (var r = 1, i = t.length; r < i; r++) {
        var s = this._getWidthOfLine(e, r, t);
        s > n && (n = s);
      }
      return n;
    },
    _getHeightOfLine: function (e, t, n) {
      n = n || this.text.split(this._reNewline);
      var r = this._getHeightOfChar(e, n[t][0], t, 0), i = n[t], s = i.split('');
      for (var o = 1, u = s.length; o < u; o++) {
        var a = this._getHeightOfChar(e, s[o], t, o);
        a > r && (r = a);
      }
      return r * this.lineHeight;
    },
    _getTextHeight: function (e, t) {
      var n = 0;
      for (var r = 0, i = t.length; r < i; r++)
        n += this._getHeightOfLine(e, r, t);
      return n;
    },
    _getTopOffset: function () {
      var e = fabric.Text.prototype._getTopOffset.call(this);
      return e - this.fontSize / this._fontSizeFraction;
    },
    _renderTextBoxBackground: function (e) {
      if (!this.backgroundColor)
        return;
      e.save(), e.fillStyle = this.backgroundColor, e.fillRect(this._getLeftOffset(), this._getTopOffset() + this.fontSize / this._fontSizeFraction, this.width, this.height), e.restore();
    },
    toObject: function (t) {
      return fabric.util.object.extend(this.callSuper('toObject', t), { styles: e(this.styles) });
    }
  }), fabric.IText.fromObject = function (t) {
    return new fabric.IText(t.text, e(t));
  }, fabric.IText.instances = [];
}(), function () {
  var e = fabric.util.object.clone;
  fabric.util.object.extend(fabric.IText.prototype, {
    initBehavior: function () {
      this.initAddedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation();
    },
    initSelectedHandler: function () {
      this.on('selected', function () {
        var e = this;
        setTimeout(function () {
          e.selected = !0;
        }, 100);
      });
    },
    initAddedHandler: function () {
      this.on('added', function () {
        this.canvas && !this.canvas._hasITextHandlers && (this.canvas._hasITextHandlers = !0, this._initCanvasHandlers());
      });
    },
    _initCanvasHandlers: function () {
      this.canvas.on('selection:cleared', function () {
        fabric.IText.prototype.exitEditingOnOthers.call();
      }), this.canvas.on('mouse:up', function () {
        fabric.IText.instances.forEach(function (e) {
          e.__isMousedown = !1;
        });
      }), this.canvas.on('object:selected', function (e) {
        fabric.IText.prototype.exitEditingOnOthers.call(e.target);
      });
    },
    _tick: function () {
      if (this._abortCursorAnimation)
        return;
      var e = this;
      this.animate('_currentCursorOpacity', 1, {
        duration: this.cursorDuration,
        onComplete: function () {
          e._onTickComplete();
        },
        onChange: function () {
          e.canvas && e.canvas.renderAll();
        },
        abort: function () {
          return e._abortCursorAnimation;
        }
      });
    },
    _onTickComplete: function () {
      if (this._abortCursorAnimation)
        return;
      var e = this;
      this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout(function () {
        e.animate('_currentCursorOpacity', 0, {
          duration: this.cursorDuration / 2,
          onComplete: function () {
            e._tick();
          },
          onChange: function () {
            e.canvas && e.canvas.renderAll();
          },
          abort: function () {
            return e._abortCursorAnimation;
          }
        });
      }, 100);
    },
    initDelayedCursor: function (e) {
      var t = this, n = e ? 0 : this.cursorDelay;
      e && (this._abortCursorAnimation = !0, clearTimeout(this._cursorTimeout1), this._currentCursorOpacity = 1, this.canvas && this.canvas.renderAll()), this._cursorTimeout2 && clearTimeout(this._cursorTimeout2), this._cursorTimeout2 = setTimeout(function () {
        t._abortCursorAnimation = !1, t._tick();
      }, n);
    },
    abortCursorAnimation: function () {
      this._abortCursorAnimation = !0, clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, this.canvas && this.canvas.renderAll();
      var e = this;
      setTimeout(function () {
        e._abortCursorAnimation = !1;
      }, 10);
    },
    selectAll: function () {
      this.selectionStart = 0, this.selectionEnd = this.text.length, this.fire('selection:changed'), this.canvas && this.canvas.fire('text:selection:changed', { target: this });
    },
    getSelectedText: function () {
      return this.text.slice(this.selectionStart, this.selectionEnd);
    },
    findWordBoundaryLeft: function (e) {
      var t = 0, n = e - 1;
      if (this._reSpace.test(this.text.charAt(n)))
        while (this._reSpace.test(this.text.charAt(n)))
          t++, n--;
      while (/\S/.test(this.text.charAt(n)) && n > -1)
        t++, n--;
      return e - t;
    },
    findWordBoundaryRight: function (e) {
      var t = 0, n = e;
      if (this._reSpace.test(this.text.charAt(n)))
        while (this._reSpace.test(this.text.charAt(n)))
          t++, n++;
      while (/\S/.test(this.text.charAt(n)) && n < this.text.length)
        t++, n++;
      return e + t;
    },
    findLineBoundaryLeft: function (e) {
      var t = 0, n = e - 1;
      while (!/\n/.test(this.text.charAt(n)) && n > -1)
        t++, n--;
      return e - t;
    },
    findLineBoundaryRight: function (e) {
      var t = 0, n = e;
      while (!/\n/.test(this.text.charAt(n)) && n < this.text.length)
        t++, n++;
      return e + t;
    },
    getNumNewLinesInSelectedText: function () {
      var e = this.getSelectedText(), t = 0;
      for (var n = 0, r = e.split(''), i = r.length; n < i; n++)
        r[n] === '\n' && t++;
      return t;
    },
    searchWordBoundary: function (e, t) {
      var n = this._reSpace.test(this.text.charAt(e)) ? e - 1 : e, r = this.text.charAt(n), i = /[ \n\.,;!\?\-]/;
      while (!i.test(r) && n > 0 && n < this.text.length)
        n += t, r = this.text.charAt(n);
      return i.test(r) && r !== '\n' && (n += t === 1 ? 0 : 1), n;
    },
    selectWord: function (e) {
      var t = this.searchWordBoundary(e, -1), n = this.searchWordBoundary(e, 1);
      this.setSelectionStart(t), this.setSelectionEnd(n), this.initDelayedCursor(!0);
    },
    selectLine: function (e) {
      var t = this.findLineBoundaryLeft(e), n = this.findLineBoundaryRight(e);
      this.setSelectionStart(t), this.setSelectionEnd(n), this.initDelayedCursor(!0);
    },
    enterEditing: function () {
      if (this.isEditing || !this.editable)
        return;
      return this.exitEditingOnOthers(), this.isEditing = !0, this.initHiddenTextarea(), this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._tick(), this.canvas && this.canvas.renderAll(), this.fire('editing:entered'), this.canvas && this.canvas.fire('text:editing:entered', { target: this }), this;
    },
    exitEditingOnOthers: function () {
      fabric.IText.instances.forEach(function (e) {
        e.selected = !1, e.isEditing && e.exitEditing();
      }, this);
    },
    _setEditingProps: function () {
      this.hoverCursor = 'text', this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = 'text'), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0;
    },
    _updateTextarea: function () {
      if (!this.hiddenTextarea)
        return;
      this.hiddenTextarea.value = this.text, this.hiddenTextarea.selectionStart = this.selectionStart;
    },
    _saveEditingProps: function () {
      this._savedProps = {
        hasControls: this.hasControls,
        borderColor: this.borderColor,
        lockMovementX: this.lockMovementX,
        lockMovementY: this.lockMovementY,
        hoverCursor: this.hoverCursor,
        defaultCursor: this.canvas && this.canvas.defaultCursor,
        moveCursor: this.canvas && this.canvas.moveCursor
      };
    },
    _restoreEditingProps: function () {
      if (!this._savedProps)
        return;
      this.hoverCursor = this._savedProps.overCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor);
    },
    exitEditing: function () {
      return this.selected = !1, this.isEditing = !1, this.selectable = !0, this.selectionEnd = this.selectionStart, this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null, this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this.fire('editing:exited'), this.canvas && this.canvas.fire('text:editing:exited', { target: this }), this;
    },
    _removeExtraneousStyles: function () {
      var e = this.text.split(this._reNewline);
      for (var t in this.styles)
        e[t] || delete this.styles[t];
    },
    _removeCharsFromTo: function (e, t) {
      var n = t;
      while (n !== e) {
        var r = this.get2DCursorLocation(n).charIndex;
        n--;
        var i = this.get2DCursorLocation(n).charIndex, s = i > r;
        s ? this.removeStyleObject(s, n + 1) : this.removeStyleObject(this.get2DCursorLocation(n).charIndex === 0, n);
      }
      this.text = this.text.slice(0, e) + this.text.slice(t);
    },
    insertChars: function (e) {
      var t = this.text.slice(this.selectionStart, this.selectionStart + 1) === '\n';
      this.text = this.text.slice(0, this.selectionStart) + e + this.text.slice(this.selectionEnd), this.selectionStart === this.selectionEnd && this.insertStyleObjects(e, t, this.copiedStyles), this.selectionStart += e.length, this.selectionEnd = this.selectionStart, this.canvas && this.canvas.renderAll().renderAll(), this.setCoords(), this.fire('changed'), this.canvas && this.canvas.fire('text:changed', { target: this });
    },
    insertNewlineStyleObject: function (t, n, r) {
      this.shiftLineStyles(t, 1), this.styles[t + 1] || (this.styles[t + 1] = {});
      var i = this.styles[t][n - 1], s = {};
      if (r)
        s[0] = e(i), this.styles[t + 1] = s;
      else {
        for (var o in this.styles[t])
          parseInt(o, 10) >= n && (s[parseInt(o, 10) - n] = this.styles[t][o], delete this.styles[t][o]);
        this.styles[t + 1] = s;
      }
    },
    insertCharStyleObject: function (t, n, r) {
      var i = this.styles[t], s = e(i);
      n === 0 && !r && (n = 1);
      for (var o in s) {
        var u = parseInt(o, 10);
        u >= n && (i[u + 1] = s[u]);
      }
      this.styles[t][n] = r || e(i[n - 1]);
    },
    insertStyleObjects: function (e, t, n) {
      if (this.isEmptyStyles())
        return;
      var r = this.get2DCursorLocation(), i = r.lineIndex, s = r.charIndex;
      this.styles[i] || (this.styles[i] = {}), e === '\n' ? this.insertNewlineStyleObject(i, s, t) : n ? this._insertStyles(n) : this.insertCharStyleObject(i, s);
    },
    _insertStyles: function (e) {
      for (var t = 0, n = e.length; t < n; t++) {
        var r = this.get2DCursorLocation(this.selectionStart + t), i = r.lineIndex, s = r.charIndex;
        this.insertCharStyleObject(i, s, e[t]);
      }
    },
    shiftLineStyles: function (t, n) {
      var r = e(this.styles);
      for (var i in this.styles) {
        var s = parseInt(i, 10);
        s > t && (this.styles[s + n] = r[s]);
      }
    },
    removeStyleObject: function (t, n) {
      var r = this.get2DCursorLocation(n), i = r.lineIndex, s = r.charIndex;
      if (t) {
        var o = this.text.split(this._reNewline), u = o[i - 1], a = u ? u.length : 0;
        this.styles[i - 1] || (this.styles[i - 1] = {});
        for (s in this.styles[i])
          this.styles[i - 1][parseInt(s, 10) + a] = this.styles[i][s];
        this.shiftLineStyles(i, -1);
      } else {
        var f = this.styles[i];
        if (f) {
          var l = this.selectionStart === this.selectionEnd ? -1 : 0;
          delete f[s + l];
        }
        var c = e(f);
        for (var h in c) {
          var p = parseInt(h, 10);
          p >= s && p !== 0 && (f[p - 1] = c[p], delete f[p]);
        }
      }
    },
    insertNewline: function () {
      this.insertChars('\n');
    }
  });
}(), fabric.util.object.extend(fabric.IText.prototype, {
  initDoubleClickSimulation: function () {
    this.__lastClickTime = +new Date(), this.__lastLastClickTime = +new Date(), this.__lastPointer = {}, this.on('mousedown', this.onMouseDown.bind(this));
  },
  onMouseDown: function (e) {
    this.__newClickTime = +new Date();
    var t = this.canvas.getPointer(e.e);
    this.isTripleClick(t) ? (this.fire('tripleclick', e), this._stopEvent(e.e)) : this.isDoubleClick(t) && (this.fire('dblclick', e), this._stopEvent(e.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = t, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected;
  },
  isDoubleClick: function (e) {
    return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === e.x && this.__lastPointer.y === e.y && this.__lastIsEditing;
  },
  isTripleClick: function (e) {
    return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === e.x && this.__lastPointer.y === e.y;
  },
  _stopEvent: function (e) {
    e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation();
  },
  initCursorSelectionHandlers: function () {
    this.initSelectedHandler(), this.initMousedownHandler(), this.initMousemoveHandler(), this.initMouseupHandler(), this.initClicks();
  },
  initClicks: function () {
    this.on('dblclick', function (e) {
      this.selectWord(this.getSelectionStartFromPointer(e.e));
    }), this.on('tripleclick', function (e) {
      this.selectLine(this.getSelectionStartFromPointer(e.e));
    });
  },
  initMousedownHandler: function () {
    this.on('mousedown', function (e) {
      var t = this.canvas.getPointer(e.e);
      this.__mousedownX = t.x, this.__mousedownY = t.y, this.__isMousedown = !0, this.hiddenTextarea && this.canvas && this.canvas.wrapperEl.appendChild(this.hiddenTextarea), this.selected && this.setCursorByClick(e.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.initDelayedCursor(!0));
    });
  },
  initMousemoveHandler: function () {
    this.on('mousemove', function (e) {
      if (!this.__isMousedown || !this.isEditing)
        return;
      var t = this.getSelectionStartFromPointer(e.e);
      t >= this.__selectionStartOnMouseDown ? (this.setSelectionStart(this.__selectionStartOnMouseDown), this.setSelectionEnd(t)) : (this.setSelectionStart(t), this.setSelectionEnd(this.__selectionStartOnMouseDown));
    });
  },
  _isObjectMoved: function (e) {
    var t = this.canvas.getPointer(e);
    return this.__mousedownX !== t.x || this.__mousedownY !== t.y;
  },
  initMouseupHandler: function () {
    this.on('mouseup', function (e) {
      this.__isMousedown = !1;
      if (this._isObjectMoved(e.e))
        return;
      this.__lastSelected && (this.enterEditing(), this.initDelayedCursor(!0)), this.selected = !0;
    });
  },
  setCursorByClick: function (e) {
    var t = this.getSelectionStartFromPointer(e);
    e.shiftKey ? t < this.selectionStart ? (this.setSelectionEnd(this.selectionStart), this.setSelectionStart(t)) : this.setSelectionEnd(t) : (this.setSelectionStart(t), this.setSelectionEnd(t));
  },
  _getLocalRotatedPointer: function (e) {
    var t = this.canvas.getPointer(e), n = new fabric.Point(t.x, t.y), r = new fabric.Point(this.left, this.top), i = fabric.util.rotatePoint(n, r, fabric.util.degreesToRadians(-this.angle));
    return this.getLocalPointer(e, i);
  },
  getSelectionStartFromPointer: function (e) {
    var t = this._getLocalRotatedPointer(e), n = this.text.split(this._reNewline), r = 0, i = 0, s = 0, o = 0, u;
    for (var a = 0, f = n.length; a < f; a++) {
      s += this._getHeightOfLine(this.ctx, a) * this.scaleY;
      var l = this._getWidthOfLine(this.ctx, a, n), c = this._getLineLeftOffset(l);
      i = c * this.scaleX, this.flipX && (n[a] = n[a].split('').reverse().join(''));
      for (var h = 0, p = n[a].length; h < p; h++) {
        var d = n[a][h];
        r = i, i += this._getWidthOfChar(this.ctx, d, a, this.flipX ? p - h : h) * this.scaleX;
        if (s <= t.y || i <= t.x) {
          o++;
          continue;
        }
        return this._getNewSelectionStartFromOffset(t, r, i, o + a, p);
      }
      if (t.y < s)
        return this._getNewSelectionStartFromOffset(t, r, i, o + a, p);
    }
    if (typeof u == 'undefined')
      return this.text.length;
  },
  _getNewSelectionStartFromOffset: function (e, t, n, r, i) {
    var s = e.x - t, o = n - e.x, u = o > s ? 0 : 1, a = r + u;
    return this.flipX && (a = i - a), a > this.text.length && (a = this.text.length), a;
  }
}), fabric.util.object.extend(fabric.IText.prototype, {
  initHiddenTextarea: function () {
    this.hiddenTextarea = fabric.document.createElement('textarea'), this.hiddenTextarea.setAttribute('autocapitalize', 'off'), this.hiddenTextarea.style.cssText = 'position: absolute; top: 0; left: -9999px', fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, 'keydown', this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, 'keypress', this.onKeyPress.bind(this)), fabric.util.addListener(this.hiddenTextarea, 'copy', this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, 'paste', this.paste.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, 'click', this.onClick.bind(this)), this._clickHandlerInitialized = !0);
  },
  _keysMap: {
    8: 'removeChars',
    13: 'insertNewline',
    37: 'moveCursorLeft',
    38: 'moveCursorUp',
    39: 'moveCursorRight',
    40: 'moveCursorDown',
    46: 'forwardDelete'
  },
  _ctrlKeysMap: {
    65: 'selectAll',
    88: 'cut'
  },
  onClick: function () {
    this.hiddenTextarea && this.hiddenTextarea.focus();
  },
  onKeyDown: function (e) {
    if (!this.isEditing)
      return;
    if (e.keyCode in this._keysMap && e.charCode === 0)
      this[this._keysMap[e.keyCode]](e);
    else {
      if (!(e.keyCode in this._ctrlKeysMap && (e.ctrlKey || e.metaKey)))
        return;
      this[this._ctrlKeysMap[e.keyCode]](e);
    }
    e.stopPropagation(), this.canvas && this.canvas.renderAll();
  },
  forwardDelete: function (e) {
    this.selectionStart === this.selectionEnd && this.moveCursorRight(e), this.removeChars(e);
  },
  copy: function (e) {
    var t = this.getSelectedText(), n = this._getClipboardData(e);
    n && n.setData('text', t), this.copiedText = t, this.copiedStyles = this.getSelectionStyles(this.selectionStart, this.selectionEnd);
  },
  paste: function (e) {
    var t = null, n = this._getClipboardData(e);
    n ? t = n.getData('text') : t = this.copiedText, t && this.insertChars(t);
  },
  cut: function (e) {
    if (this.selectionStart === this.selectionEnd)
      return;
    this.copy(), this.removeChars(e);
  },
  _getClipboardData: function (e) {
    return e && (e.clipboardData || fabric.window.clipboardData);
  },
  onKeyPress: function (e) {
    if (!this.isEditing || e.metaKey || e.ctrlKey || e.keyCode in this._keysMap && e.charCode === 0)
      return;
    this.insertChars(String.fromCharCode(e.which)), e.stopPropagation();
  },
  getDownCursorOffset: function (e, t) {
    var n = t ? this.selectionEnd : this.selectionStart, r = this.text.split(this._reNewline), i, s, o = this.text.slice(0, n), u = this.text.slice(n), a = o.slice(o.lastIndexOf('\n') + 1), f = u.match(/(.*)\n?/)[1], l = (u.match(/.*\n(.*)\n?/) || {})[1] || '', c = this.get2DCursorLocation(n);
    if (c.lineIndex === r.length - 1 || e.metaKey)
      return this.text.length - n;
    var h = this._getWidthOfLine(this.ctx, c.lineIndex, r);
    s = this._getLineLeftOffset(h);
    var p = s, d = c.lineIndex;
    for (var v = 0, m = a.length; v < m; v++)
      i = a[v], p += this._getWidthOfChar(this.ctx, i, d, v);
    var g = this._getIndexOnNextLine(c, l, p, r);
    return f.length + 1 + g;
  },
  _getIndexOnNextLine: function (e, t, n, r) {
    var i = e.lineIndex + 1, s = this._getWidthOfLine(this.ctx, i, r), o = this._getLineLeftOffset(s), u = o, a = 0, f;
    for (var l = 0, c = t.length; l < c; l++) {
      var h = t[l], p = this._getWidthOfChar(this.ctx, h, i, l);
      u += p;
      if (u > n) {
        f = !0;
        var d = u - p, v = u, m = Math.abs(d - n), g = Math.abs(v - n);
        a = g < m ? l + 1 : l;
        break;
      }
    }
    return f || (a = t.length), a;
  },
  moveCursorDown: function (e) {
    this.abortCursorAnimation(), this._currentCursorOpacity = 1;
    var t = this.getDownCursorOffset(e, this._selectionDirection === 'right');
    e.shiftKey ? this.moveCursorDownWithShift(t) : this.moveCursorDownWithoutShift(t), this.initDelayedCursor();
  },
  moveCursorDownWithoutShift: function (e) {
    this._selectionDirection = 'right', this.selectionStart += e, this.selectionStart > this.text.length && (this.selectionStart = this.text.length), this.selectionEnd = this.selectionStart;
  },
  moveCursorDownWithShift: function (e) {
    if (this._selectionDirection === 'left' && this.selectionStart !== this.selectionEnd) {
      this.selectionStart += e, this._selectionDirection = 'left';
      return;
    }
    this._selectionDirection = 'right', this.selectionEnd += e, this.selectionEnd > this.text.length && (this.selectionEnd = this.text.length);
  },
  getUpCursorOffset: function (e, t) {
    var n = t ? this.selectionEnd : this.selectionStart, r = this.get2DCursorLocation(n);
    if (r.lineIndex === 0 || e.metaKey)
      return n;
    var i = this.text.slice(0, n), s = i.slice(i.lastIndexOf('\n') + 1), o = (i.match(/\n?(.*)\n.*$/) || {})[1] || '', u = this.text.split(this._reNewline), a, f = this._getWidthOfLine(this.ctx, r.lineIndex, u), l = this._getLineLeftOffset(f), c = l, h = r.lineIndex;
    for (var p = 0, d = s.length; p < d; p++)
      a = s[p], c += this._getWidthOfChar(this.ctx, a, h, p);
    var v = this._getIndexOnPrevLine(r, o, c, u);
    return o.length - v + s.length;
  },
  _getIndexOnPrevLine: function (e, t, n, r) {
    var i = e.lineIndex - 1, s = this._getWidthOfLine(this.ctx, i, r), o = this._getLineLeftOffset(s), u = o, a = 0, f;
    for (var l = 0, c = t.length; l < c; l++) {
      var h = t[l], p = this._getWidthOfChar(this.ctx, h, i, l);
      u += p;
      if (u > n) {
        f = !0;
        var d = u - p, v = u, m = Math.abs(d - n), g = Math.abs(v - n);
        a = g < m ? l : l - 1;
        break;
      }
    }
    return f || (a = t.length - 1), a;
  },
  moveCursorUp: function (e) {
    this.abortCursorAnimation(), this._currentCursorOpacity = 1;
    var t = this.getUpCursorOffset(e, this._selectionDirection === 'right');
    e.shiftKey ? this.moveCursorUpWithShift(t) : this.moveCursorUpWithoutShift(t), this.initDelayedCursor();
  },
  moveCursorUpWithShift: function (e) {
    if (this.selectionStart === this.selectionEnd)
      this.selectionStart -= e;
    else {
      if (this._selectionDirection === 'right') {
        this.selectionEnd -= e, this._selectionDirection = 'right';
        return;
      }
      this.selectionStart -= e;
    }
    this.selectionStart < 0 && (this.selectionStart = 0), this._selectionDirection = 'left';
  },
  moveCursorUpWithoutShift: function (e) {
    this.selectionStart === this.selectionEnd && (this.selectionStart -= e), this.selectionStart < 0 && (this.selectionStart = 0), this.selectionEnd = this.selectionStart, this._selectionDirection = 'left';
  },
  moveCursorLeft: function (e) {
    if (this.selectionStart === 0 && this.selectionEnd === 0)
      return;
    this.abortCursorAnimation(), this._currentCursorOpacity = 1, e.shiftKey ? this.moveCursorLeftWithShift(e) : this.moveCursorLeftWithoutShift(e), this.initDelayedCursor();
  },
  _move: function (e, t, n) {
    e.altKey ? this[t] = this['findWordBoundary' + n](this[t]) : e.metaKey ? this[t] = this['findLineBoundary' + n](this[t]) : this[t] += n === 'Left' ? -1 : 1;
  },
  _moveLeft: function (e, t) {
    this._move(e, t, 'Left');
  },
  _moveRight: function (e, t) {
    this._move(e, t, 'Right');
  },
  moveCursorLeftWithoutShift: function (e) {
    this._selectionDirection = 'left', this.selectionEnd === this.selectionStart && this._moveLeft(e, 'selectionStart'), this.selectionEnd = this.selectionStart;
  },
  moveCursorLeftWithShift: function (e) {
    this._selectionDirection === 'right' && this.selectionStart !== this.selectionEnd ? this._moveLeft(e, 'selectionEnd') : (this._selectionDirection = 'left', this._moveLeft(e, 'selectionStart'), this.text.charAt(this.selectionStart) === '\n' && this.selectionStart--, this.selectionStart < 0 && (this.selectionStart = 0));
  },
  moveCursorRight: function (e) {
    if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length)
      return;
    this.abortCursorAnimation(), this._currentCursorOpacity = 1, e.shiftKey ? this.moveCursorRightWithShift(e) : this.moveCursorRightWithoutShift(e), this.initDelayedCursor();
  },
  moveCursorRightWithShift: function (e) {
    this._selectionDirection === 'left' && this.selectionStart !== this.selectionEnd ? this._moveRight(e, 'selectionStart') : (this._selectionDirection = 'right', this._moveRight(e, 'selectionEnd'), this.text.charAt(this.selectionEnd - 1) === '\n' && this.selectionEnd++, this.selectionEnd > this.text.length && (this.selectionEnd = this.text.length));
  },
  moveCursorRightWithoutShift: function (e) {
    this._selectionDirection = 'right', this.selectionStart === this.selectionEnd ? (this._moveRight(e, 'selectionStart'), this.selectionEnd = this.selectionStart) : (this.selectionEnd += this.getNumNewLinesInSelectedText(), this.selectionEnd > this.text.length && (this.selectionEnd = this.text.length), this.selectionStart = this.selectionEnd);
  },
  removeChars: function (e) {
    this.selectionStart === this.selectionEnd ? this._removeCharsNearCursor(e) : this._removeCharsFromTo(this.selectionStart, this.selectionEnd), this.selectionEnd = this.selectionStart, this._removeExtraneousStyles(), this.canvas && this.canvas.renderAll().renderAll(), this.setCoords(), this.fire('changed'), this.canvas && this.canvas.fire('text:changed', { target: this });
  },
  _removeCharsNearCursor: function (e) {
    if (this.selectionStart !== 0)
      if (e.metaKey) {
        var t = this.findLineBoundaryLeft(this.selectionStart);
        this._removeCharsFromTo(t, this.selectionStart), this.selectionStart = t;
      } else if (e.altKey) {
        var n = this.findWordBoundaryLeft(this.selectionStart);
        this._removeCharsFromTo(n, this.selectionStart), this.selectionStart = n;
      } else {
        var r = this.text.slice(this.selectionStart - 1, this.selectionStart) === '\n';
        this.removeStyleObject(r), this.selectionStart--, this.text = this.text.slice(0, this.selectionStart) + this.text.slice(this.selectionStart + 1);
      }
  }
}), fabric.util.object.extend(fabric.IText.prototype, {
  _setSVGTextLineText: function (e, t, n, r, i, s) {
    this.styles[t] ? this._setSVGTextLineChars(e, t, n, r, i, s) : this.callSuper('_setSVGTextLineText', e, t, n, r, i);
  },
  _setSVGTextLineChars: function (e, t, n, r, i, s) {
    var o = t === 0 || this.useNative ? 'y' : 'dy', u = e.split(''), a = 0, f = this._getSVGLineLeftOffset(t), l = this._getSVGLineTopOffset(t), c = this._getHeightOfLine(this.ctx, t);
    for (var h = 0, p = u.length; h < p; h++) {
      var d = this.styles[t][h] || {};
      n.push(this._createTextCharSpan(u[h], d, f, l, o, a));
      var v = this._getWidthOfChar(this.ctx, u[h], t, h);
      d.textBackgroundColor && s.push(this._createTextCharBg(d, f, l, c, v, a)), a += v;
    }
  },
  _getSVGLineLeftOffset: function (e) {
    return this._boundaries && this._boundaries[e] ? fabric.util.toFixed(this._boundaries[e].left, 2) : 0;
  },
  _getSVGLineTopOffset: function (e) {
    var t = 0;
    for (var n = 0; n <= e; n++)
      t += this._getHeightOfLine(this.ctx, n);
    return t - this.height / 2;
  },
  _createTextCharBg: function (e, t, n, r, i, s) {
    return [
      '<rect fill="',
      e.textBackgroundColor,
      '" transform="translate(',
      -this.width / 2,
      ' ',
      -this.height + r,
      ')',
      '" x="',
      t + s,
      '" y="',
      n + r,
      '" width="',
      i,
      '" height="',
      r,
      '"></rect>'
    ].join('');
  },
  _createTextCharSpan: function (e, t, n, r, i, s) {
    var o = this.getSvgStyles.call(fabric.util.object.extend({
        visible: !0,
        fill: this.fill,
        stroke: this.stroke,
        type: 'text'
      }, t));
    return [
      '<tspan x="',
      n + s,
      '" ',
      i,
      '="',
      r,
      '" ',
      t.fontFamily ? 'font-family="' + t.fontFamily.replace(/"/g, '\'') + '" ' : '',
      t.fontSize ? 'font-size="' + t.fontSize + '" ' : '',
      t.fontStyle ? 'font-style="' + t.fontStyle + '" ' : '',
      t.fontWeight ? 'font-weight="' + t.fontWeight + '" ' : '',
      t.textDecoration ? 'text-decoration="' + t.textDecoration + '" ' : '',
      'style="',
      o,
      '">',
      fabric.util.string.escapeXml(e),
      '</tspan>'
    ].join('');
  }
}), function () {
  function request(e, t, n) {
    var r = URL.parse(e);
    r.port || (r.port = r.protocol.indexOf('https:') === 0 ? 443 : 80);
    var i = r.port === 443 ? HTTPS : HTTP, s = i.request({
        hostname: r.hostname,
        port: r.port,
        path: r.path,
        method: 'GET'
      }, function (e) {
        var r = '';
        t && e.setEncoding(t), e.on('end', function () {
          n(r);
        }), e.on('data', function (t) {
          e.statusCode === 200 && (r += t);
        });
      });
    s.on('error', function (e) {
      e.errno === process.ECONNREFUSED ? fabric.log('ECONNREFUSED: connection refused to ' + r.hostname + ':' + r.port) : fabric.log(e.message);
    }), s.end();
  }
  function requestFs(e, t) {
    var n = require('fs');
    n.readFile(e, function (e, n) {
      if (e)
        throw fabric.log(e), e;
      t(n);
    });
  }
  if (typeof document != 'undefined' && typeof window != 'undefined')
    return;
  var DOMParser = require('xmldom').DOMParser, URL = require('url'), HTTP = require('http'), HTTPS = require('https'), Canvas = require('canvas'), Image = require('canvas').Image;
  fabric.util.loadImage = function (e, t, n) {
    function r(r) {
      i.src = new Buffer(r, 'binary'), i._src = e, t && t.call(n, i);
    }
    var i = new Image();
    e && (e instanceof Buffer || e.indexOf('data') === 0) ? (i.src = i._src = e, t && t.call(n, i)) : e && e.indexOf('http') !== 0 ? requestFs(e, r) : e ? request(e, 'binary', r) : t && t.call(n, e);
  }, fabric.loadSVGFromURL = function (e, t, n) {
    e = e.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim(), e.indexOf('http') !== 0 ? requestFs(e, function (e) {
      fabric.loadSVGFromString(e.toString(), t, n);
    }) : request(e, '', function (e) {
      fabric.loadSVGFromString(e, t, n);
    });
  }, fabric.loadSVGFromString = function (e, t, n) {
    var r = new DOMParser().parseFromString(e);
    fabric.parseSVGDocument(r.documentElement, function (e, n) {
      t && t(e, n);
    }, n);
  }, fabric.util.getScript = function (url, callback) {
    request(url, '', function (body) {
      eval(body), callback && callback();
    });
  }, fabric.Image.fromObject = function (e, t) {
    fabric.util.loadImage(e.src, function (n) {
      var r = new fabric.Image(n);
      r._initConfig(e), r._initFilters(e, function (e) {
        r.filters = e || [], t && t(r);
      });
    });
  }, fabric.createCanvasForNode = function (e, t, n, r) {
    r = r || n;
    var i = fabric.document.createElement('canvas'), s = new Canvas(e || 600, t || 600, r);
    i.style = {}, i.width = s.width, i.height = s.height;
    var o = fabric.Canvas || fabric.StaticCanvas, u = new o(i, n);
    return u.contextContainer = s.getContext('2d'), u.nodeCanvas = s, u.Font = Canvas.Font, u;
  }, fabric.StaticCanvas.prototype.createPNGStream = function () {
    return this.nodeCanvas.createPNGStream();
  }, fabric.StaticCanvas.prototype.createJPEGStream = function (e) {
    return this.nodeCanvas.createJPEGStream(e);
  };
  var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
  fabric.StaticCanvas.prototype.setWidth = function (e, t) {
    return origSetWidth.call(this, e, t), this.nodeCanvas.width = e, this;
  }, fabric.Canvas && (fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth);
  var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
  fabric.StaticCanvas.prototype.setHeight = function (e, t) {
    return origSetHeight.call(this, e, t), this.nodeCanvas.height = e, this;
  }, fabric.Canvas && (fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight);
}();
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function () {
  var lastTime = 0;
  var vendors = [
      'ms',
      'moz',
      'webkit',
      'o'
    ];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
}());