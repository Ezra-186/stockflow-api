const swaggerAutogen = require('swagger-autogen')();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const host = externalUrl
  ? externalUrl.replace('https://', '').replace('http://', '')
  : 'localhost:3000';

const schemes = externalUrl ? ['https'] : ['http'];

const doc = {
  info: {
    title: 'StockFlow API',
    description: 'Inventory and Orders API'
  },
  host,
  schemes
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
