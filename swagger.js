const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'National Park Planner',
    description: 'Provides access to information about various national parks across the country. Users can retrieve details such as park locations, visitor information, activities available, supplies needed, and more. This API is designed to help people plan trips to national parks, making it easier for users to discover and explore natural treasures of the country'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];


swaggerAutogen(outputFile, routes, doc);