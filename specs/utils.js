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

module.exports = {
  getCoordsFromURL,
  getTempForCoords,
}
