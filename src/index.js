export * from './lib/parser.mjs'

import { Readable } from 'stream';

import { csvToJson } from './lib/parser.mjs'

try {

  (async function () {

    const csvString = `policyID>statecode>county>eq_site_limit>hu_site_limit>fl_site_limit>fr_site_limit>tiv_2011>tiv_2012>eq_site_deductible>hu_site_deductible>fl_site_deductible>fr_site_deductible>point_latitude>point_longitude>line>construction>point_granularity
    223488>FL>CLAY COUNTY>328500>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1
    22345>FL> COUNTY>328555>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1
    `

    // custom headers
    const headersArr = ["jkjl", "fr_site_limit", "tiv_2011", "tiv_2012", "fr_site", "tiv_20177", "tiv_201776", "1", "2", "3", "4", "5", "6", "7", "8", "policyID", "statecode", "county"]

    // comsuming using for csv string 
    const output = await csvToJson({ csvString, delimiter: '>', outputMode: 'string', headers: headersArr })
    console.log(output)

    // output as string 
    const string = await csvToJson({ path: '../samples/sample.csv', delimiter: ',', outputMode: 'string', headers: true, skipComments: true })

    const streamForAwait = await csvToJson({ path: '../samples/small.csv', delimiter: ',', outputMode: 'stream', headers: true })

    // comsuming using for await 
    for await (const line of streamForAwait) {
      console.log("\n", line);
    }

    // consuming using streams
    const stream = await csvToJson({ path: '../samples/small.csv', delimiter: ',', outputMode: 'stream', headers: true })

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


// options 
// const { outputMode = 'string', delimiter = ',', skipComments = false, chunks = true, transformHeader = undefined, headers = false, transform = undefined, headersArray = [] } = config
