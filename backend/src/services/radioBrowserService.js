
const axios = require("axios");

const RADIO_BROWSER_SERVERS = [
  "https://all.api.radio-browser.info",
  "https://de1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
];

const api = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent": "RadioStellar/1.0",
    Accept: "application/json",
  },
});

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function radioRequest(endpoint) {
  let lastError;

  for (const [index, server] of RADIO_BROWSER_SERVERS.entries()) {
    try {
      const response = await api.get(`${server}${endpoint}`);

      console.log(`Radio Browser connected: ${server}`);

      return response.data;
    } catch (error) {
      lastError = error;

      console.error(
        `Radio Browser server failed: ${server}`,
        error.code || error.message
      );

      if (index < RADIO_BROWSER_SERVERS.length - 1) {
        await delay(500);
      }
    }
  }

  throw lastError;
}

async function getPopularStations() {
  return radioRequest("/json/stations/topclick/20");
}

module.exports = {
  getPopularStations,
  radioRequest,
};
