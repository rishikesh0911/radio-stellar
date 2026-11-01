const axios = require("axios");

const RADIO_API =
  process.env.RADIO_BROWSER_URL ||
  "https://de1.api.radio-browser.info";

const radioClient = axios.create({
  baseURL: RADIO_API,
  timeout: 12000,
  headers: {
    "User-Agent": "RadioGardenClone/1.0"
  }
});

// Search stations
const searchStations = async (filters = {}) => {
  const params = {
    limit: Math.min(Number(filters.limit) || 50, 100),
    offset: Math.max(Number(filters.offset) || 0, 0),
    hidebroken: true,
    order: "clickcount",
    reverse: true
  };

  if (filters.name) params.name = filters.name;
  if (filters.country) params.country = filters.country;
  if (filters.language) params.language = filters.language;
  if (filters.tag) params.tag = filters.tag;

  const { data } = await radioClient.get(
    "/json/stations/search",
    { params }
  );

  return data;
};

// Get popular stations
const getPopularStations = async (limit = 20) => {
  const { data } = await radioClient.get(
    `/json/stations/topclick/${Math.min(limit, 100)}`
  );

  return data;
};

// Get countries
const getCountries = async () => {
  const { data } = await radioClient.get(
    "/json/countries",
    {
      params: { order: "stationcount", reverse: true }
    }
  );

  return data;
};

// Get languages
const getLanguages = async () => {
  const { data } = await radioClient.get(
    "/json/languages",
    {
      params: { order: "stationcount", reverse: true }
    }
  );

  return data;
};

// Get station by UUID
const getStationById = async (uuid) => {
  const { data } = await radioClient.get(
    `/json/stations/byuuid/${encodeURIComponent(uuid)}`
  );

  return data[0] || null;
};

module.exports = {
  searchStations,
  getPopularStations,
  getCountries,
  getLanguages,
  getStationById
};
