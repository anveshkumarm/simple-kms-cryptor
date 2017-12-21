const KMSCrypt = require('../index');
const _ = require('lodash');

const config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    kms: {
        KeyId: process.env.AWS_KMS_ARN,
    }
}


describe('checking AWS credentials', () => {
    test('checking region', () => {
        expect(config.region).not.toBeNull();
    });

    test('checking access key id', () => {
        expect(config.accessKeyId).not.toBeNull();
    });

    test('checking secret access key', () => {
        expect(config.secretAccessKey).not.toBeNull();
    });

    test('kms key id', () => {
        expect(config.kms.KeyId).not.toBeNull();
    });
})

describe('testing direct encrypt/decrypt', () => {
    let kmscrypt = null;

    beforeAll(() => {
        kmscrypt = new KMSCrypt(config);
    }, 500);

    test('test encrypt/decrypt object', () => {
        expect.assertions(1);

        return kmscrypt.encrypt({ name: 'john', gender: 'male' })
            .then(result => {
                return kmscrypt.decrypt(result);
            })
            .then(result => {
                expect(result).toEqual({ name: 'john', gender: 'male' });
            })
    });

    test('test encrypt/decrypt string', () => {
        expect.assertions(1);
        return kmscrypt.encrypt('hello world')
            .then(result => {
                return kmscrypt.decrypt(result);
            })
            .then(result => {
                expect(result).toEqual('hello world');
            })
    });

    test('test encrypt/decrypt number', () => {
        expect.assertions(1);

        return kmscrypt.encrypt(567)
            .then(result => {
                return kmscrypt.decrypt(result);
            })
            .then(result => {
                expect(result).toEqual(567);
            });
    });
});

describe('testing base64 encrypt/decrypt', () => {
    let kmscrypt = null;

    beforeAll(() => {
        kmscrypt = new KMSCrypt(config);
    }, 500);

    test('test base64 encrypt/decrypt object', () => {
        expect.assertions(1);

        return kmscrypt.encrypt({ name: 'john', gender: 'male' },'base64')
            .then(result => {
                return kmscrypt.decrypt(result, 'base64');
            })
            .then(result => {
                expect(result).toEqual({ name: 'john', gender: 'male' });
            })
    });

    test('test base64 encrypt/decrypt string', () => {
        let testObj = 'hello world';
        expect.assertions(1);

        return kmscrypt.encrypt('hello world','base64')
            .then(result => {
                return kmscrypt.decrypt(result, 'base64');
            })
            .then(result => {
                expect(result).toEqual('hello world');
            })
    });

    test('test base64 encrypt/decrypt number', () => {
        expect.assertions(1);

        return kmscrypt.encrypt(567,'base64')
            .then(result => {
                return kmscrypt.decrypt(result, 'base64');
            })
            .then(result => {
                expect(result).toEqual(567);
            })
    });

    test('test descrypt with non base64 ciphertext', () => {
        expect.assertions(1);

        return kmscrypt.encrypt(567,'base64')
            .then(result => {
                return kmscrypt.decrypt(567, 'base64');
            })
            .catch(err => {
                expect(err).toBeDefined();
            });
    });
})

