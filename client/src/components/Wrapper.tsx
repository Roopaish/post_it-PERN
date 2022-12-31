import { Box } from "@chakra-ui/react";
import React from "react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  children: React.ReactNode;
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box
      maxW={variant == "regular" ? "800px" : "400px"}
      w="100%"
      mt="8px"
      mx="auto"
      p="10px 20px"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
