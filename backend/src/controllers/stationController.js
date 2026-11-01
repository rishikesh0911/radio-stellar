const radioService = require("../services/radioBrowserService");

exports.searchStations = async (req, res) => {
  const stations = await radioService.searchStations(req.query);

  res.json({
    success: true,
    count: stations.length,
    data: stations
  });
};

exports.popularStations = async (req, res) => {
  const stations = await radioService.getPopularStations(
    Number(req.query.limit) || 20
  );

  res.json({
    success: true,
    data: stations
  });
};

exports.getCountries = async (req, res) => {
  const countries = await radioService.getCountries();

  res.json({
    success: true,
    data: countries
  });
};

exports.getLanguages = async (req, res) => {
  const languages = await radioService.getLanguages();

  res.json({
    success: true,
    data: languages
  });
};

exports.getStation = async (req, res) => {
  const station = await radioService.getStationById(
    req.params.uuid
  );

  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found"
    });
  }

  res.json({
    success: true,
    data: station
  });
};
