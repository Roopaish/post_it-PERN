import { Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useQuery } from "urql";
import NavBar from "../components/NavBar";
import { PostsDocument } from "../gql/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = useQuery({ query: PostsDocument });

  return (
    <>
      <NavBar />
      <Text>Hello World!</Text>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
