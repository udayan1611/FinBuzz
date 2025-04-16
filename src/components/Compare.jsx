
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   HStack,
//   Input,
//   VStack,
//   Heading,
//   List,
//   ListItem,
//   IconButton,
//   Radio,
//   RadioGroup,
//   Text,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { server } from "../index";
// import { API_HEADERS } from "../config/api";
// import Loader from "./Loader";
// import ErrorComponent from "./ErrorComponent";
// import { SearchIcon } from "@chakra-ui/icons";

// // Import Chart.js components and react-chartjs-2; also import date adapter
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

// const Compare = () => {
//   // State for coin ids (inputs)
//   const [coin1, setCoin1] = useState("");
//   const [coin2, setCoin2] = useState("");
//   // Suggestions for each input
//   const [suggestions1, setSuggestions1] = useState([]);
//   const [suggestions2, setSuggestions2] = useState([]);
//   // Full list of coins (id and name)
//   const [coinsList, setCoinsList] = useState([]);
//   // Chart data for each coin
//   const [chartData1, setChartData1] = useState([]);
//   const [chartData2, setChartData2] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   // Time range selection: options "1" (24hrs), "7" (7d), "30" (1m), "365" (1y)
//   const [range, setRange] = useState("7");
//   // Currency selection state (default is usd)
//   const [currency, setCurrency] = useState("usd");

//   // Fetch the full list of coins once
//   useEffect(() => {
//     const fetchCoinsList = async () => {
//       try {
//         const { data } = await axios.get(`${server}/coins/list`, {
//           headers: API_HEADERS,
//         });
//         setCoinsList(data);
//       } catch (err) {
//         console.error("Failed to fetch coins list", err);
//       }
//     };
//     fetchCoinsList();
//   }, []);

//   // Update suggestions as user types coin1
//   const handleCoin1Change = (e) => {
//     const value = e.target.value.toLowerCase();
//     setCoin1(value);
//     if (value.length > 0) {
//       const filtered = coinsList.filter(
//         (coin) =>
//           coin.name.toLowerCase().includes(value) ||
//           coin.symbol.toLowerCase().includes(value)
//       );
//       const sorted = filtered.sort((a, b) => {
//         const aStarts = a.name.toLowerCase().startsWith(value) ? 0 : 1;
//         const bStarts = b.name.toLowerCase().startsWith(value) ? 0 : 1;
//         return aStarts - bStarts;
//       });
//       setSuggestions1(sorted.slice(0, 5));
//     } else {
//       setSuggestions1([]);
//     }
//   };

//   // Update suggestions as user types coin2
//   const handleCoin2Change = (e) => {
//     const value = e.target.value.toLowerCase();
//     setCoin2(value);
//     if (value.length > 0) {
//       const filtered = coinsList.filter(
//         (coin) =>
//           coin.name.toLowerCase().includes(value) ||
//           coin.symbol.toLowerCase().includes(value)
//       );
//       const sorted = filtered.sort((a, b) => {
//         const aStarts = a.name.toLowerCase().startsWith(value) ? 0 : 1;
//         const bStarts = b.name.toLowerCase().startsWith(value) ? 0 : 1;
//         return aStarts - bStarts;
//       });
//       setSuggestions2(sorted.slice(0, 5));
//     } else {
//       setSuggestions2([]);
//     }
//   };

//   const selectSuggestion1 = (coinId) => {
//     setCoin1(coinId);
//     setSuggestions1([]);
//   };

//   const selectSuggestion2 = (coinId) => {
//     setCoin2(coinId);
//     setSuggestions2([]);
//   };

//   // Fetch data for both coins based on selected range and currency
//   const fetchData = async () => {
//     if (!coin1 || !coin2) {
//       setError("Please enter both coin IDs.");
//       return;
//     }
//     setError(null);
//     setLoading(true);
//     try {
//       const [res1, res2] = await Promise.all([
//         axios.get(
//           `${server}/coins/${coin1}/market_chart?vs_currency=${currency}&days=${range}`,
//           { headers: API_HEADERS }
//         ),
//         axios.get(
//           `${server}/coins/${coin2}/market_chart?vs_currency=${currency}&days=${range}`,
//           { headers: API_HEADERS }
//         ),
//       ]);
//       setChartData1(res1.data.prices);
//       setChartData2(res2.data.prices);
//     } catch (err) {
//       setError("Error fetching data for one or both coins.");
//     }
//     setLoading(false);
//   };

//   // Helper function to compute the percentage change based on the last two available data points.
//   const computeChange = (data) => {
//     if (data.length < 2) return 0;
//     const prevPrice = data[data.length - 2][1];
//     const latestPrice = data[data.length - 1][1];
//     return ((latestPrice - prevPrice) / prevPrice) * 100;
//   };

//   // OverlappingChart transforms the data to {x, y} format and uses a time scale for the x-axis.
//   const OverlappingChart = ({ data1, data2, label1, label2, range }) => {
//     const transformedData1 = data1.map((item) => ({ x: item[0], y: item[1] }));
//     const transformedData2 = data2.map((item) => ({ x: item[0], y: item[1] }));

//     const chartData = {
//       datasets: [
//         {
//           label: label1,
//           data: transformedData1,
//           borderColor: "red",
//           backgroundColor: "rgba(255, 0, 0, 0.1)",
//           tension: 0.1,
//           fill: false,
//         },
//         {
//           label: label2,
//           data: transformedData2,
//           borderColor: "blue",
//           backgroundColor: "rgba(0, 0, 255, 0.1)",
//           tension: 0.1,
//           fill: false,
//         },
//       ],
//     };

//     const options = {
//       responsive: true,
//       interaction: {
//         mode: "index",
//         intersect: false,
//       },
//       plugins: {
//         tooltip: {
//           enabled: true,
//         },
//         legend: {
//           position: "top",
//         },
//       },
//       scales: {
//         x: {
//           type: "time",
//           time: {
//             unit: range === "1" ? "hour" : range === "7" || range === "30" ? "day" : "month",
//           },
//           ticks: {
//             autoSkip: true,
//             maxTicksLimit: 10,
//           },
//         },
//         y: {
//           beginAtZero: false,
//         },
//       },
//     };

//     return <Line data={chartData} options={options} />;
//   };

//   return (
//     <VStack spacing={6} p="4">
//       <Heading size="lg" color="white">
//         Compare Cryptocurrencies
//       </Heading>
//       {/* Input area with auto-suggestions */}
//       <HStack spacing={4} w="full" pos="relative">
//         <Box flex="1" pos="relative">
//           <Input
//             placeholder="Enter first coin id (e.g., bitcoin)"
//             value={coin1}
//             onChange={handleCoin1Change}
//             bg="white"
//             color="black"
//             pr="10"
//           />
//           <IconButton
//             position="absolute"
//             top="2"
//             right="2"
//             variant="ghost"
//             aria-label="Search"
//             icon={<SearchIcon />}
//           />
//           {suggestions1.length > 0 && (
//             <List
//               border="1px solid"
//               borderColor="gray.300"
//               bg="white"
//               color="black"
//               mt="2"
//               borderRadius="md"
//               maxH="150px"
//               overflowY="auto"
//               pos="absolute"
//               w="100%"
//               zIndex="10"
//             >
//               {suggestions1.map((coin) => (
//                 <ListItem
//                   key={coin.id}
//                   p="2"
//                   _hover={{ bg: "gray.200", cursor: "pointer" }}
//                   onClick={() => selectSuggestion1(coin.id)}
//                 >
//                   {coin.name} ({coin.symbol})
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </Box>

//         <Box flex="1" pos="relative">
//           <Input
//             placeholder="Enter second coin id (e.g., ethereum)"
//             value={coin2}
//             onChange={handleCoin2Change}
//             bg="white"
//             color="black"
//             pr="10"
//           />
//           <IconButton
//             position="absolute"
//             top="2"
//             right="2"
//             variant="ghost"
//             aria-label="Search"
//             icon={<SearchIcon />}
//           />
//           {suggestions2.length > 0 && (
//             <List
//               border="1px solid"
//               borderColor="gray.300"
//               bg="white"
//               color="black"
//               mt="2"
//               borderRadius="md"
//               maxH="150px"
//               overflowY="auto"
//               pos="absolute"
//               w="100%"
//               zIndex="10"
//             >
//               {suggestions2.map((coin) => (
//                 <ListItem
//                   key={coin.id}
//                   p="2"
//                   _hover={{ bg: "gray.200", cursor: "pointer" }}
//                   onClick={() => selectSuggestion2(coin.id)}
//                 >
//                   {coin.name} ({coin.symbol})
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </Box>
//         <Button onClick={fetchData} colorScheme="cyan">
//           Compare
//         </Button>
//       </HStack>

//       {/* Time range selection */}
//       <RadioGroup onChange={setRange} value={range}>
//         <HStack spacing="4">
//           <Radio value="1">24hrs</Radio>
//           <Radio value="7">7 days</Radio>
//           <Radio value="30">1 month</Radio>
//           <Radio value="365">1 year</Radio>
//         </HStack>
//       </RadioGroup>

//       {/* Currency selection */}
//       <RadioGroup onChange={setCurrency} value={currency}>
//         <HStack spacing="4">
//           <Radio value="usd">USD</Radio>
//           <Radio value="inr">INR</Radio>
//           <Radio value="eur">EUR</Radio>
//         </HStack>
//       </RadioGroup>

//       {/* Prediction line placed immediately below currency selection with white background */}
//       {!loading && chartData1.length > 1 && chartData2.length > 1 && (
//         <Box bg="white" p="2" mt="4">
//           <Text color="black">
//             {computeChange(chartData1) === computeChange(chartData2)
//               ? "Both cryptocurrencies are performing equally."
//               : computeChange(chartData1) > computeChange(chartData2)
//               ? `Better to invest into ${coin1.toUpperCase()}, as it shows a ${computeChange(chartData1).toFixed(
//                   2
//                 )}% increase compared to ${computeChange(chartData2).toFixed(2)}% for ${coin2.toUpperCase()}.`
//               : `Better to invest into ${coin2.toUpperCase()}, as it shows a ${computeChange(chartData2).toFixed(
//                   2
//                 )}% increase compared to ${computeChange(chartData1).toFixed(2)}% for ${coin1.toUpperCase()}.`}
//           </Text>
//         </Box>
//       )}

//       {loading && <Loader />}
//       {error && <ErrorComponent message={error} />}
//       {/* Overlapping chart displaying realtime data */}
//       {!loading && chartData1.length > 0 && chartData2.length > 0 && (
//         <Box w="full" p="2">
//           <OverlappingChart
//             data1={chartData1}
//             data2={chartData2}
//             label1={coin1.toUpperCase()}
//             label2={coin2.toUpperCase()}
//             range={range}
//           />
//         </Box>
//       )}
//     </VStack>
//   );
// };

// export default Compare;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  VStack,
  Heading,
  List,
  ListItem,
  IconButton,
  Radio,
  RadioGroup
} from "@chakra-ui/react";
import axios from "axios";
import { server } from "../index";
import { API_HEADERS } from "../config/api";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import { SearchIcon } from "@chakra-ui/icons";

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
ChartJS.register(TimeScale, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Compare = () => {
  // State for coin ids (inputs)
  const [coin1, setCoin1] = useState("");
  const [coin2, setCoin2] = useState("");
  const [coin3, setCoin3] = useState("");
  // Suggestions for each input
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [suggestions3, setSuggestions3] = useState([]);
  // Full list of coins (id and name)
  const [coinsList, setCoinsList] = useState([]);
  // Chart data for each coin
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Time range selection: options "1" (24hrs), "7" (7d), "30" (1m), "365" (1y)
  const [range, setRange] = useState("7");
  // Currency selection state (default is usd)
  const [currency, setCurrency] = useState("usd");

  // Fetch the full list of coins once
  useEffect(() => {
    const fetchCoinsList = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/list`, {
          headers: API_HEADERS,
        });
        setCoinsList(data);
      } catch (err) {
        console.error("Failed to fetch coins list", err);
      }
    };
    fetchCoinsList();
  }, []);

  // Update suggestions for coin1
  const handleCoin1Change = (e) => {
    const value = e.target.value.toLowerCase();
    setCoin1(value);
    if (value.length > 0) {
      const filtered = coinsList.filter(
        (coin) =>
          coin.name.toLowerCase().includes(value) ||
          coin.symbol.toLowerCase().includes(value)
      );
      const sorted = filtered.sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(value) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(value) ? 0 : 1;
        return aStarts - bStarts;
      });
      setSuggestions1(sorted.slice(0, 5));
    } else {
      setSuggestions1([]);
    }
  };

  // Update suggestions for coin2
  const handleCoin2Change = (e) => {
    const value = e.target.value.toLowerCase();
    setCoin2(value);
    if (value.length > 0) {
      const filtered = coinsList.filter(
        (coin) =>
          coin.name.toLowerCase().includes(value) ||
          coin.symbol.toLowerCase().includes(value)
      );
      const sorted = filtered.sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(value) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(value) ? 0 : 1;
        return aStarts - bStarts;
      });
      setSuggestions2(sorted.slice(0, 5));
    } else {
      setSuggestions2([]);
    }
  };

  // Update suggestions for coin3
  const handleCoin3Change = (e) => {
    const value = e.target.value.toLowerCase();
    setCoin3(value);
    if (value.length > 0) {
      const filtered = coinsList.filter(
        (coin) =>
          coin.name.toLowerCase().includes(value) ||
          coin.symbol.toLowerCase().includes(value)
      );
      const sorted = filtered.sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(value) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(value) ? 0 : 1;
        return aStarts - bStarts;
      });
      setSuggestions3(sorted.slice(0, 5));
    } else {
      setSuggestions3([]);
    }
  };

  const selectSuggestion1 = (coinId) => {
    setCoin1(coinId);
    setSuggestions1([]);
  };

  const selectSuggestion2 = (coinId) => {
    setCoin2(coinId);
    setSuggestions2([]);
  };

  const selectSuggestion3 = (coinId) => {
    setCoin3(coinId);
    setSuggestions3([]);
  };

  // Fetch data for two or three coins based on whether coin3 is provided.
  const fetchData = async () => {
    if (!coin1 || !coin2) {
      setError("Please enter at least two coin IDs.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (coin3.trim() === "") {
        // Only compare two coins.
        const [res1, res2] = await Promise.all([
          axios.get(
            `${server}/coins/${coin1}/market_chart?vs_currency=${currency}&days=${range}`,
            { headers: API_HEADERS }
          ),
          axios.get(
            `${server}/coins/${coin2}/market_chart?vs_currency=${currency}&days=${range}`,
            { headers: API_HEADERS }
          ),
        ]);
        setChartData1(res1.data.prices);
        setChartData2(res2.data.prices);
        setChartData3([]);
      } else {
        // Compare three coins.
        const [res1, res2, res3] = await Promise.all([
          axios.get(
            `${server}/coins/${coin1}/market_chart?vs_currency=${currency}&days=${range}`,
            { headers: API_HEADERS }
          ),
          axios.get(
            `${server}/coins/${coin2}/market_chart?vs_currency=${currency}&days=${range}`,
            { headers: API_HEADERS }
          ),
          axios.get(
            `${server}/coins/${coin3}/market_chart?vs_currency=${currency}&days=${range}`,
            { headers: API_HEADERS }
          ),
        ]);
        setChartData1(res1.data.prices);
        setChartData2(res2.data.prices);
        setChartData3(res3.data.prices);
      }
    } catch (err) {
      setError("Error fetching data for the coin(s).");
    }
    setLoading(false);
  };

  // OverlappingChart supports two or three datasets.
  const OverlappingChart = ({ data1, data2, data3, label1, label2, label3, range }) => {
    const transformedData1 = data1.map((item) => ({ x: item[0], y: item[1] }));
    const transformedData2 = data2.map((item) => ({ x: item[0], y: item[1] }));
    const datasets = [
      {
        label: label1,
        data: transformedData1,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        tension: 0.1,
        fill: false,
      },
      {
        label: label2,
        data: transformedData2,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.1,
        fill: false,
      },
    ];

    if (data3 && data3.length > 0 && label3) {
      const transformedData3 = data3.map((item) => ({ x: item[0], y: item[1] }));
      datasets.push({
        label: label3,
        data: transformedData3,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        tension: 0.1,
        fill: false,
      });
    }

    const chartData = { datasets };

    const options = {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        tooltip: {
          enabled: true,
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit:
              range === "1"
                ? "hour"
                : range === "7" || range === "30"
                ? "day"
                : "month",
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          beginAtZero: false,
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  return (
    <VStack spacing={6} p="4">
      <Heading size="lg" color="black">
        Compare Cryptocurrencies
      </Heading>
      {/* Input area for 2 or 3 coin IDs with auto-suggestions */}
      <HStack spacing={4} w="full" pos="relative">
        <Box flex="1" pos="relative">
          <Input
            placeholder="Enter first coin id (e.g., bitcoin)"
            value={coin1}
            onChange={handleCoin1Change}
            bg="white"
            color="black"
            pr="10"
          />
          <IconButton
            position="absolute"
            top="2"
            right="2"
            variant="ghost"
            aria-label="Search"
            icon={<SearchIcon />}
          />
          {suggestions1.length > 0 && (
            <List
              border="1px solid"
              borderColor="gray.300"
              bg="white"
              color="black"
              mt="2"
              borderRadius="md"
              maxH="150px"
              overflowY="auto"
              pos="absolute"
              w="100%"
              zIndex="10"
            >
              {suggestions1.map((coin) => (
                <ListItem
                  key={coin.id}
                  p="2"
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  onClick={() => selectSuggestion1(coin.id)}
                >
                  {coin.name} ({coin.symbol})
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box flex="1" pos="relative">
          <Input
            placeholder="Enter second coin id (e.g., ethereum)"
            value={coin2}
            onChange={handleCoin2Change}
            bg="white"
            color="black"
            pr="10"
          />
          <IconButton
            position="absolute"
            top="2"
            right="2"
            variant="ghost"
            aria-label="Search"
            icon={<SearchIcon />}
          />
          {suggestions2.length > 0 && (
            <List
              border="1px solid"
              borderColor="gray.300"
              bg="white"
              color="black"
              mt="2"
              borderRadius="md"
              maxH="150px"
              overflowY="auto"
              pos="absolute"
              w="100%"
              zIndex="10"
            >
              {suggestions2.map((coin) => (
                <ListItem
                  key={coin.id}
                  p="2"
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  onClick={() => selectSuggestion2(coin.id)}
                >
                  {coin.name} ({coin.symbol})
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box flex="1" pos="relative">
          <Input
            placeholder="Enter third coin id (optional, e.g., litecoin)"
            value={coin3}
            onChange={handleCoin3Change}
            bg="white"
            color="black"
            pr="10"
          />
          <IconButton
            position="absolute"
            top="2"
            right="2"
            variant="ghost"
            aria-label="Search"
            icon={<SearchIcon />}
          />
          {suggestions3.length > 0 && (
            <List
              border="1px solid"
              borderColor="gray.300"
              bg="white"
              color="black"
              mt="2"
              borderRadius="md"
              maxH="150px"
              overflowY="auto"
              pos="absolute"
              w="100%"
              zIndex="10"
            >
              {suggestions3.map((coin) => (
                <ListItem
                  key={coin.id}
                  p="2"
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  onClick={() => selectSuggestion3(coin.id)}
                >
                  {coin.name} ({coin.symbol})
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Button onClick={fetchData} colorScheme="cyan">
          Compare
        </Button>
      </HStack>

      {/* Time range selection */}
      <RadioGroup onChange={setRange} value={range}>
        <HStack spacing="4">
          <Radio value="1">24hrs</Radio>
          <Radio value="7">7 days</Radio>
          <Radio value="30">1 month</Radio>
          <Radio value="365">1 year</Radio>
        </HStack>
      </RadioGroup>

      {/* Currency selection */}
      <RadioGroup onChange={setCurrency} value={currency}>
        <HStack spacing="4">
          <Radio value="usd">USD</Radio>
          <Radio value="inr">INR</Radio>
          <Radio value="eur">EUR</Radio>
        </HStack>
      </RadioGroup>

      {loading && <Loader />}
      {error && <ErrorComponent message={error} />}

      {/* Overlapping chart */}
      {!loading &&
        chartData1.length > 0 &&
        chartData2.length > 0 &&
        (coin3.trim() === "" || chartData3.length > 0) && (
          <Box w="full" p="2">
            <OverlappingChart
              data1={chartData1}
              data2={chartData2}
              data3={coin3.trim() !== "" ? chartData3 : []}
              label1={coin1.toUpperCase()}
              label2={coin2.toUpperCase()}
              label3={coin3.trim() !== "" ? coin3.toUpperCase() : ""}
              range={range}
            />
          </Box>
        )}
    </VStack>
  );
};

export default Compare;