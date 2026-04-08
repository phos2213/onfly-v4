import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// liteapi-node-sdk is a CommonJS module
const liteApiSdk = require('liteapi-node-sdk');
const liteApi = liteApiSdk(process.env.LITEAPI_KEY);

export default liteApi;
