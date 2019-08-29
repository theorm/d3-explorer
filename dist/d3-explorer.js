(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es6.regexp.replace'), require('lodash-es'), require('d3'), require('core-js/modules/es6.regexp.to-string'), require('core-js/modules/es6.object.to-string')) :
typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es6.regexp.replace', 'lodash-es', 'd3', 'core-js/modules/es6.regexp.to-string', 'core-js/modules/es6.object.to-string'], factory) :
(global = global || self, factory(global['d3-explorer'] = global['d3-explorer'] || {}, null, global._, global.d3));
}(this, function (exports, es6_regexp_replace, lodashEs, d3) { 'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function assert(statement, errorMessage) {
  if (!statement) {
    var error = new Error("[Assertion error]: ".concat(errorMessage));
    error.assert = true;
  }
}
function warn() {
  var _console;

  // eslint-disable-next-line no-console
  (_console = console).warn.apply(_console, arguments);
}

var Plot =
/*#__PURE__*/
function () {
  function Plot() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Plot);

    this.title = lodashEs.get(options, 'title', '');
  }

  _createClass(Plot, [{
    key: "getTitle",
    value: function getTitle() {
      return this.title;
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "renderLabels",
    value: function renderLabels(group, id, units, labels, explorer) {} // eslint-disable-next-line no-unused-vars

  }, {
    key: "renderStep",
    value: function renderStep(group, id, units, data, stepIndex, explorer, binOffset) {} // eslint-disable-next-line no-unused-vars

  }, {
    key: "renderOverlay",
    value: function renderOverlay(group, id, units, explorer) {}
  }]);

  return Plot;
}();

var DefaultParameters = {
  labels: {
    offset: 150,
    margin: 5
  },
  margin: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10
  },
  colours: {
    bin: {
      highlight: '#dddddd22',
      selected: '#ffff0033',
      midline: '#eaeaea'
    },
    separator: {
      line: '#bbb',
      textBackground: '#ffffffbb'
    }
  },
  handlers: {}
};
var TopLevelClasses = ['labels', 'bins', 'separators', 'overlays'];

var Explorer =
/*#__PURE__*/
function () {
  function Explorer(rootElement) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Explorer);

    assert(!lodashEs.isNil(options), 'Options must be an object');
    this.container = d3.select(rootElement);
    this.svg = this.container.append('svg');
    if (options.class) this.svg.attr('class', options.class);

    var _this$container$node$ = this.container.node().getBoundingClientRect(),
        width = _this$container$node$.width,
        height = _this$container$node$.height;

    if (width === 0) warn("Width of the SVG container is ".concat(width));
    if (height === 0) warn("Height of the SVG container is ".concat(height));
    this.parameters = lodashEs.assignIn({}, DefaultParameters, options.parameters);
    this.plots = [];
    this.data = {};
  }

  _createClass(Explorer, [{
    key: "_getWH",
    value: function _getWH() {
      var _this$container$node$2 = this.container.node().getBoundingClientRect(),
          width = _this$container$node$2.width,
          height = _this$container$node$2.height;

      return {
        width: width,
        height: height
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$_getWH = this._getWH(),
          width = _this$_getWH.width,
          height = _this$_getWH.height;

      var binsCount = this.getBinsCount();
      this.svg.attr('width', width).attr('height', height);
      var data = [this.getLabelsGroupsData(), // labels
      d3.range(binsCount), // bins
      this.getPlotsTitlesData(), // separators / titles
      d3.range(this.plots.length)];
      this.svg.selectAll('g.toplevel').data(data).join('g').attr('class', function (d, idx) {
        return "toplevel ".concat(TopLevelClasses[idx]);
      }).each(function (data, index, group) {
        var g = d3.select(group[index]);
        if (index === 0) return _this._renderLabels(g);
        if (index === 1) return _this._renderBins(g);
        if (index === 2) return _this._renderSeparators(g);
        if (index === 3) return _this._renderOverlay(g);
      });
    }
  }, {
    key: "getBinWidth",
    value: function getBinWidth() {
      var _this$_getWH2 = this._getWH(),
          width = _this$_getWH2.width;

      var binsCount = this.getBinsCount();
      var _this$parameters = this.parameters,
          margin = _this$parameters.margin,
          labels = _this$parameters.labels;
      return (width - margin.left - margin.right - labels.offset) / binsCount;
    }
  }, {
    key: "getBinsCount",
    value: function getBinsCount() {
      var _this2 = this;

      return this.plots.reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            id = _ref2[0];

        var len = lodashEs.get(_this2.data[id], 'data', []).length;
        return len > acc ? len : acc;
      }, 0);
    }
  }, {
    key: "getMaximumOptimalBinsCount",
    value: function getMaximumOptimalBinsCount() {
      var _this$_getWH3 = this._getWH(),
          width = _this$_getWH3.width;

      var _this$parameters2 = this.parameters,
          margin = _this$parameters2.margin,
          labels = _this$parameters2.labels;
      var binsPaneWidth = width - labels.offset - margin.left - margin.right;
      var minBinWidth = 20;
      var val = Math.floor(binsPaneWidth / minBinWidth);
      return val > 0 ? val : 0;
    }
  }, {
    key: "getGroupsData",
    value: function getGroupsData() {
      var _this3 = this;

      return this.plots.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            id = _ref4[0];

        return lodashEs.get(_this3.data[id], 'data', []);
      });
    }
  }, {
    key: "getDataForGroup",
    value: function getDataForGroup(groupId) {
      return lodashEs.get(this.data[groupId], 'data', []);
    }
  }, {
    key: "getLabelsGroupsData",
    value: function getLabelsGroupsData() {
      var _this4 = this;

      return this.plots.map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1),
            id = _ref6[0];

        return lodashEs.get(_this4.data[id], 'labels', []);
      });
    }
  }, {
    key: "getPlotsTitlesData",
    value: function getPlotsTitlesData() {
      return this.plots.map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            p = _ref8[1];

        return p.getTitle();
      });
    }
  }, {
    key: "getUnitSize",
    value: function getUnitSize() {
      var _this$_getWH4 = this._getWH(),
          height = _this$_getWH4.height;

      var margin = this.parameters.margin;
      var actualHeight = height - margin.top - margin.bottom;
      var reservedUnits = this.plots.reduce(function (acc, _ref9) {
        var _ref10 = _slicedToArray(_ref9, 3),
            units = _ref10[2];

        return acc + units;
      }, 0);
      return actualHeight / (reservedUnits || 1);
    }
  }, {
    key: "_renderLabels",
    value: function _renderLabels(selection) {
      var _this5 = this;

      var margin = this.parameters.margin;
      var g = selection.selectAll('g.label-group').data(this._dataWithRenderMeta.bind(this)).join('g').attr('class', function (_ref11) {
        var id = _ref11.id;
        return "label-group ".concat(id.replace(' ', '-'));
      }).attr('transform', function (_ref12) {
        var unitsOffset = _ref12.unitsOffset;
        return "translate(0, ".concat(unitsOffset * _this5.getUnitSize() + margin.top, ")");
      });
      var explorer = this;
      g.each(function (d) {
        var id = d.id,
            units = d.units,
            data = d.data,
            plot = d.plot;
        plot.renderLabels(d3.select(this), id, units, data, explorer);
      });
    }
  }, {
    key: "_renderBins",
    value: function _renderBins(selection) {
      var _this6 = this;

      var _this$_getWH5 = this._getWH(),
          width = _this$_getWH5.width,
          height = _this$_getWH5.height;

      var params = this.parameters;
      var binWidth = this.getBinWidth();
      var _this$parameters3 = this.parameters,
          margin = _this$parameters3.margin,
          labels = _this$parameters3.labels;
      var xScale = d3.scaleLinear().domain([0, selection.data()[0].length]).rangeRound([0, width - margin.right - margin.left - labels.offset]);

      var filterOutSelectedHighlight = function filterOutSelectedHighlight() {
        return !this.classList.contains('selected');
      };

      var bin = selection.style('pointer-events', 'all').attr('transform', "translate(".concat(this.parameters.labels.offset + margin.left, ", 0)")).selectAll('g.step').data(function (d) {
        return d;
      }).join('g').attr('class', 'step').attr('transform', function (d, i) {
        return "translate(".concat(xScale(i), ", 0)");
      }).on('mouseover', function (d, index) {
        d3.select(this).select('.highlight').filter(filterOutSelectedHighlight).style('fill', params.colours.bin.highlight);
        this.selectedBin = index;
        var _params$handlers$onBi = params.handlers.onBinOver,
            onBinOver = _params$handlers$onBi === void 0 ? lodashEs.noop : _params$handlers$onBi;
        onBinOver(index);
      }).on('mouseout', function (d, index) {
        d3.select(this).select('.highlight').filter(filterOutSelectedHighlight).style('fill', 'none');
        this.selectedBin = index;
        var _params$handlers$onBi2 = params.handlers.onBinOut,
            onBinOut = _params$handlers$onBi2 === void 0 ? lodashEs.noop : _params$handlers$onBi2;
        onBinOut(index);
      }).on('click', function (d, index) {
        _this6.selectedBin = index;
        var _params$handlers$onBi3 = params.handlers.onBinSelected,
            onBinSelected = _params$handlers$onBi3 === void 0 ? lodashEs.noop : _params$handlers$onBi3;
        onBinSelected(index);

        _this6.render();
      });
      bin.selectAll('line.midline').data([null]).join('line').attr('class', 'midline').attr('stroke', params.colours.bin.midline).attr('x1', binWidth / 2).attr('x2', binWidth / 2).attr('y1', margin.top).attr('y2', height - margin.top - margin.bottom);
      bin.selectAll('rect.highlight').data(function (d, stepIndex) {
        return [{
          stepIndex: stepIndex
        }];
      }).join('rect').attr('class', function (d) {
        return d.stepIndex === _this6.selectedBin ? 'highlight selected' : 'highlight';
      }).style('fill', function (d) {
        return d.stepIndex === _this6.selectedBin ? params.colours.bin.selected : 'none';
      }).attr('x', 0).attr('y', margin.top).attr('width', binWidth).attr('height', height - margin.top - margin.bottom);
      var plots = bin.selectAll('g.plots').data(function (d) {
        return [d];
      }).join('g').attr('class', 'plots');
      var explorer = this;
      plots.selectAll('g.plot').data(function (d, stepIndex) {
        var data = _this6.getGroupsData().map(function (items) {
          return lodashEs.get(items, stepIndex);
        });

        return _this6._dataWithRenderMeta.bind(_this6)(data).map(function (v) {
          v.stepIndex = stepIndex;
          return v;
        });
      }, function (d) {
        return d.id;
      }).join('g').attr('class', function (_ref13) {
        var id = _ref13.id;
        return "plot ".concat(id.replace(' ', '-'));
      }).attr('transform', function (_ref14) {
        var unitsOffset = _ref14.unitsOffset;
        return "translate(0, ".concat(unitsOffset * _this6.getUnitSize() + margin.top, ")");
      }).each(function (d) {
        var id = d.id,
            plot = d.plot,
            units = d.units,
            stepIndex = d.stepIndex;
        plot.renderStep(d3.select(this), id, units, lodashEs.get(explorer.data[id], 'data', []), stepIndex, explorer, xScale(stepIndex));
      });
    }
  }, {
    key: "_renderSeparators",
    value: function _renderSeparators(selection) {
      var _this7 = this;

      var _this$parameters4 = this.parameters,
          margin = _this$parameters4.margin,
          colours = _this$parameters4.colours;

      var _this$_getWH6 = this._getWH(),
          width = _this$_getWH6.width;

      var g = selection.selectAll('g.separator').data(this._dataWithRenderMeta.bind(this)).join('g').attr('class', function (_ref15) {
        var id = _ref15.id;
        return "separator ".concat(id.replace(' ', '-'));
      }).attr('transform', function (_ref16) {
        var unitsOffset = _ref16.unitsOffset;
        return "translate(0, ".concat(unitsOffset * _this7.getUnitSize() + margin.top, ")");
      });
      g.selectAll('line').data(function (d) {
        return [d];
      }).join('line').attr('stroke', colours.separator.line).attr('stroke-dasharray', 4).attr('x1', margin.left).attr('x2', width - margin.right);
      var textOffset = margin.left + (width - margin.left - margin.right) / 2;
      var yMargin = 4;
      var xMargin = 8;
      g.selectAll('rect').data(function (d) {
        return [d];
      }).join('rect').attr('fill', colours.separator.textBackground).attr('x', textOffset - xMargin).attr('y', -yMargin * 2).attr('width', 100).attr('height', 20);
      g.selectAll('text').data(function (d) {
        return [d];
      }).join('text').attr('dy', yMargin).attr('x', textOffset).text(function (_ref17) {
        var data = _ref17.data;
        return data;
      });
      d3.zip(g.selectAll('rect').nodes(), g.selectAll('text').nodes()).forEach(function (_ref18) {
        var _ref19 = _slicedToArray(_ref18, 2),
            rect = _ref19[0],
            text = _ref19[1];

        var _text$getBoundingClie = text.getBoundingClientRect(),
            width = _text$getBoundingClie.width;

        d3.select(rect).attr('width', width + xMargin * 2);
      });
    }
  }, {
    key: "_renderOverlay",
    value: function _renderOverlay(selection) {
      var _this8 = this;

      var margin = this.parameters.margin;
      var g = selection.style('pointer-events', 'all').attr('transform', "translate(".concat(this.parameters.labels.offset + margin.left, ", 0)")).selectAll('g.overlay').data(this._dataWithRenderMeta.bind(this)).join('g').attr('class', function (_ref20) {
        var id = _ref20.id;
        return "overlay ".concat(id.replace(' ', '-'));
      }).attr('transform', function (_ref21) {
        var unitsOffset = _ref21.unitsOffset;
        return "translate(0, ".concat(unitsOffset * _this8.getUnitSize() + margin.top, ")");
      });
      var explorer = this;
      g.each(function (d) {
        var id = d.id,
            units = d.units,
            plot = d.plot;
        plot.renderOverlay(d3.select(this), id, units, explorer);
      });
    }
  }, {
    key: "_dataWithRenderMeta",
    value: function _dataWithRenderMeta(d) {
      var _this9 = this;

      return d.map(function (data, idx) {
        var previousPlots = _this9.plots.slice(0, idx);

        var unitsOffset = previousPlots.reduce(function (acc, _ref22) {
          var _ref23 = _slicedToArray(_ref22, 3),
              units = _ref23[2];

          return acc + units;
        }, 0);

        var _this9$plots$idx = _slicedToArray(_this9.plots[idx], 3),
            id = _this9$plots$idx[0],
            plot = _this9$plots$idx[1],
            units = _this9$plots$idx[2];

        return {
          data: data,
          id: id,
          plot: plot,
          units: units,
          unitsOffset: unitsOffset
        };
      });
    }
  }, {
    key: "getOverlayForPlot",
    value: function getOverlayForPlot(plotId) {
      var index = this.plots.map(function (_ref24) {
        var _ref25 = _slicedToArray(_ref24, 1),
            id = _ref25[0];

        return id;
      }).indexOf(plotId);
      return this.svg.selectAll("g.overlay:nth-child(".concat(index + 1, ")"));
    }
  }, {
    key: "addPlot",
    value: function addPlot(plot) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      assert(!lodashEs.isNil(options), 'Options must be an object');
      assert(plot instanceof Plot, "Plot is not a \"Plot\" instance: ".concat(plot));
      var numAddedPlots = this.plots.length;
      var _options$units = options.units,
          units = _options$units === void 0 ? 1 : _options$units,
          _options$id = options.id,
          id = _options$id === void 0 ? "plot-".concat(numAddedPlots) : _options$id;
      assert(this.plots.filter(function (p) {
        return p[0] === id;
      }).length === 0, "Plot with ID \"".concat(id, "\" already exists"));
      this.plots.push([id, plot, units]);
      this.render();
      return id;
    }
  }, {
    key: "removePlot",
    value: function removePlot(plotId) {
      this.plots = this.plots.filter(function (_ref26) {
        var _ref27 = _slicedToArray(_ref26, 1),
            id = _ref27[0];

        return id !== plotId;
      });
      this.render();
    }
  }, {
    key: "getPlotIds",
    value: function getPlotIds() {
      return this.plots.map(function (_ref28) {
        var _ref29 = _slicedToArray(_ref28, 1),
            id = _ref29[0];

        return id;
      });
    }
  }, {
    key: "setLabels",
    value: function setLabels(plotId, labels) {
      assert(lodashEs.includes(this.getPlotIds(), plotId), "Unknown plot ID: \"".concat(plotId, "\""));
      assert(lodashEs.isArray(labels), "Labels must be an array but is: ".concat(labels));
      var plotData = lodashEs.get(this.data, plotId, {});
      plotData.labels = labels;
      this.data[plotId] = plotData;
      this.render();
    }
  }, {
    key: "setData",
    value: function setData(plotId, data) {
      assert(lodashEs.includes(this.getPlotIds(), plotId), "Unknown plot ID: \"".concat(plotId, "\""));
      assert(lodashEs.isArray(data), "Data must be an array but is: ".concat(data));
      var plotData = lodashEs.get(this.data, plotId, {});
      plotData.data = data;
      this.data[plotId] = plotData;
      this.render();
    }
  }, {
    key: "setSelectedBin",
    value: function setSelectedBin(idx) {
      this.selectedBin = idx;
      this.render();
    }
  }]);

  return Explorer;
}();

/**
 * Data Format:
 * 
 * Every bin is a list where every element represents a row.
 * Value of a row can be either the display value between [0, 1]
 * or a tuple of values: display value and reference value. The reference
 * value is optional. It is the actual value that has been
 * used to create the display value.
 * 
 * A. Three rows with display values:
 *  `[0.3, 0.7, 0.01]`
 * B. Two rows with display and actual values:
 *  `[[0.1, 10], [0.35], 35]`
 * 
 * TODO: Display reference value. 
 */

var HeatBubblePlot =
/*#__PURE__*/
function (_Plot) {
  _inherits(HeatBubblePlot, _Plot);

  function HeatBubblePlot() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HeatBubblePlot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeatBubblePlot).call(this, options));
    _this.margin = options.margin || {
      top: 10,
      bottom: 10
    };
    _this.handlers = options.handlers || {};
    _this.colours = options.colours || {
      overlay: {
        selected: '#3333330f'
      },
      value: {
        outlierAbove: '#00ff33',
        outlierBelow: '#ff0000',
        mean: '#eeeeee'
      }
    };
    _this.fontSize = options.fontSize || 10;
    return _this;
  }

  _createClass(HeatBubblePlot, [{
    key: "renderLabels",
    value: function renderLabels(group, id, units, labels, explorer) {
      var height = explorer.getUnitSize() * units;
      var _explorer$parameters$ = explorer.parameters.labels,
          labelsOffset = _explorer$parameters$.offset,
          labelsMargin = _explorer$parameters$.margin;
      var yScale = d3.scalePoint().domain(d3.range(labels.length)).rangeRound([this.margin.top, height - this.margin.bottom]).padding(.5);
      group.selectAll('text').data(function (d) {
        return d.data;
      }).join('text').attr('transform', function (d, i) {
        return "translate(0, ".concat(yScale(i), ")");
      }).attr('dy', '0.35em').attr('x', labelsOffset - labelsMargin).attr('text-anchor', 'end').style('font-size', "".concat(this.fontSize, "px")).style('cursor', 'pointer').text(function (d) {
        return d;
      }).on('click', function (data, index) {
        var _explorer$parameters$2 = explorer.parameters.handlers.onLabelClicked,
            onLabelClicked = _explorer$parameters$2 === void 0 ? lodashEs.noop : _explorer$parameters$2;
        onLabelClicked(id, index);
      }).on('mouseover', function () {
        d3.select(this).attr('font-weight', 'bold');
      }).on('mouseout', function () {
        d3.select(this).attr('font-weight', undefined);
      });
    }
  }, {
    key: "renderStep",
    value: function renderStep(group, id, units, data, stepIndex, explorer) {
      var _this2 = this;

      var height = explorer.getUnitSize() * units;
      var usableHeight = height - this.margin.top - this.margin.bottom;
      var itemsCount = (data[stepIndex] || []).length;
      var itemHeight = usableHeight / itemsCount;
      var binWidth = explorer.getBinWidth();
      var maxCircleDiameter = lodashEs.min([itemHeight, binWidth]);
      var maxCircleRadius = maxCircleDiameter / 2 * 0.95;
      var yScale = d3.scalePoint().domain(d3.range(itemsCount)).rangeRound([this.margin.top, height - this.margin.bottom]).padding(.5); // value circle

      group.selectAll('g.values').data(function (d) {
        return [d.data || []];
      }).join('g').attr('class', 'values').attr('transform', "translate(".concat(binWidth / 2, ", 0)")).selectAll('circle').data(function (d) {
        var std = d3.deviation(d);
        var mean = d3.mean(d);
        return d.map(function (val) {
          return {
            val: val,
            mean: mean,
            std: std
          };
        });
      }).join('circle').attr('cx', 0).attr('cy', function (d, i) {
        return yScale(i);
      }).attr('fill', function (d) {
        return _this2._getColour(d);
      }).attr('r', function (d) {
        return parseFloat(d.val) > 0 ? d.val * maxCircleRadius : 0;
      });
      var colours = this.colours; // overlay mouse event catching circle

      group.selectAll('g.hotspots').data(function (d) {
        return [d.data || []];
      }).join('g').attr('class', 'hotspots').attr('transform', "translate(".concat(binWidth / 2, ", 0)")).selectAll('circle').data(function (d, stepIndex) {
        return d.map(function (value) {
          return {
            value: value,
            stepIndex: stepIndex
          };
        });
      }).join('circle').attr('cy', function (d, i) {
        return yScale(i);
      }).attr('fill', 'none').attr('r', maxCircleRadius).on('mouseover', function () {
        d3.select(this).style('fill', colours.overlay.selected);
      }).on('mouseout', function () {
        d3.select(this).style('fill', 'none');
      }).on('click', function (data, index) {
        var _this2$handlers$onVal = _this2.handlers.onValueClicked,
            onValueClicked = _this2$handlers$onVal === void 0 ? lodashEs.noop : _this2$handlers$onVal;
        onValueClicked(id, index, stepIndex);
      });
    }
  }, {
    key: "_getColour",
    value: function _getColour(d) {
      if (lodashEs.isNaN(d.val)) return 'none';
      var _this$colours$value = this.colours.value,
          colourAbove = _this$colours$value.outlierAbove,
          colourBelow = _this$colours$value.outlierBelow,
          colourNeutral = _this$colours$value.mean;

      var colour = function () {
        if (d.val > d.mean + d.std) return colourAbove;
        if (d.val < d.mean - d.std) return colourBelow;
        return colourNeutral;
      }();

      var sval = Math.abs(d.val - d.mean) * 2;
      if (sval > 1) sval = 1.0;
      if (sval < 0) sval = 0.0;
      var opacity = (55 + Math.round(sval * 200)).toString(16);
      return colour + (opacity.length === 1 ? "0".concat(opacity) : opacity);
    }
  }]);

  return HeatBubblePlot;
}(Plot);

var getDisplayValue = function getDisplayValue(d) {
  return lodashEs.isArray(d) ? d[0] : d;
};

var getReferenceValue = function getReferenceValue(d) {
  return lodashEs.isArray(d) ? d[1] : undefined;
};
/**
 * Data Format:
 * 
 * Every bin is a 1 or 2 elements list where every element represents a bar.
 * Value of a row can be either the display value between [0, 1]
 * or a tuple of values: display value and reference value. The reference
 * value is optional. It is the actual value that has been used to 
 * create the display value.
 * 
 * A. Two bars with display values:
 *  `[0.3, 0.7]`
 * B. Two bars with display and actual values:
 *  `[[0.3, 30], [0.75, 75]]`
 */


var BarPlot =
/*#__PURE__*/
function (_Plot) {
  _inherits(BarPlot, _Plot);

  function BarPlot() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BarPlot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BarPlot).call(this, options));
    _this.margin = options.margin || {
      top: 10,
      bottom: 1,
      left: 2,
      right: 2
    };
    _this.handlers = options.handlers || {};
    _this.colours = options.colours || {
      bars: ['#99999955', '#999999'],
      font: '#550',
      bubble: '#bbbbbbcc'
    };
    _this.fontSize = options.fontSize || 10;
    return _this;
  }

  _createClass(BarPlot, [{
    key: "renderLabels",
    value: function renderLabels(group, id, units, labels, explorer) {
      var _this2 = this;

      var height = explorer.getUnitSize() * units;
      var _explorer$parameters$ = explorer.parameters.labels,
          labelsOffset = _explorer$parameters$.offset,
          labelsMargin = _explorer$parameters$.margin;
      var yScale = d3.scalePoint().domain(d3.range(labels.length)).rangeRound([this.margin.top, height - this.margin.bottom]).padding(.5);
      var g = group.selectAll('g.label').data(function (d) {
        return lodashEs.reverse(lodashEs.clone(d.data));
      }).join('g').attr('class', 'label').attr('transform', function (d, i) {
        return "translate(".concat(labelsOffset - labelsMargin - 5, ", ").concat(yScale(i), ")");
      }).attr('dy', '0.35em');
      g.selectAll('text').data(function (d) {
        return [d];
      }).join('text').attr('text-anchor', 'end').text(function (d) {
        return d;
      });
      var hintSize = 10;
      g.selectAll('rect').data(function (d, idx) {
        return [idx];
      }).join('rect').attr('x', 4).attr('y', -hintSize).attr('width', hintSize).attr('height', hintSize).attr('fill', function (d) {
        return _this2.colours.bars[d];
      });
    }
  }, {
    key: "renderStep",
    value: function renderStep(group, id, units, data, stepIndex, explorer, binOffset) {
      var _this3 = this;

      var height = explorer.getUnitSize() * units;
      var binWidth = explorer.getBinWidth();
      var barWidth = binWidth * 0.9;
      var xOffset = (binWidth - barWidth) / 2;
      var usableHeight = height - this.margin.bottom - this.margin.top;
      var yScale = d3.scaleLinear().domain([0, 1]).range([usableHeight, 0]);
      group.on('mouseover', function (d) {
        var overlay = explorer.getOverlayForPlot(id);
        var data = d.data; // console.log('DDD', data)

        overlay.selectAll('g.hotspot').attr('opacity', 1).attr('transform', "translate(".concat(binOffset, ", ").concat(-_this3.fontSize * 2.5, ")")).selectAll('text').data(lodashEs.reverse(lodashEs.clone(data))).join('text').attr('text-anchor', 'middle').attr('dy', function (d, idx) {
          return _this3.fontSize * (idx + 1) + _this3.fontSize / 2;
        }).attr('dx', binWidth / 2).style('font-size', "".concat(_this3.fontSize, "px")).style('font-weight', 'bold').text(function (d) {
          var ref = getReferenceValue(d);
          var disp = getDisplayValue(d);
          return lodashEs.round(lodashEs.isFinite(ref) ? ref : disp, 2);
        }).attr('fill', _this3.colours.text).style('cursor', 'default');
      }).on('mouseout', function () {
        var overlay = explorer.getOverlayForPlot(id);
        overlay.selectAll('g.hotspot').attr('opacity', 0);
      });
      group.selectAll('rect').data(function (d) {
        return lodashEs.reverse(lodashEs.clone(d.data || []));
      }).join('rect').attr('x', xOffset).attr('y', function (d) {
        return _this3.margin.top + yScale(getDisplayValue(d) || 0);
      }).attr('width', barWidth).attr('height', function (d) {
        return usableHeight - yScale(getDisplayValue(d) || 0);
      }).attr('fill', function (d, i) {
        return _this3.colours.bars[i];
      });
    }
  }, {
    key: "renderOverlay",
    value: function renderOverlay(group, id, units, explorer) {
      var binWidth = explorer.getBinWidth();
      var height = explorer.getUnitSize() * units;
      if (!lodashEs.isFinite(binWidth)) return;
      var hotspot = group.selectAll('g.hotspot').data([null]).join('g').attr('class', 'hotspot').attr('transform', "translate(".concat(binWidth / 2 + 1, ", ").concat(height, ")")).attr('opacity', 0);
      var rectSize = this.fontSize * 3;
      hotspot.selectAll('rect').data(function (d) {
        return [d];
      }).join('rect').attr('fill', this.colours.bubble).attr('width', rectSize).attr('height', rectSize).attr('x', -rectSize / 2 + binWidth / 2).attr('rx', rectSize * 0.3);
    }
  }]);

  return BarPlot;
}(Plot);

exports.BarPlot = BarPlot;
exports.Explorer = Explorer;
exports.HeatBubblePlot = HeatBubblePlot;

Object.defineProperty(exports, '__esModule', { value: true });

}));
