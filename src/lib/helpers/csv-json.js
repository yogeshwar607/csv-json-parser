
function transformForDelimiter(valuesArray, delimiter) {
  if (valuesArray instanceof Array) {
    return valuesArray.map((element) => {
      return element.split(delimiter).join(',')
    })
  }
}

function getHeaderRow(valuesArray, { headers, delimiter = ',' }, counter) {
  // operate here on valuess
  let headersArray = []
  if (valuesArray instanceof Array) {
    if (counter === 1) {
      // this chunks have headers row
      if (headers === true) {
        headersArray = valuesArray[0].split(delimiter)
      }
      else {
        headersArray = headers
        // Todo: - check length of new headers = old headers
      }
    }
    return headersArray
  }
}

function transformForHeader(valuesArray, headersArray, counter) {
  if (counter === 1) {
    // remove header row
    valuesArray.shift()
  }
  return valuesArray.reduce((arr, element) => {
    const splittedValues = element.split(',')
    const rowObj = splittedValues.reduce((obj, value, i) => {
      const keyName = headersArray[i];
      const objProp = {}
      objProp[keyName] = value
      return { ...obj, ...objProp }
    }, {})
    return [...arr, rowObj]
  }, [])
}

function transformForSkipComments(valuesArray, commentChar) {
  if (valuesArray instanceof Array) {
    return valuesArray.filter((element) => {
      const len = element.length
      return !(element[0] === commentChar || element[len - 1] === commentChar)
    })
  }
}

function transformation(values, config, counter) {
  const { delimiter = ',', skipComments = false, headersArray = [] } = config

  let valuesArray = values;

  // check for delimiter
  valuesArray = delimiter === ',' ? valuesArray : transformForDelimiter(valuesArray, delimiter)
  // check for skip Comments
  valuesArray = skipComments === false ? valuesArray : transformForSkipComments(valuesArray, '#')

  if (headersArray.length) {
    // iterated and make object 
    valuesArray = transformForHeader(valuesArray, headersArray, counter)
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
    const { headers = false } = config
    let counter = 0;
    for await (let values of csvLines(source)) {
      ++counter // to check if first record is in chunk
      // check for headers
      const headersArray = headers === false ? [] : getHeaderRow(values, config, counter)
      yield transformation(values, { ...config, headersArray }, counter)
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  csvToJsonParser
}