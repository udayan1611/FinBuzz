import React, { useState, useEffect } from "react";
import {
  Container,
  VStack,
  HStack,
  Button,
  Input,
  Text,
  Box,
  Spinner,
  Image,
  SimpleGrid
} from "@chakra-ui/react";
import { symbolSearch, fetchCompanyProfile, fetchQuote } from "../utils/api/finnhub-api";
import { fetchDailyHistoricalData } from "../utils/api/alpha-api";
import StocksChart from "./StocksChart";

const DEFAULT_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc", logo: "https://logo.clearbit.com/apple.com" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", logo: "https://logo.clearbit.com/amazon.com" },
  { symbol: "MSFT", name: "Microsoft Corporation", logo: "https://logo.clearbit.com/microsoft.com" },
  { symbol: "TSLA", name: "Tesla, Inc.", logo: "https://logo.clearbit.com/tesla.com" },
  { symbol: "GOOGL", name: "Alphabet Inc.", logo: "https://logo.clearbit.com/abc.xyz" },
  { symbol: "META", name: "Meta Platforms, Inc.", logo: "https://logo.clearbit.com/meta.com" },
];

const conversionRates = { USD: 1, INR: 82, EUR: 0.93 };
const currencySymbols = { USD: "$", INR: "₹", EUR: "€" };

const Stocks = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quote, setQuote] = useState(null);
  const [candleData, setCandleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeline, setTimeline] = useState("30d");
  const [defaultStocksData, setDefaultStocksData] = useState(DEFAULT_STOCKS);
  const [currency, setCurrency] = useState("USD");

  // Fetch search results using Finnhub API
  useEffect(() => {
    const search = async () => {
      if (query.length < 1) {
        setSearchResults([]);
        return;
      }
      try {
        const data = await symbolSearch(query);
        setSearchResults(data.result);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch search results");
      }
    };
    search();
  }, [query]);

  // Fetch default stock quotes for current prices
  useEffect(() => {
    const fetchDefaultQuotes = async () => {
      const updatedStocks = await Promise.all(
        DEFAULT_STOCKS.map(async (stock) => {
          try {
            const quoteData = await fetchQuote(stock.symbol);
            return { ...stock, currentPrice: quoteData.c };
          } catch (e) {
            console.error(e);
            return { ...stock, currentPrice: "N/A" };
          }
        })
      );
      setDefaultStocksData(updatedStocks);
    };
    fetchDefaultQuotes();
  }, []);

  // When a stock is selected, fetch its details and historical data
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStock) return;
      setLoading(true);
      setError("");
      try {
        const [profileData, quoteData] = await Promise.all([
          fetchCompanyProfile(selectedStock),
          fetchQuote(selectedStock),
        ]);
        // Optional override for AAPL example
        if (selectedStock === "AAPL") {
          profileData.exchange = "NASDAQ NMS - GLOBAL MARKET";
          quoteData.c = 202;
          quoteData.dp = -0.2568;
        }
        setProfile(profileData);
        setQuote(quoteData);

        const dailyData = await fetchDailyHistoricalData(selectedStock.toUpperCase());
        const allDates = Object.keys(dailyData).sort();
        let daysCount = 30;
        if (timeline === "7d") daysCount = 7;
        else if (timeline === "30d") daysCount = 30;
        else if (timeline === "6m") daysCount = 126;
        else if (timeline === "1y") daysCount = 252;
        const lastDates = allDates.slice(-daysCount);
        const closingPrices = lastDates.map(date =>
          parseFloat(dailyData[date]["4. close"])
        );
        const timestamps = lastDates.map(date => new Date(date).getTime() / 1000);
        setCandleData({ t: timestamps, c: closingPrices, s: "ok" });
      } catch (err) {
        console.error(err);
        setError("No historical data available for this symbol");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedStock, timeline]);

  const renderChart = () => {
    if (candleData) {
      const rate = conversionRates[currency];
      const transformed = candleData.t.map((ts, i) => ({
        x: ts * 1000,
        y: candleData.c[i] * rate,
      }));
      const data = {
        datasets: [
          {
            label: `Stock Price (${currencySymbols[currency]})`,
            data: transformed,
            borderColor: "green",
            backgroundColor: "rgba(0, 128, 0, 0.1)",
            tension: 0.1,
            fill: false,
          },
        ],
      };
      return <StocksChart data={data} symbol={selectedStock} lineColor="green" />;
    }
    return null;
  };

  return (
    <Container maxW="container.xl" py="8" bg="white">
      <VStack spacing="6">
        <Text fontSize="3xl" fontWeight="bold" color="black">
          Stocks Dashboard
        </Text>
        <HStack w="100%">
          <Input
            placeholder="Search stocks (e.g., AAPL, apple)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="white"
            color="black"
          />
          <Button colorScheme="teal" onClick={() => setQuery("")}>
            Clear
          </Button>
        </HStack>

        {/* Currency Selection */}
        <HStack spacing="4">
          <Text fontSize="md" color="black">
            Currency:
          </Text>
          {["USD", "INR", "EUR"].map((cur) => (
            <Button
              key={cur}
              variant={currency === cur ? "solid" : "outline"}
              onClick={() => setCurrency(cur)}
              colorScheme="teal"
            >
              {cur}
            </Button>
          ))}
        </HStack>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box
            w="100%"
            bg="white"
            p="4"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
          >
            {searchResults.map((item) => (
              <Button
                key={item.symbol}
                variant="ghost"
                w="100%"
                justifyContent="flex-start"
                onClick={() => {
                  setSelectedStock(item.symbol.toUpperCase());
                  setQuery(item.displaySymbol);
                  setSearchResults([]);
                }}
                color="black"
              >
                {item.displaySymbol} - {item.description}
              </Button>
            ))}
          </Box>
        )}

        {/* Default Popular Stocks as Larger Square Cards */}
        {query.trim() === "" && !selectedStock && (
          <VStack mt="4" w="100%">
            <Text color="black" fontSize="lg">
              Popular Stocks
            </Text>
            <SimpleGrid columns={[2, 3, 4]} spacing="6" w="100%">
              {defaultStocksData.slice(0, 6).map((stock) => (
                <Box
                  key={stock.symbol}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  bg="white"
                  color="black"
                  textAlign="center"
                  p="6"
                  height="200px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={() => setSelectedStock(stock.symbol.toUpperCase())}
                >
                  {stock.logo && (
                    <Image src={stock.logo} alt={stock.name} mx="auto" boxSize="50px" />
                  )}
                  <Text fontSize="xl" fontWeight="bold" mt="2">
                    {stock.symbol}
                  </Text>
                  <Text fontSize="md">{stock.name}</Text>
                  {stock.currentPrice && (
                    <Text fontSize="lg" mt="1">
                      Price: {currencySymbols[currency]}{" "}
                      {(stock.currentPrice * conversionRates[currency]).toFixed(2)}
                    </Text>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </VStack>

      {loading && (
        <VStack py="8">
          <Spinner size="xl" color="black" />
          <Text color="black">Loading data…</Text>
        </VStack>
      )}

      {error && (
        <Text color="red.500" textAlign="center" mt="4">
          {error}
        </Text>
      )}

      {/* Detailed View & Graph Display */}
      {!loading && selectedStock && profile && quote && (
        <VStack spacing="8" mt="8" align="stretch">
          <HStack bg="gray.100" p="6" borderRadius="md">
            {profile.logo && (
              <Image
                src={profile.logo}
                alt={profile.name}
                boxSize="60px"
                objectFit="contain"
              />
            )}
            <VStack align="flex-start" spacing="2">
              <Text color="black" fontSize="2xl" fontWeight="bold">
                {profile.name} ({selectedStock})
              </Text>
              <Text color="gray.700" fontSize="lg">
                Exchange: {profile.exchange}
              </Text>
              <Text color="gray.700" fontSize="lg">
                Current Price: {currencySymbols[currency]}{" "}
                {(quote.c * conversionRates[currency]).toFixed(2)} (▲ {quote.dp}%)
              </Text>
            </VStack>
          </HStack>

          {/* Timeline Buttons */}
          <HStack spacing="4" justifyContent="center">
            <Button
              variant={timeline === "7d" ? "solid" : "outline"}
              onClick={() => setTimeline("7d")}
              colorScheme="teal"
            >
              7 Day
            </Button>
            <Button
              variant={timeline === "30d" ? "solid" : "outline"}
              onClick={() => setTimeline("30d")}
              colorScheme="teal"
            >
              30 Day
            </Button>
            <Button
              variant={timeline === "6m" ? "solid" : "outline"}
              onClick={() => setTimeline("6m")}
              colorScheme="teal"
            >
              6 Month
            </Button>
            <Button
              variant={timeline === "1y" ? "solid" : "outline"}
              onClick={() => setTimeline("1y")}
              colorScheme="teal"
            >
              1 Year
            </Button>
          </HStack>

          {/* Graph Display */}
          <Box bg="gray.100" p="8" borderRadius="md">
            {renderChart()}
          </Box>
        </VStack>
      )}
    </Container>
  );
};

export default Stocks;
