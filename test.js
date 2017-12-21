const DDCrypt = require('./index');
const _ = require('lodash');

let config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    kms: {
        KeyId: process.env.AWS_KMS_ARN,
    }
}

if (_.isEmpty(config.region)) {
    console.log('missing env AWS_REGION');
    return;
}

if (_.isEmpty(config.accessKeyId)) {
    console.log('missing env AWS_ACCESS_KEY_ID');
    return;
}

if (_.isEmpty(config.secretAccessKey)) {
    console.log('missing env AWS_SECRET_ACCESS_KEY');
    return;
}

if (_.isEmpty(config.kms.KeyId)) {
    console.log('missing env AWS_KMS_ARN');
    return;
}

let ddcrypt = new DDCrypt(config);

console.time('encrypt');
ddcrypt.encrypt({ name: 'renaldo', gender: 'male' })
    .then(result => {
        console.timeEnd('encrypt');
        console.log(result);
        console.time('decrypt');
        return ddcrypt.decrypt(result.CiphertextBlob);
    })
    .then(result => {
        console.timeEnd('decrypt');
        console.log(result, typeof result);
    })
    .catch(err => console.error(err));
