import { Box, Button, Flex, useColorMode } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";

import NextLink from "next/link";
import { useMutation, useQuery } from "urql";
import { LogoutDocument, MeDocument } from "../gql/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [{ data, fetching }] = useQuery({
    query: MeDocument,
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);

  const [body, setBody] = useState<ReactElement>(<></>);

  useEffect(() => {
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
  }, [fetching, data]);

  return (
    <Box
      bg={colorMode === "light" ? "purple.400" : "blueviolet"}
      position="sticky"
      top="0"
      zIndex="1000"
      p={4}
      ml="auto"
    >
      <Box ml="auto" textAlign="right">
        {body}
      </Box>
    </Box>
  );
};

export default NavBar;
