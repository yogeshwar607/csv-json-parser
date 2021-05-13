// generates csv compatible string  from json stream 
async function* csvStrings(chunkStream) {
  try {
    for await (const chunk of chunkStream) {
      yield chunk
        .toString()
        .replace(/("\w{1,}":)|[\r\n\s{[\]]/g, '')
        .trim()
        .replace(/},|}/g, "\n")
    }
  } catch (error) {
    throw error
  }
}
function transformForDelimiter(valuesArray, delimiter) {
  if (valuesArray instanceof Array) {
    return valuesArray.map((element) => {
      return element.split(',').join(delimiter)
    })
  }
}

function transformation(values, config) {
  const { delimiter = ',', newlineChar = '\n' } = config
  let valuesArray = values.split(newlineChar);
  // check for delimiter
  valuesArray = delimiter === ',' ? valuesArray : transformForDelimiter(valuesArray, delimiter)
  return valuesArray
}

// parser     
export async function* jsonToCsvParser(source, config) {
  try {
    const { headers = false, delimiter = ',' } = config
    for await (let values of csvStrings(source)) {
      yield transformation(values, { ...config, })
    }
  } catch (error) {
    throw error
  }
}
