# Simple KMS Cryptor
Simple cryptor library for encrypting object using AWS KMS key

[![Build Status](https://travis-ci.org/renaldonoma/simple-kms-cryptor.svg?branch=master)](https://travis-ci.org/renaldonoma/simple-kms-cryptor)

## Usage Example

### Prepare the config
The config is compatible directly with the AWS.KMS options as specified here:
- [AWS.KMS options](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property)

Example of config:
```js
let config = {
    region: '<your aws region here>',
    accessKeyId: '<your aws access key id here>',
    secretAccessKey: '<your aws secret access key>',
    kms: {
        KeyId: '<kms key ARN or KeyId>',
    }
}
```

### Creating instance
```js
const KMSCrypt = require('simple-kms-crypto');

let kmscrypt = new KMSCrypt(config);
```


### Encrypting object
`encrypt` method will return a promise

- Encrypting `plaintext` to a byte array
```js
let plaintext = 'secret text';
kmscrypt.encrypt(plaintext)
  .then(ciphertext => {
      /*
          ciphertext will be a Buffer with holding the encrypted data as byte array
      */
  })
  .catch(err => {
      /*
          encryption failed
      */
  })
```

- Encrypting `plaintext` to a byte array
```js
let plaintext = 'secret text';
kmscrypt.encrypt(plaintext)
  .then(ciphertext => {
      /*
          ciphertext will be a Buffer with holding the encrypted data as byte array
      */
  })
  .catch(err => {
      /*
          encryption failed
      */
  })
```

### Decrypting object
`decrypt` method will return a promise

- If `ciphertext` is a byte array
```js
kmscrypt.decrypt(ciphertext)
    .then(plaintext => {
        /*
            plaintext is decrypted object
        */    
    })
    .catch(err => {
        /*
            decryption failed
        */
    })
```

- If `ciphertext` is base64 encoded
```js
kmscrypt.decrypt(ciphertext, 'base64')
    .then(plaintext => {
        /*
            plaintext is decrypted object
        */    
    })
    .catch(err => {
        /*
            decryption failed
        */
    })
```

## Methods
`encrypt(plaintext, encryptionType) => Promise`
- `plaintext` is the object to be encrypted. Supported format: `string`, `object`, `number`
- `encryptionType`: base64 | binary (default)


`decrypt(ciphertext, cipherType) => Promise`
- `ciphertext` is the encrypted data formatted as binary or base64
- `cipherType` is the type of `ciphertext` which can be base64 or binary

