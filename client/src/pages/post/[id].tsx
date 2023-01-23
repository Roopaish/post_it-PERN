import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import type { FC } from "react";
import { useQuery } from "urql";
import Layout from "../../components/Layout";
import PostButtons from "../../components/PostButtons";
import { PostDocument } from "../../gql/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetIntId } from "../../utils/useGetIntId";

interface PostProps {}

const Post: FC<PostProps> = () => {
  const intId = useGetIntId();
  const [{ data, fetching }] = useQuery({
    query: PostDocument,
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

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
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      {data.post.text}
      <Box mt={4}>
        <PostButtons id={data.post.id} creatorId={data.post.creatorId} />
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
