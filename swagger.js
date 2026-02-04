const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'StockFlow API',
    description: 'Inventory and Orders API'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
