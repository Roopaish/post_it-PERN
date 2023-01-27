import { useMutation } from "@apollo/client/react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, RegisterDocument } from "../gql/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

const RegisterPage = () => {
  const router = useRouter();
  const [register] = useMutation(RegisterDocument);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { input: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
            },
          });
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

export default withApollo()(RegisterPage);
