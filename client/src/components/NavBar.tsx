import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";

import NextLink from "next/link";
import { useMutation, useQuery } from "urql";
import { LogoutDocument, MeDocument } from "../gql/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useQuery({ query: MeDocument });
  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);

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
      <Flex justifyContent="flex-end" align="center">
        <Box mr={2}>{data?.me?.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={() => {
            logout({});
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Box bg="tan" p={4} ml="auto">
      <Box ml="auto" textAlign="right">
        {body}
      </Box>
    </Box>
  );
};

export default NavBar;
