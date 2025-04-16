

import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index";
import { API_HEADERS } from "../config/api";
import {
  Container,
  Heading,
  Image,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges`, {
          headers: API_HEADERS,
        });
        setExchanges(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  if (error)
    return <ErrorComponent message={"Error While Fetching Exchanges"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <SimpleGrid
          columns={4}
          spacing="8"
          p="8"
          // This templateRows property sets a grid of up to 25 rows (adjust if needed)
          templateRows="repeat(25, 1fr)"
        >
          {exchanges.map((exchange) => (
            <ExchangeCard
              key={exchange.id}
              name={exchange.name}
              img={exchange.image}
              rank={exchange.trust_score_rank}
              url={exchange.url}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

const ExchangeCard = ({ name, img, rank, url }) => (
  <a href={url} target={"_blank"} rel="noreferrer">
    <VStack
      w={"52"}
      shadow={"lg"}
      p={"8"}
      borderRadius={"lg"}
      transition={"all 0.3s"}
      m={"4"}
      css={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Image
        src={img}
        w={"10"}
        h={"10"}
        objectFit={"contain"}
        alt={"Exchange"}
      />
      <Heading size={"md"} noOfLines={1}>
        {rank}
      </Heading>
      <Text noOfLines={1}>{name}</Text>
    </VStack>
  </a>
);

export default Exchanges;