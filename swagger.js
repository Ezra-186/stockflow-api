const swaggerAutogen = require('swagger-autogen')();

const host = process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost:3000';
const schemes = process.env.RENDER ? ['https'] : ['http'];

const doc = {
  info: {
    title: 'StockFlow API',
    description: 'Inventory and Orders API'
  },
  host,
  schemes
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './routes/index.js',
  './routes/products.js',
  './routes/customers.js',
  './routes/users.js',
  './routes/orders.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
