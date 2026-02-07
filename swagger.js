const swaggerAutogen = require('swagger-autogen')();

const host = process.env.SWAGGER_HOST || `localhost:${process.env.PORT || 3000}`;
const schemes = process.env.SWAGGER_SCHEMES
  ? process.env.SWAGGER_SCHEMES.split(',')
  : [process.env.NODE_ENV === 'production' ? 'https' : 'http'];

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
