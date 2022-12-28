import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { RegisterDocument } from "../gql/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  const router = useRouter();
  const [, register] = useMutation(RegisterDocument);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ input: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Box mt="8px">
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />
              </Box>
              <Box mt="8px">
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt="8px"
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(RegisterPage);
