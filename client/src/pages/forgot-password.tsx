import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useState } from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { ForgotPasswordDocument } from "../gql/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword = () => {
  const [, forgotPassword] = useMutation(ForgotPasswordDocument);
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <div>If an account with the email exists, we'll sent an email.</div>
          ) : (
            <Form>
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                type="email"
              />
              <Button
                mt="8px"
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
