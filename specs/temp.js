const assert = require('assert')

describe('Dark Sky Temp readings', () => {
  it('should have the correct temperature', () => {
    browser.url('https://darksky.net')

    // jquery like selector
    const input = $('input')
    input.setValue('10005')


    const button = $('a.searchButton')
    button.click()

    const span = $('span.summary.swap')
    const tempText = span.getText()
    const parsedTemp = tempText.match(/(\d+)/)[1]

    assert.equal(parsedTemp, '28')

  })
})
