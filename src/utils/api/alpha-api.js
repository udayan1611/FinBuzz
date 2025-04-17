// const API_KEY = process.env.REACT_APP_ALPHAVANTAGE_API_KEY;
// const BASE_URL = "https://www.alphavantage.co/query";

// export const fetchDailyHistoricalData = async (symbol) => {
//   // Ensure symbol is uppercase
//   const upperSymbol = symbol.toUpperCase();
//   const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
//     upperSymbol
//   )}&outputsize=compact&apikey=${API_KEY}`;
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Failed to fetch historical data from Alpha Vantage");
//   }
//   const data = await response.json();
//   // Check if an error message or note was returned by the API
//   if (data["Error Message"]) {
//     throw new Error(data["Error Message"]);
//   }
//   if (data["Note"]) {
//     throw new Error(data["Note"]);
//   }
//   const timeSeries = data["Time Series (Daily)"];
//   if (!timeSeries) {
//     throw new Error("No historical data available for this symbol");
//   }
//   return timeSeries;
// };



const API_KEY = process.env.REACT_APP_ALPHAVANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// …existing fetchDailyHistoricalData…

export const fetchDailyHistoricalData = async (symbol) => {
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
    symbol.toUpperCase()
  )}&outputsize=full&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data["Error Message"]) throw new Error(data["Error Message"]);
  if (data["Note"]) throw new Error("Daily rate limit reached");
  const series = data["Time Series (Daily)"];
  if (!series) throw new Error("No daily data returned");
  return series;
};

// ← Add this export so Stocks.jsx can import it
export const fetchIntradayData = async (symbol, interval = "60min") => {
  const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(
    symbol.toUpperCase()
  )}&interval=${interval}&outputsize=full&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data["Error Message"]) throw new Error(data["Error Message"]);
  if (data["Note"]) throw new Error("Intraday rate limit reached");
  const key = `Time Series (${interval})`;
  const series = data[key];
  if (!series) throw new Error("No intraday data returned");
  return series;
};
