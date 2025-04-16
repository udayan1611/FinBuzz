const API_KEY = process.env.REACT_APP_ALPHAVANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export const fetchDailyHistoricalData = async (symbol) => {
  // Ensure symbol is uppercase
  const upperSymbol = symbol.toUpperCase();
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
    upperSymbol
  )}&outputsize=compact&apikey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch historical data from Alpha Vantage");
  }
  const data = await response.json();
  // Check if an error message or note was returned by the API
  if (data["Error Message"]) {
    throw new Error(data["Error Message"]);
  }
  if (data["Note"]) {
    throw new Error(data["Note"]);
  }
  const timeSeries = data["Time Series (Daily)"];
  if (!timeSeries) {
    throw new Error("No historical data available for this symbol");
  }
  return timeSeries;
};