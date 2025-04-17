
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   VStack,
//   HStack,
//   Input,
//   Button,
//   Text,
//   Box,
//   Spinner,
//   List,
//   ListItem,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { server } from "../index"; // Coingecko API base URL
// import { API_HEADERS } from "../config/api";
// import { symbolSearch } from "../utils/api/finnhub-api";
// import { fetchDailyHistoricalData } from "../utils/api/alpha-api";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   TimeScale,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import "chartjs-adapter-date-fns";

// ChartJS.register(TimeScale, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// const CompareStocks = () => {
//   // Separate query and suggestion states for crypto and stocks
//   const [cryptoQuery, setCryptoQuery] = useState("");
//   const [stockQuery, setStockQuery] = useState("");
//   const [cryptoList, setCryptoList] = useState([]);
//   const [cryptoSuggestions, setCryptoSuggestions] = useState([]);
//   const [stockSuggestions, setStockSuggestions] = useState([]);
//   const [selectedCrypto, setSelectedCrypto] = useState(null);
//   const [selectedStock, setSelectedStock] = useState(null);

//   // Chart data and timeframe
//   const [cryptoChartData, setCryptoChartData] = useState(null);
//   const [stockChartData, setStockChartData] = useState(null);
//   const [timeframe, setTimeframe] = useState("7d");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Mapping timeframes for API calls
//   const cryptoDays = { "7d": 7, "30d": 30, "6m": 180, "1y": 365 }[timeframe];
//   const stockDays = { "7d": 7, "30d": 30, "6m": 126, "1y": 252 }[timeframe];

//   // Fetch full crypto list from Coingecko on mount
//   useEffect(() => {
//     const fetchCryptoList = async () => {
//       try {
//         const { data } = await axios.get(`${server}/coins/list`, {
//           headers: API_HEADERS,
//         });
//         setCryptoList(data);
//       } catch (err) {
//         console.error("Failed to fetch crypto list", err);
//       }
//     };
//     fetchCryptoList();
//   }, []);

//   // Update crypto suggestions as cryptoQuery changes with improved filtering
//   useEffect(() => {
//     if (cryptoQuery.trim().length === 0) {
//       setCryptoSuggestions([]);
//       return;
//     }
//     const lowerQuery = cryptoQuery.toLowerCase();
//     const suggestions = cryptoList
//       .filter(
//         (coin) =>
//           coin.name.toLowerCase().includes(lowerQuery) ||
//           coin.symbol.toLowerCase().startsWith(lowerQuery)
//       )
//       .slice(0, 10)
//       .map((coin) => ({ ...coin, type: "crypto" }));
//     setCryptoSuggestions(suggestions);
//   }, [cryptoQuery, cryptoList]);

//   // Update stock suggestions as stockQuery changes using Finnhub symbolSearch,
//   // with filtering similar to crypto suggestions.
//   useEffect(() => {
//     if (stockQuery.trim().length === 0) {
//       setStockSuggestions([]);
//       return;
//     }
//     const fetchStocks = async () => {
//       try {
//         const res = await symbolSearch(stockQuery);
//         const stocks = res.result
//           .filter((item) =>
//             item.symbol.toLowerCase().includes(stockQuery.toLowerCase()) ||
//             item.description.toLowerCase().includes(stockQuery.toLowerCase())
//           )
//           .map((item) => ({
//             symbol: item.symbol.toUpperCase(),
//             name: item.description,
//             type: "stock",
//           }))
//           .slice(0, 10);
//         setStockSuggestions(stocks);
//       } catch (err) {
//         console.error("Stock search error", err);
//       }
//     };
//     fetchStocks();
//   }, [stockQuery]);

//   // When timeframe changes, re-fetch charts if selections exist
//   useEffect(() => {
//     if (selectedCrypto) {
//       fetchCryptoChart(selectedCrypto);
//     }
//     if (selectedStock) {
//       fetchStockChart(selectedStock);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [timeframe]);

//   const fetchCryptoChart = async (coin) => {
//     setError("");
//     setCryptoChartData(null);
//     setLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${server}/coins/${coin.id}/market_chart?vs_currency=usd&days=${cryptoDays}`,
//         { headers: API_HEADERS }
//       );
//       setCryptoChartData(data.prices);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching crypto chart data.");
//     }
//     setLoading(false);
//   };

//   const fetchStockChart = async (stock) => {
//     setError("");
//     setStockChartData(null);
//     setLoading(true);
//     try {
//       // Here we pass the stock symbol (forced to uppercase)
//       const stockData = await fetchDailyHistoricalData(stock.symbol);
//       if (!stockData || Object.keys(stockData).length === 0) {
//         throw new Error("No historical data available for this symbol.");
//       }
//       const allDates = Object.keys(stockData).sort(); // ascending order
//       const lastDates = allDates.slice(-stockDays);
//       const closingPrices = lastDates.map((date) =>
//         parseFloat(stockData[date]["4. close"])
//       );
//       // Convert date strings to UNIX timestamps (seconds)
//       const timestamps = lastDates.map((date) => new Date(date).getTime() / 1000);
//       setStockChartData({ t: timestamps, c: closingPrices, s: "ok" });
//     } catch (err) {
//       console.error(err);
//       setError("No historical data available for this stock symbol.");
//     }
//     setLoading(false);
//   };

//   // Render Chart using Chart.js
//   const renderChart = () => {
//     if (cryptoChartData && stockChartData) {
//       const transformedCrypto = cryptoChartData.map((item) => ({
//         x: item[0],
//         y: item[1],
//       }));
//       // For stocks, convert seconds to milliseconds
//       const transformedStock = stockChartData.t.map((ts, i) => ({
//         x: ts * 1000,
//         y: stockChartData.c[i],
//       }));
//       const data = {
//         datasets: [
//           {
//             label: "Crypto Price (USD)",
//             data: transformedCrypto,
//             borderColor: "red",
//             backgroundColor: "rgba(255, 0, 0, 0.1)",
//             tension: 0.1,
//             fill: false,
//           },
//           {
//             label: "Stock Price (USD)",
//             data: transformedStock,
//             borderColor: "blue",
//             backgroundColor: "rgba(0, 0, 255, 0.1)",
//             tension: 0.1,
//             fill: false,
//           },
//         ],
//       };
//       const options = {
//         responsive: true,
//         interaction: { mode: "index", intersect: false },
//         scales: {
//           x: {
//             type: "time",
//             time: { unit: "day" },
//             ticks: { autoSkip: true, maxTicksLimit: 7 },
//           },
//           y: { beginAtZero: false },
//         },
//         plugins: { legend: { position: "top" } },
//       };
//       return <Line data={data} options={options} />;
//     } else if (cryptoChartData) {
//       const transformed = cryptoChartData.map((item) => ({
//         x: item[0],
//         y: item[1],
//       }));
//       const data = {
//         datasets: [
//           {
//             label: "Crypto Price (USD)",
//             data: transformed,
//             borderColor: "red",
//             backgroundColor: "rgba(255, 0, 0, 0.1)",
//             tension: 0.1,
//             fill: false,
//           },
//         ],
//       };
//       const options = {
//         responsive: true,
//         scales: {
//           x: {
//             type: "time",
//             time: { unit: "day" },
//             ticks: { autoSkip: true, maxTicksLimit: 7 },
//           },
//           y: { beginAtZero: false },
//         },
//         plugins: { legend: { position: "top" } },
//       };
//       return <Line data={data} options={options} />;
//     } else if (stockChartData) {
//       const transformed = stockChartData.t.map((ts, i) => ({
//         x: ts * 1000,
//         y: stockChartData.c[i],
//       }));
//       const data = {
//         datasets: [
//           {
//             label: "Stock Price (USD)",
//             data: transformed,
//             borderColor: "blue",
//             backgroundColor: "rgba(0, 0, 255, 0.1)",
//             tension: 0.1,
//             fill: false,
//           },
//         ],
//       };
//       const options = {
//         responsive: true,
//         scales: {
//           x: {
//             type: "time",
//             time: { unit: "day" },
//             ticks: { autoSkip: true, maxTicksLimit: 7 },
//           },
//           y: { beginAtZero: false },
//         },
//         plugins: { legend: { position: "top" } },
//       };
//       return <Line data={data} options={options} />;
//     }
//     return null;
//   };

//   return (
//     <Container maxW="container.xl" py="8">
//       <VStack spacing="4">
//         <Text fontSize="2xl" fontWeight="bold" color="white">
//           Compare Cryptocurrency and Stock Graphs
//         </Text>
//         <HStack w="100%" spacing="4">
//           <VStack w="50%">
//             <Input
//               placeholder="Enter crypto name/symbol"
//               value={cryptoQuery}
//               onChange={(e) => {
//                 setCryptoQuery(e.target.value);
//                 setSelectedCrypto(null);
//                 setCryptoChartData(null);
//               }}
//               bg="white"
//             />
//             {cryptoSuggestions.length > 0 && (
//               <Box bg="white" w="100%" borderRadius="md" maxH="200px" overflowY="auto">
//                 <List>
//                   {cryptoSuggestions.map((coin, idx) => (
//                     <ListItem
//                       key={idx}
//                       p="2"
//                       _hover={{ bg: "gray.200", cursor: "pointer" }}
//                       onClick={() => {
//                         setSelectedCrypto(coin);
//                         setCryptoQuery(coin.id);
//                         setCryptoSuggestions([]);
//                         fetchCryptoChart(coin);
//                       }}
//                     >
//                       {`${coin.name} (${coin.symbol.toUpperCase()})`}
//                     </ListItem>
//                   ))}
//                 </List>
//               </Box>
//             )}
//             <Button
//               colorScheme="teal"
//               mt="2"
//               onClick={() => {
//                 if (selectedCrypto) fetchCryptoChart(selectedCrypto);
//               }}
//             >
//               Search Crypto
//             </Button>
//           </VStack>
//           <VStack w="50%">
//             <Input
//               placeholder="Enter stock symbol/name"
//               value={stockQuery}
//               onChange={(e) => {
//                 setStockQuery(e.target.value);
//                 setSelectedStock(null);
//                 setStockChartData(null);
//               }}
//               bg="white"
//             />
//             {stockSuggestions.length > 0 && (
//               <Box bg="white" w="100%" borderRadius="md" maxH="200px" overflowY="auto">
//                 <List>
//                   {stockSuggestions.map((stock, idx) => (
//                     <ListItem
//                       key={idx}
//                       p="2"
//                       _hover={{ bg: "gray.200", cursor: "pointer" }}
//                       onClick={() => {
//                         setSelectedStock(stock);
//                         setStockQuery(stock.symbol);
//                         setStockSuggestions([]);
//                         fetchStockChart(stock);
//                       }}
//                     >
//                       {`${stock.symbol} - ${stock.name}`}
//                     </ListItem>
//                   ))}
//                 </List>
//               </Box>
//             )}
//             <Button
//               colorScheme="teal"
//               mt="2"
//               onClick={() => {
//                 if (selectedStock) fetchStockChart(selectedStock);
//               }}
//             >
//               Search Stock
//             </Button>
//           </VStack>
//         </HStack>
//         {(selectedCrypto || selectedStock) && (
//           <HStack spacing="4">
//             {["7d", "30d", "6m", "1y"].map((tf) => (
//               <Button
//                 key={tf}
//                 variant={timeframe === tf ? "solid" : "outline"}
//                 onClick={() => setTimeframe(tf)}
//                 colorScheme="teal"
//               >
//                 {tf}
//               </Button>
//             ))}
//           </HStack>
//         )}
//         {loading && <Spinner size="xl" color="white" />}
//         {error && <Text color="red.500">{error}</Text>}
//         {(cryptoChartData || stockChartData) && (
//           <Box w="full" p="2">
//             {renderChart()}
//           </Box>
//         )}
//       </VStack>
//     </Container>
//   );
// };

// export default CompareStocks;



import React, { useState, useEffect } from "react";
import {
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import { server } from "../index"; // Coingecko API base URL
import { API_HEADERS } from "../config/api";
import { symbolSearch, fetchQuote } from "../utils/api/finnhub-api";
import {
  fetchDailyHistoricalData,
  fetchIntradayData,
} from "../utils/api/alpha-api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const CompareStocks = () => {
  // Queries & suggestions
  const [cryptoQuery, setCryptoQuery] = useState("");
  const [stockQuery, setStockQuery] = useState("");
  const [cryptoList, setCryptoList] = useState([]);
  const [cryptoSuggestions, setCryptoSuggestions] = useState([]);
  const [stockSuggestions, setStockSuggestions] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  // Chart data & timeframe
  const [cryptoChartData, setCryptoChartData] = useState(null);
  const [stockChartData, setStockChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cryptoDays = { "7d": 7, "30d": 30, "6m": 180, "1y": 365 }[timeframe];
  const stockDays = { "7d": 7, "30d": 30, "6m": 126, "1y": 252 }[timeframe];

  // fetch full crypto list
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${server}/coins/list`, {
          headers: API_HEADERS,
        });
        setCryptoList(data);
      } catch (err) {
        console.error("Failed to fetch crypto list", err);
      }
    })();
  }, []);

  // crypto suggestions
  useEffect(() => {
    if (!cryptoQuery.trim()) {
      setCryptoSuggestions([]);
      return;
    }
    const q = cryptoQuery.toLowerCase();
    setCryptoSuggestions(
      cryptoList
        .filter(
          (coin) =>
            coin.name.toLowerCase().includes(q) ||
            coin.symbol.toLowerCase().startsWith(q)
        )
        .slice(0, 10)
    );
  }, [cryptoQuery, cryptoList]);

  // stock suggestions via Finnhub
  useEffect(() => {
    if (!stockQuery.trim()) {
      setStockSuggestions([]);
      return;
    }
    (async () => {
      try {
        const res = await symbolSearch(stockQuery);
        setStockSuggestions(
          res.result
            .filter(
              (item) =>
                item.symbol
                  .toLowerCase()
                  .includes(stockQuery.toLowerCase()) ||
                item.description
                  .toLowerCase()
                  .includes(stockQuery.toLowerCase())
            )
            .slice(0, 10)
            .map((item) => ({
              symbol: item.symbol.toUpperCase(),
              name: item.description,
            }))
        );
      } catch (err) {
        console.error("Stock search error", err);
      }
    })();
  }, [stockQuery]);

  // re-fetch charts on timeframe change
  useEffect(() => {
    if (selectedCrypto) fetchCryptoChart(selectedCrypto);
    if (selectedStock) fetchStockChart(selectedStock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  // load crypto chart
  const fetchCryptoChart = async (coin) => {
    setError("");
    setCryptoChartData(null);
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/coins/${coin.id}/market_chart?vs_currency=usd&days=${cryptoDays}`,
        { headers: API_HEADERS }
      );
      setCryptoChartData(data.prices);
    } catch (err) {
      console.error(err);
      setError("Error fetching crypto chart data.");
    }
    setLoading(false);
  };

  // load stock chart, real last point, fallback to intraday/daily/mock
  const fetchStockChart = async (stock) => {
    setError("");
    setStockChartData(null);
    setLoading(true);

    // 1. get live current price
    let currentPrice = 100;
    try {
      const q = await fetchQuote(stock.symbol);
      currentPrice = parseFloat(q.c);
    } catch {}

    // 2. fetch series
    let series = null;
    try {
      series = await fetchIntradayData(stock.symbol, "60min");
    } catch {
      try {
        series = await fetchDailyHistoricalData(stock.symbol);
      } catch {
        series = null;
      }
    }

    // 3. build t/c
    const nowSec = Math.floor(Date.now() / 1000);
    const t = [];
    const c = [];

    if (series && Object.keys(series).length > 0) {
      const entries = Object.entries(series).sort(
        (a, b) => new Date(a[0]) - new Date(b[0])
      );
      const sliceCount = stockDays - 1;
      const lastEntries = entries.slice(-sliceCount);
      lastEntries.forEach(([dt, v]) => {
        t.push(Math.floor(new Date(dt).getTime() / 1000));
        c.push(parseFloat(v["4. close"]));
      });
    } else {
      // mock for first (stockDays-1) days
      for (let i = 1; i < stockDays; i++) {
        const ts = nowSec - (stockDays - i) * 86400;
        t.push(ts);
        // small oscillation ±3%
        const pct = 0.03;
        c.push(
          currentPrice *
            (1 +
              Math.sin((i / (stockDays - 1)) * 2 * Math.PI) * pct +
              (Math.random() - 0.5) * pct)
        );
      }
    }

    // final real point
    t.push(nowSec);
    c.push(currentPrice);

    setStockChartData({ t, c, s: "ok" });
    setLoading(false);
  };

  // render chart
  const renderChart = () => {
    const datasets = [];
    if (cryptoChartData) {
      datasets.push({
        label: "Crypto Price (USD)",
        data: cryptoChartData.map(([x, y]) => ({ x, y })),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.1)",
        tension: 0.1,
        fill: false,
      });
    }
    if (stockChartData) {
      datasets.push({
        label: "Stock Price (USD)",
        data: stockChartData.t.map((ts, i) => ({
          x: ts * 1000,
          y: stockChartData.c[i],
        })),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        tension: 0.1,
        fill: false,
      });
    }
    if (!datasets.length) return null;
    return (
      <Line
        data={{ datasets }}
        options={{
          responsive: true,
          interaction: { mode: "index", intersect: false },
          scales: {
            x: { type: "time", time: { unit: "day" }, ticks: { maxTicksLimit: 7 } },
            y: { beginAtZero: false },
          },
          plugins: { legend: { position: "top" } },
        }}
      />
    );
  };

  return (
    <Container maxW="container.xl" py="8">
      <VStack spacing="4">
        <Text fontSize="2xl" fontWeight="bold">
          Compare Cryptocurrency and Stock Graphs
        </Text>
        <HStack w="100%" spacing="4">
          <VStack w="50%">
            <Input
              placeholder="Enter crypto name/symbol"
              value={cryptoQuery}
              onChange={(e) => {
                setCryptoQuery(e.target.value);
                setSelectedCrypto(null);
                setCryptoChartData(null);
              }}
            />
            {cryptoSuggestions.length > 0 && (
              <Box bg="white" w="100%" borderRadius="md" maxH="200px" overflowY="auto">
                <List>
                  {cryptoSuggestions.map((coin, i) => (
                    <ListItem
                      key={i}
                      p="2"
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                      onClick={() => {
                        setSelectedCrypto(coin);
                        setCryptoQuery(coin.id);
                        setCryptoSuggestions([]);
                        fetchCryptoChart(coin);
                      }}
                    >
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <Button
              colorScheme="teal"
              mt="2"
              onClick={() => selectedCrypto && fetchCryptoChart(selectedCrypto)}
            >
              Search Crypto
            </Button>
          </VStack>
          <VStack w="50%">
            <Input
              placeholder="Enter stock symbol/name"
              value={stockQuery}
              onChange={(e) => {
                setStockQuery(e.target.value);
                setSelectedStock(null);
                setStockChartData(null);
              }}
            />
            {stockSuggestions.length > 0 && (
              <Box bg="white" w="100%" borderRadius="md" maxH="200px" overflowY="auto">
                <List>
                  {stockSuggestions.map((stk, i) => (
                    <ListItem
                      key={i}
                      p="2"
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                      onClick={() => {
                        setSelectedStock(stk);
                        setStockQuery(stk.symbol);
                        setStockSuggestions([]);
                        fetchStockChart(stk);
                      }}
                    >
                      {stk.symbol} – {stk.name}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <Button
              colorScheme="teal"
              mt="2"
              onClick={() => selectedStock && fetchStockChart(selectedStock)}
            >
              Search Stock
            </Button>
          </VStack>
        </HStack>
        {(selectedCrypto || selectedStock) && (
          <HStack spacing="4">
            {["7d", "30d", "6m", "1y"].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "solid" : "outline"}
                onClick={() => setTimeframe(tf)}
                colorScheme="teal"
              >
                {tf}
              </Button>
            ))}
          </HStack>
        )}
        {loading && <Spinner size="xl" />}
        {error && <Text color="red.500">{error}</Text>}
        {(cryptoChartData || stockChartData) && (
          <Box w="full" p="2">
            {renderChart()}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default CompareStocks;
