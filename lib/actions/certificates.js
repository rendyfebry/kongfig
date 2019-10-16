'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var addCertificate = exports.addCertificate = function addCertificate(_ref) {
    var key = _ref.key,
        cert = _ref.cert;
    return {
        type: 'create-certificate',
        endpoint: { name: 'certificates' },
        method: 'POST',
        body: { key: key, cert: cert }
    };
};

var removeCertificate = exports.removeCertificate = function removeCertificate(certificateId) {
    return {
        type: 'remove-certificate',
        endpoint: { name: 'certificate', params: { certificateId: certificateId } },
        method: 'DELETE'
    };
};

var addCertificateSNI = exports.addCertificateSNI = function addCertificateSNI(ssl_certificate_id, name) {
    return {
        type: 'add-certificate-sni',
        endpoint: { name: 'certificate-snis' },
        method: 'POST',
        body: { name: name, ssl_certificate_id: ssl_certificate_id }
    };
};

var removeCertificateSNI = exports.removeCertificateSNI = function removeCertificateSNI(sniName) {
    return {
        type: 'remove-certificate-sni',
        endpoint: { name: 'certificate-sni', params: { sniName: sniName } },
        method: 'DELETE'
    };
};