const rp = require('request-promise')


// returns a promise for json object
const getDataForCoords = (lat, long) => {
  return rp({
    uri: `https://api.darksky.net/forecast/4d51fbb64d23886e24bc76aa280a1497/${lat},${long}`,
    json: true
  })
}

const getCoordsFromURL = (url) => {
  // format to grab them from
  //https://darksky.net/forecast/40.7506,-73.9971/us12/en
  const coordRegex = /forecast\/(-?\d+.\d+),(-?\d+.\d+)/
  const [_, lat, long] = url.match(coordRegex)
  return [lat, long]
}

const getTempForCoords = async (lat, long) => {
  const data = await getDataForCoords(lat, long)
  const temp = data.currently.temperature
  return Math.round(temp)
}

const getDataPoints = data => ({
  temperature: data.temperature,
  pressure: data.pressure,
  visibility: data.visibility,
  dewPoint: data.dewPoint,
  humidity: data.humidity,
  windSpeed: data.windSpeed,
})


module.exports = {
  getCoordsFromURL,
  getTempForCoords,
  getDataForCoords,
  getDataPoints,
}
