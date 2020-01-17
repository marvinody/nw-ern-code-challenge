const assert = require('assert')
const rp = require('request-promise')

const getTempForCoords = async (lat, long) => {
  const resp = await rp({
    uri: `https://api.darksky.net/forecast/4d51fbb64d23886e24bc76aa280a1497/${lat},${long}`,
    json: true
  })
  const temp = resp.currently.temperature
  console.log(resp.currently)
  console.log({ temp })
  return Math.round(temp)
}


describe('Dark Sky Temp readings', () => {
  it('should have the correct temperature', () => {
    browser.url('https://darksky.net')

    const originalTitle = browser.getTitle()

    // jquery like selector
    const location = $('#searchForm input')
    location.setValue('10001')
    // location.setValue('West 30th Street, New York, NY')

    const button = $('a.searchButton')
    button.click()
    // wait until it loads a new page
    // not sure of a way to do this if input is located in the area already
    browser.waitUntil(() => browser.getTitle() !== originalTitle, 5000)
    const span = $('span.summary.swap')
    const tempText = span.getText()
    // grab any numbers out of the text, should only be the temp and grab capture group
    const parsedTemp = tempText.match(/(\d+)/)[1]


    const apiTemp = browser.call(() => getTempForCoords(40.7506, -73.9971))
    // console.log(getTempForCoords(40.7506, -73.9971))
    console.log({ apiTemp })
    assert.equal(parsedTemp, apiTemp)

  })
})
