"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = snippet;

var _utils = require("../lib/utils");

var _escapeHighlight = require("../lib/escape-highlight");

var _suit = require("../lib/suit");

var suit = (0, _suit.component)('Snippet');

function snippet(_ref) {
  var attribute = _ref.attribute,
      _ref$highlightedTagNa = _ref.highlightedTagName,
      highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa,
      hit = _ref.hit,
      _ref$cssClasses = _ref.cssClasses,
      cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
  var attributeValue = (0, _utils.getPropertyByPath)(hit, "_snippetResult.".concat(attribute, ".value")) || ''; // cx is not used, since it would be bundled as a dependency for Vue & Angular

  var className = suit({
    descendantName: 'highlighted'
  }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
  return attributeValue.replace(new RegExp(_escapeHighlight.TAG_REPLACEMENT.highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(_escapeHighlight.TAG_REPLACEMENT.highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
}