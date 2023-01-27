import { Box, Button, Flex, Heading, useColorMode } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";

import { useApolloClient, useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import NextLink from "next/link";
import { LogoutDocument, MeDocument } from "../gql/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const { colorMode } = useColorMode();
  const apolloClient = useApolloClient();
  const { data, loading: fetching } = useQuery(MeDocument, {
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching }] = useMutation(LogoutDocument);

  const [body, setBody] = useState<ReactElement>(<></>);

  useEffect(() => {
    console.log(data);
    if (fetching) {
    } else if (!data?.me) {
      setBody(
        <div>
          <NextLink href="/login">
            <Button mr={2}>Login</Button>
          </NextLink>
          <NextLink href="/register">
            <Button>Register</Button>
          </NextLink>
        </div>
      );
    } else {
      setBody(
        <Flex justifyContent="flex-end" align="center">
          <Button mr={4}>
            <NextLink href="/create-post">Create Post</NextLink>
          </Button>
          <Box mr={2}>{data?.me?.username}</Box>
          <Button
            isLoading={logoutFetching}
            onClick={async () => {
              await logout({});
              apolloClient.resetStore();
            }}
          >
            Logout
          </Button>
        </Flex>
      );
    }
  }, [fetching, data]);

  return (
    <Flex
      bg={colorMode === "light" ? "purple.400" : "blueviolet"}
      position="sticky"
      top="0"
      zIndex="1000"
      p={4}
      ml="auto"
    >
      <Flex
        flex={1}
        maxW={800}
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <NextLink href="/">
          <Heading>Post-it</Heading>
        </NextLink>
        <Box ml="auto" textAlign="right">
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
