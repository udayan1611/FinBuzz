// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../index";
// import { API_HEADERS } from "../config/api";
// import { Button, Container, HStack, Radio, RadioGroup } from "@chakra-ui/react";
// import Loader from "./Loader";
// import ErrorComponent from "./ErrorComponent";
// import CoinCard from "./CoinCard";

// const Coins = () => {
//   const [coins, setCoins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [currency, setCurrency] = useState("inr");

//   const currencySymbol =
//     currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

//   const changePage = (page) => {
//     setPage(page);
//     setLoading(true);
//   };

//   const btns = new Array(132).fill(1);

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const { data } = await axios.get(
//           `${server}/coins/markets?vs_currency=${currency}&page=${page}`,
//           { headers: API_HEADERS }
//         );
//         setCoins(data);
//         setLoading(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchCoins();
//   }, [currency, page]);

//   if (error) return <ErrorComponent message={"Error While Fetching Coins"} />;

//   return (
//     <Container maxW={"container.xl"}>
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
//             <HStack spacing={"4"}>
//               <Radio value={"inr"}>INR</Radio>
//               <Radio value={"usd"}>USD</Radio>
//               <Radio value={"eur"}>EUR</Radio>
//             </HStack>
//           </RadioGroup>

//           <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
//             {coins.map((i) => (
//               <CoinCard
//                 id={i.id}
//                 key={i.id}
//                 name={i.name}
//                 price={i.current_price}
//                 img={i.image}
//                 symbol={i.symbol}
//                 currencySymbol={currencySymbol}
//               />
//             ))}
//           </HStack>

//           <HStack w={"full"} overflowX={"auto"} p={"8"}>
//             {btns.map((item, index) => (
//               <Button
//                 key={index}
//                 bgColor={"blackAlpha.900"}
//                 color={"white"}
//                 onClick={() => changePage(index + 1)}
//               >
//                 {index + 1}
//               </Button>
//             ))}
//           </HStack>
//         </>
//       )}
//     </Container>
//   );
// };

// export default Coins;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../index";
// import { API_HEADERS } from "../config/api";
// import {
//   Button,
//   Container,
//   HStack,
//   List,
//   ListItem,
//   Radio,
//   RadioGroup
// } from "@chakra-ui/react";
// import Loader from "./Loader";
// import ErrorComponent from "./ErrorComponent";
// import CoinCard from "./CoinCard";

// const Coins = () => {
//   const [coins, setCoins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [currency, setCurrency] = useState("inr");

//   const currencySymbol =
//     currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

//   const changePage = (pageNumber) => {
//     setPage(pageNumber);
//     setLoading(true);
//   };

//   // Create an array for pagination buttons (example: 132 pages)
//   const btns = new Array(132).fill(1);

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const { data } = await axios.get(
//           `${server}/coins/markets?vs_currency=${currency}&page=${page}`,
//           { headers: API_HEADERS }
//         );
//         setCoins(data);
//         setLoading(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchCoins();
//   }, [currency, page]);

//   if (error) return <ErrorComponent message={"Error While Fetching Coins"} />;

//   return (
//     <Container maxW={"container.xl"}>
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
//             <HStack spacing={"4"}>
//               <Radio value={"inr"}>INR</Radio>
//               <Radio value={"usd"}>USD</Radio>
//               <Radio value={"eur"}>EUR</Radio>
//             </HStack>
//           </RadioGroup>

//           {/* Coins list displayed in a scrollable, centered list */}
//           <List spacing={4} maxH="70vh" overflowY="scroll" p="8">
//             {coins.map((coin) => (
//               <ListItem key={coin.id}>
//                 <CoinCard
//                   id={coin.id}
//                   name={coin.name}
//                   img={coin.image}
//                   symbol={coin.symbol}
//                   price={coin.current_price}
//                   currencySymbol={currencySymbol}
//                 />
//               </ListItem>
//             ))}
//           </List>

//           {/* Pagination buttons */}
//           <HStack w={"full"} overflowX={"auto"} p={"8"}>
//             {btns.map((item, index) => (
//               <Button
//                 key={index}
//                 bgColor={"blackAlpha.900"}
//                 color={"white"}
//                 onClick={() => changePage(index + 1)}
//               >
//                 {index + 1}
//               </Button>
//             ))}
//           </HStack>
//         </>
//       )}
//     </Container>
//   );
// };

// export default Coins;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index";
import { API_HEADERS } from "../config/api";
import {
  Button,
  Container,
  HStack,
  List,
  ListItem,
  Radio,
  RadioGroup,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import CoinCard from "./CoinCard";
import GridCoinCard from "./GridCoinCard";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");
  // Toggle state: "list" or "grid"
  const [layout, setLayout] = useState("grid");

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const changePage = (pageNumber) => {
    setPage(pageNumber);
    setLoading(true);
  };

  // Example: 132 pagination buttons
  const btns = new Array(132).fill(1);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currency}&page=${page}`,
          { headers: API_HEADERS }
        );
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoins();
  }, [currency, page]);

  if (error) return <ErrorComponent message={"Error While Fetching Coins"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <VStack spacing={"4"} p={"8"}>
            <RadioGroup value={currency} onChange={setCurrency}>
              <HStack spacing={"4"}>
                <Radio value={"inr"}>INR</Radio>
                <Radio value={"usd"}>USD</Radio>
                <Radio value={"eur"}>EUR</Radio>
              </HStack>
            </RadioGroup>
            {/* Toggle layout button */}
            <Button
              alignSelf="flex-end"
              onClick={() => setLayout(layout === "grid" ? "list" : "grid")}
              bgColor="blackAlpha.900"
              color="white"
            >
              {layout === "grid" ? "Switch to List View" : "Switch to Grid View"}
            </Button>
          </VStack>

          {layout === "list" ? (
            // List view: scrollable vertical list using the HStack-based CoinCard
            <List spacing={4} maxH="70vh" overflowY="scroll" p="8">
              {coins.map((coin) => (
                <ListItem key={coin.id}>
                  <CoinCard
                    id={coin.id}
                    name={coin.name}
                    img={coin.image}
                    symbol={coin.symbol}
                    price={coin.current_price}
                    currencySymbol={currencySymbol}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            // Grid view: using the GridCoinCard (VStack-based) layout
            <Wrap spacing="4" justify="center" p="8">
              {coins.map((coin) => (
                <WrapItem key={coin.id}>
                  <GridCoinCard
                    id={coin.id}
                    name={coin.name}
                    img={coin.image}
                    symbol={coin.symbol}
                    price={coin.current_price}
                    currencySymbol={currencySymbol}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}

          {/* Pagination Buttons */}
          <HStack w={"full"} overflowX={"auto"} p={"8"}>
            {btns.map((item, index) => (
              <Button
                key={index}
                bgColor={"blackAlpha.900"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;

