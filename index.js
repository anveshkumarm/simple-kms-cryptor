const AWS = require('aws-sdk');
const _ = require('lodash');




function encrypt(input, outputType) {
    if (_.isNil(input)) {
        return Promise.reject(new Error('missing argument to encrypt'));
    }

    let kms = this.kms;

    let plaintext = '';

    if (_.isString(input)) {
        let x = {
            data: input,
            type: 'string'
        }
        plaintext = Buffer.from(JSON.stringify(x), 'utf8');
    }
    else if (_.isNumber(input)) {
        let x = {
            data: input,
            type: 'number'
        }
        plaintext = Buffer.from(JSON.stringify(x), 'utf8');
    }
    else if (_.isObject(input)) {
        let x = {
            data: input,
            type: 'object'
        }
        plaintext = Buffer.from(JSON.stringify(x), 'utf8');
    }

    let params = {
        KeyId: this.config.kms.KeyId,
        Plaintext: plaintext
    }

    return new Promise((resolve, reject) => {
        kms.encrypt(params, function (err, data) {
            if (err) {
                throw err;
            }
    
            if (outputType === 'base64') {
                resolve(data.CiphertextBlob.toString('base64'));
                return;
            }

            resolve(data.CiphertextBlob);
        });
    })
}

function decrypt(ciphertext, inputType) {
    let kms = this.kms; //new AWS.KMS(this.config);

    let binaryBlob = ciphertext;

    if (inputType === 'base64') {
        if (!_.isString(ciphertext)) {
            return Promise.reject(new Error('ciphertext is not a base64 string'))
        }    
        binaryBlob = new Buffer(ciphertext, 'base64');
    }

    let params = {
        CiphertextBlob: binaryBlob
    }

    return new Promise((resolve, reject) => {
        kms.decrypt(params, (err, data) => {
            if (err) {
                throw err;
            }

            let jsonString = data.Plaintext.toString('utf8');
            let obj = JSON.parse(jsonString);

            let result = null;

            if (obj.type === 'string') {
                result = obj.data;
            }
            else if (obj.type === 'number') {
                result = Number(obj.data);
            }
            else if (obj.type === 'object') {
                result = obj.data;
            }

            resolve(result);
        })
    })
}

function KMSCrypto(config) {
    if (_.isEmpty(config)) {
        throw new Error('missing config');
    }
    this.config = config;
    this.kms = new AWS.KMS(this.config);
}

KMSCrypto.prototype = {
    encrypt,
    decrypt
}

module.exports = KMSCrypto;

