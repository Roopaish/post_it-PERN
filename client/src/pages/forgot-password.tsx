import { useMutation } from "@apollo/client/react";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { ForgotPasswordDocument } from "../gql/graphql";

const ForgotPassword = () => {
  const [forgotPassword] = useMutation(ForgotPasswordDocument);
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword({ variables: values });
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

export default ForgotPassword;
