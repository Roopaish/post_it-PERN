import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useMutation, useQuery } from "urql";
import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import { PostDocument, UpdatePostDocument } from "../../../gql/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useIsAuth } from "../../../utils/useIsAuth";

interface EditPostProps {}

const EditPost: FC<EditPostProps> = () => {
  const router = useRouter();
  const intId = useGetIntId();
  useIsAuth();
  const [{ data, fetching }] = useQuery({
    query: PostDocument,
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  const [, updatePost] = useMutation(UpdatePostDocument);

  if (fetching) {
    return <Layout>loading...</Layout>;
  }

  if (!data?.post)
    return (
      <Layout>
        <Heading>Could not find post</Heading>
      </Layout>
    );

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data?.post?.title ?? "",
          text: data?.post?.text ?? "",
        }}
        onSubmit={async (values) => {
          const { error } = await updatePost({ id: intId, ...values });
          if (!error) {
            router.push("/");
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
                style={{ minHeight: 200 }}
              />
            </Box>
            <Button
              mt="8px"
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
