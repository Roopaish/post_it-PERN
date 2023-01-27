import { useMutation } from "@apollo/client/react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { ChangePasswordDocument } from "../../gql/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword = () => {
  const [changePassword] = useMutation(ChangePasswordDocument);
  const [tokenErr, setTokenErr] = useState("");

  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);

            if ("token" in errorMap) {
              setTokenErr(errorMap.token);
            } else {
              setErrors(errorMap);
            }
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="New Password"
              name="newPassword"
              placeholder="New Password"
              type="password"
            />
            {tokenErr ? (
              <Flex>
                <Box mr={2} color="red">
                  {tokenErr}
                </Box>
                <NextLink href="/forgot-password">Generate new one?</NextLink>
              </Flex>
            ) : null}
            <Button
              mt="8px"
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
