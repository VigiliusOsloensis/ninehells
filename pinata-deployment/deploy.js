const credentials = require('./credentials.json');
const pinataSDK = require('@pinata/sdk');

const pinataApiKey = credentials.apiKey;
const pinataSecretApiKey = credentials.privateApiKey;
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});