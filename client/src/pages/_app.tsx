import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <DarkModeSwitch />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
