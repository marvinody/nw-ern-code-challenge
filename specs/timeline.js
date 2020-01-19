const assert = require('assert')
const rp = require('request-promise')

// bad name but 12hr -> 24hr clock
// also changes from string to num
const twelveToTwentyFour = (time) => {
  if (time === '12am') {
    // edge case since we don't say 0am
    return 0
  }
  const hour = Number(time.slice(0, -2)) // cut the last 2 chars off
  const str = time.slice(-2) // get the last 2 chars
  if (str === 'pm' && hour < 12) {
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

    // sometimes, the ui displays the numbers starting 1 hour ahead, sometimes 2
    // so we'll use the second time slot to calibrate our readings
    // and then the check the rest for real
    const firstHourTime = twelveToTwentyFour(hours[1].getText())
    if ((now.getHours() + 1) % 24 === firstHourTime) {
      // then we can assume, the offset starts by 1 and are misaligned.
      // so let's fix it
      now.setHours(firstHourTime)
    }

    // start at two cause we checked 0 up there and used 1 for calibration
    for (let i = 2; i < hours.length; i++) {
      const offset = new Date(now) // copy of before
      // set it to the expected time
      // this will handle wrap around if we add to like 25 or something
      offset.setHours(now.getHours() + i * TIME_BETWEEN_READINGS)

      const hourText = hours[i].getText()
      assert.equal(twelveToTwentyFour(hourText), offset.getHours())
    }

  })
})

