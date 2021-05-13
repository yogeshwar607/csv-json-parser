import { jsonToCsv } from '../src/lib/parser.mjs'

try {

  (async function () {

    // output as string 
    const string = await jsonToCsv({ path: './samples/sample.json', delimiter: ',', quoteChar: '"', newline: "\n", outputMode: 'string', headers: true })

    // output as streams
    const streamForAwait = await jsonToCsv({ path: './samples/sample.json', delimiter: ',', quoteChar: '"', newline: "\n", outputMode: 'stream', headers: true })

    // comsuming using for await 
    for await (const line of streamForAwait) {
      console.log("\n", line);
    }

    // consuming using streams
    const stream = await jsonToCsv({ path: './samples/sample.json', delimiter: ',', quoteChar: '"', newline: "\n", outputMode: 'stream', headers: true })

    stream.on('data', (data) => {
      console.log(data)
    })

    stream.on('end', () => {
      console.log("stream end")
    })

  })();

} catch (error) {
  console.log(error)
}

