const API_TOKEN = process.env.REACT_APP_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export const symbolSearch = async (query, exchange = "") => {
  const url = `${BASE_URL}/search?q=${encodeURIComponent(
    query
  )}${exchange ? `&exchange=${exchange}` : ""}&token=${API_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to search symbols");
  }
  return response.json();
};

export const fetchCompanyProfile = async (symbol) => {
  const url = `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch company profile");
  }
  return response.json();
};

export const fetchQuote = async (symbol) => {
  const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch stock quote");
  }
  return response.json();
};

export const fetchStockCandles = async (symbol, resolution, from, to) => {
  const url = `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${API_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch candle data");
  }
  return response.json();
};