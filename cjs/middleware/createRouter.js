"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouter = void 0;

var _simple = _interopRequireDefault(require("../lib/stateMappings/simple"));

var _history = _interopRequireDefault(require("../lib/routers/history"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var walk = function walk(current, callback) {
  callback(current);
  current.getWidgets().filter(function (widget) {
    return widget.$$type === 'ais.index';
  }).forEach(function (innerIndex) {
    walk(innerIndex, callback);
  });
};

var createRouter = function createRouter() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _props$router = props.router,
      router = _props$router === void 0 ? (0, _history.default)() : _props$router,
      _props$stateMapping = props.stateMapping,
      stateMapping = _props$stateMapping === void 0 ? (0, _simple.default)() : _props$stateMapping;
  return function (_ref) {
    var instantSearchInstance = _ref.instantSearchInstance;

    function topLevelCreateURL(nextState) {
      var uiState = Object.keys(nextState).reduce(function (acc, indexId) {
        return _objectSpread({}, acc, _defineProperty({}, indexId, nextState[indexId]));
      }, instantSearchInstance.mainIndex.getWidgetState({}));
      var route = stateMapping.stateToRoute(uiState);
      return router.createURL(route);
    }

    instantSearchInstance._createURL = topLevelCreateURL;
    instantSearchInstance._initialUiState = _objectSpread({}, instantSearchInstance._initialUiState, {}, stateMapping.routeToState(router.read()));
    return {
      onStateChange: function onStateChange(_ref2) {
        var uiState = _ref2.uiState;
        var route = stateMapping.stateToRoute(uiState);
        router.write(route);
      },
      subscribe: function subscribe() {
        router.onUpdate(function (route) {
          var uiState = stateMapping.routeToState(route);
          walk(instantSearchInstance.mainIndex, function (current) {
            var widgets = current.getWidgets();
            var indexUiState = uiState[current.getIndexId()] || {};
            var searchParameters = widgets.reduce(function (parameters, widget) {
              if (!widget.getWidgetSearchParameters) {
                return parameters;
              }

              return widget.getWidgetSearchParameters(parameters, {
                uiState: indexUiState
              });
            }, current.getHelper().state);
            current.getHelper().overrideStateWithoutTriggeringChangeEvent(searchParameters);
            instantSearchInstance.scheduleSearch();
          });
        });
      },
      unsubscribe: function unsubscribe() {
        router.dispose();
      }
    };
  };
};

exports.createRouter = createRouter;