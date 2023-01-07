import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "urql";
import Layout from "../components/Layout";
import { PostsDocument } from "../gql/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = useQuery({
    query: PostsDocument,
    variables,
  });

  return (
    <Layout>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>Post It</Heading>
        <Link href="/create-post">Create Post</Link>
      </Flex>
      <br />
      {!fetching && !data ? (
        <div>you got not data some reason</div>
      ) : (
        <>
          {!data && fetching ? (
            <div>loading...</div>
          ) : (
            <Stack spacing={8}>
              {data!.posts.posts.map((post) => {
                return (
                  <Box key={post.id} borderWidth="1px" shadow="md" p={5}>
                    <Heading size="md">{post.title}</Heading>
                    <Text>{post.textSnippet}</Text>
                  </Box>
                );
              })}
            </Stack>
          )}
          {data && data.posts.hasMore ? (
            <Flex>
              <Button
                onClick={() => {
                  setVariables({
                    limit: variables.limit,
                    cursor:
                      data.posts.posts[data.posts.posts.length - 1].createdAt,
                  });
                }}
                isLoading={fetching}
                m="auto"
                my={8}
              >
                Load More
              </Button>
            </Flex>
          ) : null}
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
