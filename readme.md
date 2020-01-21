# Northwestern Code Challenge

I used `webdriver.io` like suggested and tried using `request-promise` to see how it is used.

## Setup and Usage

- `git clone https://github.com/marvinody/nw-ern-code-challenge/`
- `npm install`
- `npm test`

I split them into 3 files to divvy them as per scenario.

- Scenario 1: `specs/temp.js`
- Scenario 2: `specs/timeline.js`
- Scenario 3: `specs/other-ui.js`

There's a phantom-bug since I load the browser and then fetch the data, sometimes there's a quick instant of data teetering on like 3.5. The browser might see 3.49 but then the sensors get updated and the API returns 3.5. Rounding each of these gets a different answer so sometimes the test will fail.
A way of fixing this would be to have a tolerance of +-1 on the matches. I didn't implement this since I believe it adds code complexity that wasn't asked for.

Some choices I had to make:

- Using a pause instead of waitUntil title change.

  - mainly to work regardless of location that the tests would be run in.
  - imagine if the zip code matched up with the ip location, the title would never change after clicking submit.
  - but by using pause (assuming a good internet connection), we can assume that the page has loaded if needed.

- Using parseInt instead of Number for visibility test.

  - from previous bugs, I have tended to prefer Number since it's a little more robust
  - a simple explanation of parseInt can be 'it stops parsing at the first non number character' which is what I want since I don't care for the '+' sign in the visibility.

- Using the first hour value in the timeline to calibrate
  - for some unknown condition, the website displays the timeline with either a 1-hour offset, or a 2-hour offset from the current time.
  - in order to test the whole timeline, I use the first hour value to see if we're 1 or 2 hour offset and check that the rest match up.

## Some issues

Sometimes, there's a discrepancy between the embedded data in the webpage and the api data publically available. Because of this, the tests sometimes have false negatives because two different data points are being checked for equality. This could be overcome in a couple of ways:

- have the equality check change into a range check with a given tolerance
- use the embedded data instead of the api data to check for equality

I didn't implement either of these since 1) doesn't seem right to do (since it's not checking if actual data is displayed) and 2) I was specifically told to use the api data.

I added some logging to display both relevant pieces of data when the tests run and show how the data can be different and may perhaps lead to 'failing.'

![image showing different data points](https://i.heart.lolisports.com/marv/YzE0N.png)

You can see that the api (`dataPts`) returned `0.42` for humidity but the embedded data (`embeddedDataPts` & which the application uses to display the info) has `0.41` which leads to a difference of 1 when multiplied by 100 and leads to a failure of a test.

In some other cases, the frontend seems to decide to take the first hourly data point `hours[0]` and use those data points instead of the `currently`. This can also result in some false negatives since the UI is not displaying the currently status anymore...
