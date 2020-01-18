const assert = require('assert')
const rp = require('request-promise')

const getTempForCoords = async (lat, long) => {
  const resp = await rp({
    uri: `https://api.darksky.net/forecast/4d51fbb64d23886e24bc76aa280a1497/${lat},${long}`,
    json: true
  })
  const temp = resp.currently.temperature
  return Math.round(temp)
}

const getCoordsFromURL = (url) => {
  // format to grab them from
  //https://darksky.net/forecast/40.7506,-73.9971/us12/en
  const coordRegex = /forecast\/(-?\d+.\d+),(-?\d+.\d+)/
  const [_, lat, long] = url.match(coordRegex)
  return [lat, long]
}

describe('DarkSky Temp readings', () => {
  it('should have the correct temperature', () => {
    browser.url('https://darksky.net')

    const originalTitle = browser.getTitle()

    // jquery like selector
    const location = $('#searchForm input')
    location.setValue('11968')

    const button = $('a.searchButton')
    button.click()

    // wait until it loads a new page
    // not sure of a way to do this if input is located in the area already
    // browser.waitUntil(() => browser.getTitle() !== originalTitle, 5000)
    // FOR NOW, we'll just pause for 3s and let the new page load...should be ok enough...
    browser.pause(3000)
    // not recommended to pause but handling the 'reload' of a page when inputs
    // happen to align seems non-trivial right now

    const span = $('span.summary.swap')
    const tempText = span.getText()
    // grab any numbers out of the text, should only be the temp and grab capture group
    const parsedTemp = tempText.match(/(\d+)/)[1]

    // once darksky navigates, the url contains the coords. so let's grab them
    const [lat, long] = getCoordsFromURL(browser.getUrl())
    // and async call using rp to fetch the api
    const apiTemp = browser.call(() => getTempForCoords(lat, long))
    assert.equal(parsedTemp, apiTemp)

  })
})
