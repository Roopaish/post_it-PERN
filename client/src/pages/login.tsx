import { useMutation } from "@apollo/client/react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { LoginDocument, MeDocument, MeQuery } from "../gql/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

const LoginPage = () => {
  const router = useRouter();
  const [login] = useMutation(LoginDocument);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          usernameOrEmail: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="Username/Email"
              />
              <Box mt="8px">
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Box mt="8px">
                <NextLink href="/forgot-password">Forgot Password?</NextLink>
              </Box>
              <Button
                mt="8px"
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withApollo()(LoginPage);
