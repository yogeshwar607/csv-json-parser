'use strict';

const { jsonToCsvFromUrl,
  jsonToCsvFromFile,
  csvToJsonFromUrl,
  csvToJsonFromFile,
  jsonToCsv,
  csvToJson } = require('./lib/parser.js');

module.exports = {
  jsonToCsvFromUrl,
  jsonToCsvFromFile,
  csvToJsonFromUrl,
  csvToJsonFromFile,
  jsonToCsv,
  csvToJson
};

// options 
// const { outputMode = 'string', delimiter = ',', skipComments = false, chunks = true, transformHeader = undefined, headers = false, transform = undefined, headersArray = [] } = config
