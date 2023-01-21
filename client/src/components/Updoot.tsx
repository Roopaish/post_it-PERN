import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useMutation } from "urql";
import { PostSnippetFragment, VoteDocument } from "../gql/graphql";

interface UpdootProps {
  post: PostSnippetFragment;
}

const Updoot: FC<UpdootProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useMutation(VoteDocument);
  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
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
          if (post.voteStatus === -1) return;

          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
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
