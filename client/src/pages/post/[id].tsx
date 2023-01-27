import { useQuery } from "@apollo/client";
import { Box, Heading } from "@chakra-ui/react";
import type { FC } from "react";
import Layout from "../../components/Layout";
import PostButtons from "../../components/PostButtons";
import { PostDocument } from "../../gql/graphql";
import { useGetIntId } from "../../utils/useGetIntId";

interface PostProps {}

const Post: FC<PostProps> = () => {
  const intId = useGetIntId();
  const { data, loading: fetching } = useQuery(PostDocument, {
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

export default Post;
