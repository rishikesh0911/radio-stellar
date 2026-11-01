import api from "./api";

export const searchStations = async (filters = {}) => {
  const { data } = await api.get("/stations/search", {
    params: filters
  });

  return data.data;
};

export const getPopularStations = async () => {
  const { data } = await api.get("/stations/popular");

  return data.data;
};

export const getCountries = async () => {
  const { data } = await api.get("/stations/countries");

  return data.data;
};

export const getLanguages = async () => {
  const { data } = await api.get("/stations/languages");

  return data.data;
};

export const getStation = async (uuid) => {
  const { data } = await api.get(`/stations/${uuid}`);

  return data.data;
};
