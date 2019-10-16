"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var parseUpstream = exports.parseUpstream = function parseUpstream(_ref) {
    var name = _ref.name,
        slots = _ref.slots,
        id = _ref.id,
        created_at = _ref.created_at,
        orderlist = _ref.orderlist;

    return {
        name: name,
        attributes: {
            slots: slots
        },
        _info: {
            id: id,
            created_at: created_at,
            orderlist: orderlist
        }
    };
};

var parseUpstreams = function parseUpstreams(upstreams) {
    return upstreams.map(function (upstream) {
        var _parseUpstream = parseUpstream(upstream),
            name = _parseUpstream.name,
            rest = _objectWithoutProperties(_parseUpstream, ["name"]);

        return _extends({ name: name, targets: parseUpstreamTargets(upstream.targets) }, rest);
    });
};

exports.parseUpstreams = parseUpstreams;
var parseTarget = exports.parseTarget = function parseTarget(_ref2) {
    var target = _ref2.target,
        weight = _ref2.weight,
        id = _ref2.id,
        upstream_id = _ref2.upstream_id,
        created_at = _ref2.created_at;

    return {
        target: target,
        attributes: {
            weight: weight
        },
        _info: {
            id: id,
            upstream_id: upstream_id,
            created_at: created_at
        }
    };
};

function parseUpstreamTargets(targets) {
    if (!Array.isArray(targets)) {
        return [];
    }

    return targets.map(parseTarget);
}