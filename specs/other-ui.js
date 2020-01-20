const assert = require('assert')
const { getCoordsFromURL, getDataForCoords } = require('./utils')


describe('DarkSky UI Readings', () => {

  // they'll all use the same page to make it simple
  // same page also means same data and that also makes it simpler
  let data
  before(() => {
    browser.url('https://darksky.net')
    // jquery like selector
    const location = $('#searchForm input')
    location.setValue('11968')

    const button = $('a.searchButton')
    button.click()

    browser.pause(3000)

    const [lat, long] = getCoordsFromURL(browser.getUrl())
    // and async call using rp to fetch the api
    data = browser.call(() => getDataForCoords(lat, long))
  })

  it('should have the correct wind speed', () => {

    const span = $('span.wind__speed__value')
    const actual = Number(span.getText())
    const expected = Math.round(data.currently.windSpeed)
    assert.equal(actual, expected)

  })

  it('should have the correct humidity', () => {

    const span = $('span.humidity__value')
    // this comes as a 0-100
    const actual = Number(span.getText())
    // this comes as a 0-1
    const humidity = data.currently.humidity
    const expected = Math.round(humidity * 100)
    assert.equal(actual, expected)

  })

  it('should have the correct dew point', () => {

    const span = $('span.dew__point__value')
    const actual = Number(span.getText())
    const expected = Math.round(data.currently.dewPoint)
    assert.equal(actual, expected)

  })

  it('should have the correct visibility', () => {

    const span = $('span.visibility__value')
    // parseInt is used here because visibility can look like "9" or "10+"
    // Number will return 9 and NaN for both of those
    // but parseInt will return 9 and 10 correctly
    // Generally, don't want this behavior but since the plus is 'arbitrary' from
    // a testing perspective, I think it makes sense to use it here
    const actual = parseInt(span.getText(), 10)
    const expected = Math.round(data.currently.visibility)
    assert.equal(actual, expected)

  })

  it('should have the correct pressure', () => {

    const span = $('span.pressure__value')
    const actual = Number(span.getText())
    const expected = Math.round(data.currently.pressure)
    assert.equal(actual, expected)

  })
})
