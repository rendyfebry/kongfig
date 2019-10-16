"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var parseCertificates = function parseCertificates(certs) {
    return certs.map(function (_ref) {
        var cert = _ref.cert,
            key = _ref.key,
            snis = _ref.snis,
            _info = _objectWithoutProperties(_ref, ["cert", "key", "snis"]);

        return {
            cert: cert,
            key: key,
            snis: (snis || []).map(function (name) {
                return { name: name };
            }),
            _info: _info
        };
    });
};
exports.parseCertificates = parseCertificates;