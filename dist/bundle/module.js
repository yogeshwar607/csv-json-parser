import { Readable } from 'stream';
import { createReadStream } from 'fs';

function transformForDelimiter(valuesArray, delimiter) {
  if (valuesArray instanceof Array) {
    return valuesArray.map((element) => {
      return element.split(delimiter).join(',')
    })
  }
}

function getHeaderRow(valuesArray, { headers, delimiter = ',' }, counter) {
  // operate here on valuess
  let headersArray = [];
  if (valuesArray instanceof Array) {
    if (counter === 1) {
      // this chunks have headers row
      if (headers === true) {
        headersArray = valuesArray[0].split(delimiter);
      }
      else {
        headersArray = headers;
        // Todo: - check length of new headers = old headers
      }
    }
    return headersArray
  }
}

function transformForHeader(valuesArray, headersArray, counter) {
  if (counter === 1) {
    // remove header row
    valuesArray.shift();
  }
  return valuesArray.reduce((arr, element) => {
    const splittedValues = element.split(',');
    const rowObj = splittedValues.reduce((obj, value, i) => {
      const keyName = headersArray[i];
      const objProp = {};
      objProp[keyName] = value;
      return { ...obj, ...objProp }
    }, {});
    return [...arr, rowObj]
  }, [])
}

function transformForSkipComments(valuesArray, commentChar) {
  if (valuesArray instanceof Array) {
    return valuesArray.filter((element) => {
      const len = element.length;
      return !(element[0] === commentChar || element[len - 1] === commentChar)
    })
  }
}

function transformation(values, config, counter) {
  const { delimiter = ',', skipComments = false, headersArray = [] } = config;

  let valuesArray = values;

  // check for delimiter
  valuesArray = delimiter === ',' ? valuesArray : transformForDelimiter(valuesArray, delimiter);
  // check for skip Comments
  valuesArray = skipComments === false ? valuesArray : transformForSkipComments(valuesArray, '#');

  if (headersArray.length) {
    // iterated and make object 
    valuesArray = transformForHeader(valuesArray, headersArray, counter);
  }
  return valuesArray
}



// generates lines from a csv  stream 
async function* csvLines(chunkStream) {
  try {
    let remainingLine = ''; // chunk may ends in the middle of a line
    for await (const chunk of chunkStream) {
      const linesFromChunk = (remainingLine + chunk).split('\n');
      remainingLine = linesFromChunk.pop();
      yield linesFromChunk;
    }
    yield remainingLine;
  } catch (error) {
    throw error
  }
}

// parser     
async function* csvToJsonParser(source, config) {
  try {
    const { headers = false } = config;
    let counter = 0;
    for await (let values of csvLines(source)) {
      ++counter; // to check if first record is in chunk
      // check for headers
      const headersArray = headers === false ? [] : getHeaderRow(values, config, counter);
      yield transformation(values, { ...config, headersArray }, counter);
    }
  } catch (error) {
    throw error
  }
}

// generates csv compatible string  from json stream 
async function* csvStrings(chunkStream) {
  try {
    for await (const chunk of chunkStream) {
      yield chunk
        .toString()
        .replace(/("\w{1,}":)|[\r\n\s{[\]]/g, '')
        .trim()
        .replace(/},|}/g, "\n");
    }
  } catch (error) {
    throw error
  }
}
function transformForDelimiter$1(valuesArray, delimiter) {
  if (valuesArray instanceof Array) {
    return valuesArray.map((element) => {
      return element.split(',').join(delimiter)
    })
  }
}

function transformation$1(values, config) {
  const { delimiter = ',', newlineChar = '\n' } = config;
  let valuesArray = values.split(newlineChar);
  // check for delimiter
  valuesArray = delimiter === ',' ? valuesArray : transformForDelimiter$1(valuesArray, delimiter);
  return valuesArray
}

// parser     
async function* jsonToCsvParser(source, config) {
  try {
    const { headers = false, delimiter = ',' } = config;
    for await (let values of csvStrings(source)) {
      yield transformation$1(values, { ...config, });
    }
  } catch (error) {
    throw error
  }
}

const streamFromFile = (file, opts = { encoding: 'utf8' }) => {
  try {
    if (!file) throw new Error("file path not provided")
    return createReadStream(file, opts)
  } catch (error) {
    throw error
  }
};
const streamFromString = (string, opts = { encoding: 'utf8' }) => {
  try {
    if (!string) throw new Error("string not provided")
    return Readable.from(string)
  } catch (error) {
    throw error
  }
};

const streamFromUrl = (url, opts = { encoding: 'utf8' }) => {
  try {
    if (!url) throw new Error("url not provided")
    // Todo:
    // send Stream Object from here
    return createReadStream(url, opts) // provided url uses file protocol
  } catch (error) {
    throw error
  }
};

async function csvToJson(config) {
  return new Promise((resolve, reject) => {
    try {
      const { csvString, path, url, outputMode = 'stream' } = config;
      let stream;
      if (path) {
        stream = Readable.from(csvToJsonParser(streamFromFile(path), config));
      }
      else if (url) {
        stream = Readable.from(csvToJsonParser(streamFromUrl(url), config));
      } else if (csvString) {
        stream = Readable.from(csvToJsonParser(streamFromString(csvString), config));
      }
      else {
        throw Error('Provide either path , url or csvString')
      }
      if (outputMode === 'string') {
        let output = [];
        stream.on('data', (data) => {
          if (data) {
            output = [...output, ...data];
          }
        });
        stream.on('end', () => {
          resolve(output);
        });
      }

      if (outputMode === 'stream') {
        return resolve(stream)
      }

    } catch (error) {
      reject(error.message);
    }
  })
  .catch(error => console.log('Error:', error))
}

async function jsonToCsv(config) {
  return new Promise((resolve, reject) => {
    try {
      const { jsonString, path, url, outputMode = 'stream' } = config;
      let stream;
      if (path) {
        stream = Readable.from(jsonToCsvParser(streamFromFile(path), config));
      }
      else if (url) {
        stream = Readable.from(jsonToCsvParser(streamFromUrl(url), config));
      } else if (jsonString) {
        stream = Readable.from(jsonToCsvParser(streamFromString(jsonString), config));
      }
      else {
        throw Error('Provide either path , url or jsonString')
      }
      if (outputMode === 'string') {
        let output = [];
        stream.on('data', (data) => {
          if (data) {
            output = [...output, ...data];
          }
        });
        stream.on('end', () => {
          resolve(output);
        });
      }

      if (outputMode === 'stream') {
        return resolve(stream)
      }

    } catch (error) {
      reject(error.message);
    }
  })
  .catch(error => console.log('Error:', error))
}

async function csvToJsonFromFile(config) {
  try {
    return await csvToJson(config)
  } catch (error) {
    throw error
  }

}

async function csvToJsonFromUrl(config) {
  try {
    return await csvToJson(config)
  } catch (error) {
    throw error
  }
}

async function jsonToCsvFromFile(config) {
  try {
    return await jsonToCsv(config)
  } catch (error) {
    throw error
  }

}

async function jsonToCsvFromUrl(config) {
  try {
    return await jsonToCsv(config)
  } catch (error) {
    throw error
  }
}

try {

  (async function () {

    const csvString = `policyID>statecode>county>eq_site_limit>hu_site_limit>fl_site_limit>fr_site_limit>tiv_2011>tiv_2012>eq_site_deductible>hu_site_deductible>fl_site_deductible>fr_site_deductible>point_latitude>point_longitude>line>construction>point_granularity
    223488>FL>CLAY COUNTY>328500>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1
    22345>FL> COUNTY>328555>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1
    `;

    // custom headers
    const headersArr = ["jkjl", "fr_site_limit", "tiv_2011", "tiv_2012", "fr_site", "tiv_20177", "tiv_201776", "1", "2", "3", "4", "5", "6", "7", "8", "policyID", "statecode", "county"];

    // comsuming using for csv string 
    const output = await csvToJson({ csvString, delimiter: '>', outputMode: 'string', headers: headersArr });
    console.log(output);

    // output as string 
    const string = await csvToJson({ path: '../samples/sample.csv', delimiter: ',', outputMode: 'string', headers: true, skipComments: true });

    const streamForAwait = await csvToJson({ path: '../samples/small.csv', delimiter: ',', outputMode: 'stream', headers: true });

    // comsuming using for await 
    for await (const line of streamForAwait) {
      console.log("\n", line);
    }

    // consuming using streams
    const stream = await csvToJson({ path: '../samples/small.csv', delimiter: ',', outputMode: 'stream', headers: true });

    stream.on('data', (data) => {
      console.log(data);
    });

    stream.on('end', () => {
      console.log("stream end");
    });
  })();

} catch (error) {
  console.log(error);
}


// options 
// const { outputMode = 'string', delimiter = ',', skipComments = false, chunks = true, transformHeader = undefined, headers = false, transform = undefined, headersArray = [] } = config

export { csvToJson, csvToJsonFromFile, csvToJsonFromUrl, jsonToCsv, jsonToCsvFromFile, jsonToCsvFromUrl };
