const assert = require('assert')
const rp = require('request-promise')

// bad name but 12hr -> 24hr clock
// also changes from string to num
const twelveToTwentyFour = (time) => {
  const hour = Number(time.slice(0, -2)) // cut the last 2 chars off
  const str = time.slice(-2) // get the last 2 chars
  if (str === 'pm') {
    return (hour + 12) % 24
  }
  return hour
}

describe('DarkSky Timeline readings', () => {
  it('should have 12 time points', () => {

    browser.url('https://darksky.net')
    const hours = $('.hours').$$('.hour span')

    assert.equal(hours.length, 12)

  })

  it('should start from the current time and continue', () => {
    browser.url('https://darksky.net')
    let hours = $('.hours').$$('.hour span')
    // first one always has "now" so let's make sure
    const first = hours[0]
    assert.equal(first.getText().toLowerCase(), 'now')

    const now = new Date()
    const TIME_BETWEEN_READINGS = 2

    // start at one cause we checked 0 up there
    for (let i = 1; i < hours.length; i++) {
      const offset = new Date(now) // copy of before
      // set it to the expected time
      offset.setHours(now.getHours() + i * TIME_BETWEEN_READINGS)

      const hourText = hours[i].getText()
      console.log({
        hourText,
        offset: offset.getHours(),
      })
      assert.equal(twelveToTwentyFour(hourText), offset.getHours())
    }

  })
})

