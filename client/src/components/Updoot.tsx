import { ApolloCache, gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import {
  MeDocument,
  PostSnippetFragment,
  VoteDocument,
  VoteMutation,
} from "../gql/graphql";
interface UpdootProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }

    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

const Updoot: FC<UpdootProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useMutation(VoteDocument);
  const { data, loading } = useQuery(MeDocument);
  const router = useRouter();

  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (!loading && !data?.me) {
            router.push("/login?next=" + router.pathname);
            return;
          }
          if (post.voteStatus === 1) return;
          setLoadingState("updoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        aria-label="up-vote"
        bgColor={post.voteStatus === 1 ? "green.500" : undefined}
        isLoading={loadingState === "updoot-loading"}
      >
        <ChevronUpIcon fontSize={24} />
      </IconButton>

      {post.points}
      <IconButton
        onClick={async () => {
          if (!loading && !data?.me) {
            router.push("/login?next=" + router.pathname);
            return;
          }
          if (post.voteStatus === -1) return;

          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        aria-label="down-vote"
        bgColor={post.voteStatus === -1 ? "red.500" : undefined}
        isLoading={loadingState === "downdoot-loading"}
      >
        <ChevronDownIcon fontSize={24} />
      </IconButton>
    </Flex>
  );
};

export default Updoot;
