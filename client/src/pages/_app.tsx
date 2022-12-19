import { ChakraProvider } from "@chakra-ui/react";

import { AppProps } from "next/app";
import { createClient, Provider } from "urql";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import theme from "../theme";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include", // include cookies
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <DarkModeSwitch />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
