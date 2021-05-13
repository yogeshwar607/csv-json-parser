# CsvToJson Parser

CsvToJson Parser is node based library converting CSV text into arrays / objects. It implements the Node.js stream API and es2018 aysnc generators iterables.

## Usage

```
const { csvToJson,
        jsonToCsv,
        csvToJsonFromFile,
        csvToJsonFromUrl,
        jsonToCsvFromFile } 
        = require('csv-json-parser')
```
##Config Options
## csvToJson
```
// const { outputMode = 'string', delimiter = ',', skipComments = false,  headers = false, , headersArray = [] } = config

```

| option       | description        | default
| :------------- | :----------------- | :---------|
|file|valid file path |
|url | url implementing file protocol|
|csvString| csv string|
|  outputMode | stream or string  | stream|   
| delimiter   |,,:,#,@,!,\t,^,* | , |
| skipComments   |false or true | false |
| headers|false or true |false|
|headersArray|[array]| []


# jsonToCsv
```
// const { outputMode = 'string', delimiter = ',', skipComments = false,  headers = false, , headersArray = [] } = config

```

| option       | description        | default
| :------------- | :----------------- | :---------|
|file|valid file path |
|url | url implementing file protocol|
|jsonString| json string|
|  outputMode | stream or string  | stream|   
| delimiter   |,,:,#,@,!,\t,^,* | , |
| newline:    |"\n" or "\r\n"| "\n" |
| headers|false or true |false|
|quoteChar|'  "| "|


##Examples
```
 const csvString = `policyID>statecode>county>eq_site_limit>hu_site_limit>fl_site_limit>fr_site_limit>tiv_2011>tiv_2012>eq_site_deductible>hu_site_deductible>fl_site_deductible>fr_site_deductible>point_latitude>point_longitude>line>construction>point_granularity
    223488>FL>CLAY COUNTY>328500>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1`

    // custom headers
    const headersArr = ["jkjl", "fr_site_limit", "tiv_2011", "tiv_2012", "fr_site", "tiv_20177", "tiv_201776", "1", "2", "3", "4", "5", "6", "7", "8", "policyID", "statecode", "county"]

    // comsuming using for csv string 
    const output = await csvToJson({ csvString, delimiter: '>', outputMode: 'string', headers: headersArr })
    console.log(output)

    // output as string 
    const string = await csvToJson({ path: 'small.csv', delimiter: ',', outputMode: 'string', headers: true, skipComments: true })

    const streamForAwait = await csvToJson({ path: 'sample.csv', delimiter: ',', outputMode: 'stream', headers: true })

    // comsuming using for await 
    for await (const line of streamForAwait) {
      // console.log("\n", line);
    }

    // consuming using streams
    const stream = await csvToJson({ path: 'sample.csv', delimiter: ',', outputMode: 'stream', headers: true })

    stream.on('data', (data) => {
      // console.log(data)
    })

    stream.on('end', () => {
      // console.log("stream end")
    })

```

Refer ./examples folder for more details

## Test

```
npm run test
```
##ToDo 

- Should be able to handle errors, continue parsing even for ambiguous CSV's and return the errors for each row
- Make your library Universal JavaScript (aka isomorphic JavaScript).
- Support worker thread by passing a config. That is, the computation will not happen on main thread but on worker threads.
- Auto detect the delimiter


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)