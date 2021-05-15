const {
  csvToJson,
  jsonToCsv
} = require('../src/index')
const Readable = require('stream')

describe('output is instance of Streams', function () {
  test("output should be instance of streams", async () => {
    const output = await csvToJson({ path: './samples/small.csv', delimiter: ',', outputMode: 'stream', headers: true, skipComments: true })
    expect(output instanceof (Readable)).toBe(true)
  })
})

describe('csv to json parse', function () {
  test('function return type test', () => {
    expect(typeof csvToJson).toBe('function')
  })

  test('it should convert a string of csv to a json string', async function () {
    const csvString = `policyID>statecode>county>eq_site_limit>hu_site_limit>fl_site_limit>fr_site_limit>tiv_2011>tiv_2012>eq_site_deductible>hu_site_deductible>fl_site_deductible>fr_site_deductible>point_latitude>point_longitude>line>construction>point_granularity
    223488>FL>CLAY COUNTY>328500>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1
    22345>FL> COUNTY>328555>328500>328500>328500>328500>348374.25>0>16425>0>0>30.102217>-81.707146>Residential>Wood>1
    `
    const expected = [
      {
        policyID: '    223488',
        statecode: 'FL',
        county: 'CLAY COUNTY',
        eq_site_limit: '328500',
        hu_site_limit: '328500',
        fl_site_limit: '328500',
        fr_site_limit: '328500',
        tiv_2011: '328500',
        tiv_2012: '348374.25',
        eq_site_deductible: '0',
        hu_site_deductible: '16425',
        fl_site_deductible: '0',
        fr_site_deductible: '0',
        point_latitude: '30.102217',
        point_longitude: '-81.707146',
        line: 'Residential',
        construction: 'Wood',
        point_granularity: '1'
      },
      {
        policyID: '    22345',
        statecode: 'FL',
        county: ' COUNTY',
        eq_site_limit: '328555',
        hu_site_limit: '328500',
        fl_site_limit: '328500',
        fr_site_limit: '328500',
        tiv_2011: '328500',
        tiv_2012: '348374.25',
        eq_site_deductible: '0',
        hu_site_deductible: '16425',
        fl_site_deductible: '0',
        fr_site_deductible: '0',
        point_latitude: '30.102217',
        point_longitude: '-81.707146',
        line: 'Residential',
        construction: 'Wood',
        point_granularity: '1'
      }
    ]

    const actual = await csvToJson({ csvString, delimiter: '>', outputMode: 'string', headers: true, skipComments: true })
    expect(actual).toEqual(expected)
  })
})




