import { useMutation } from "@apollo/client/react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { CreatePostDocument } from "../gql/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost = () => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useMutation(CreatePostDocument);

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (!errors) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Title"
              placeholder="Enter the title"
              name="title"
            />
            <Box mt="8px">
              <InputField
                textarea
                label="Body"
                placeholder="Body"
                name="text"
                style={{ height: 200 }}
              />
            </Box>
            <Button
              mt="8px"
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo()(CreatePost);
