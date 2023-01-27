import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import Layout from "../components/Layout";
import PostButtons from "../components/PostButtons";
import Updoot from "../components/Updoot";
import { PostsDocument } from "../gql/graphql";

const Index = () => {
  const {
    loading: fetching,
    error,
    data,
    fetchMore,
    variables,
  } = useQuery(PostsDocument, {
    variables: {
      limit: 10,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <Layout>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading fontSize={20}>New Posts</Heading>
      </Flex>
      <br />
      {!fetching && !data ? (
        <div>{error?.message}</div>
      ) : (
        <>
          {!data && fetching ? (
            <div>loading...</div>
          ) : (
            <Stack spacing={8}>
              {data!.posts.posts.map((post) => {
                return !post ? null : (
                  <Flex
                    key={post.id}
                    borderWidth="1px"
                    shadow="md"
                    p={5}
                    alignItems="center"
                  >
                    <Updoot post={post} />
                    <Box flex={1}>
                      <Heading size="md">
                        <Link href={`/post/${post.id}`}>{post.title}</Link>
                      </Heading>
                      post by {post.creator.username}
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                      >
                        <Text mr={2}>{post.textSnippet}</Text>
                        <div>
                          <PostButtons
                            id={post.id}
                            creatorId={post.creatorId}
                          />
                        </div>
                      </Flex>
                    </Box>
                  </Flex>
                );
              })}
            </Stack>
          )}
          {data && data.posts.hasMore ? (
            <Flex>
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {
                      limit: variables?.limit,
                      cursor:
                        data.posts.posts[data.posts.posts.length - 1].createdAt,
                    },
                    // use updateQuery or use typePolicies in memory cache to update the cache in client
                    // updateQuery(
                    //   previousValue,
                    //   { fetchMoreResult }
                    // ): PostsQuery {
                    //   if (!fetchMoreResult) {
                    //     return previousValue;
                    //   }

                    //   return {
                    //     __typename: "Query",
                    //     posts: {
                    //       __typename: "PaginatedPosts",
                    //       hasMore: (fetchMoreResult as PostsQuery).posts
                    //         .hasMore,
                    //       posts: [
                    //         ...(previousValue as PostsQuery).posts.posts,
                    //         ...(fetchMoreResult as PostsQuery).posts.posts,
                    //       ],
                    //     },
                    //   };
                    // },
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

export default Index;
