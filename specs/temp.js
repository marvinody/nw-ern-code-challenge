const assert = require('assert')

const { getCoordsFromURL, getTempForCoords } = require('./utils')


describe('DarkSky Temp readings', () => {
  it('should have the correct temperature', () => {
    browser.url('https://darksky.net')

    const originalTitle = browser.getTitle()

    // jquery like selector
    const location = $('#searchForm input')
    location.setValue('10001')

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
