import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";

import NextLink from "next/link";
import { useQuery } from "urql";
import { MeDocument } from "../gql/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useQuery({ query: MeDocument });

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box>{data?.me?.username}</Box>
        <Button>Logout</Button>
      </Flex>
    );
  }

  return (
    <Box bg="tomato" p={4} ml="auto">
      <Box ml="auto" textAlign="right">
        {body}
      </Box>
    </Box>
  );
};

export default NavBar;
