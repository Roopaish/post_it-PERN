import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useQuery } from "urql";
import Layout from "../components/Layout";
import { PostsDocument } from "../gql/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = useQuery({ query: PostsDocument });

  return (
    <Layout>
      <Link href="/create-post">Create Post</Link>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
