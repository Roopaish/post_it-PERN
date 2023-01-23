import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { useMutation, useQuery } from "urql";
import { DeletePostDocument, MeDocument } from "../gql/graphql";

interface PostButtonsProps {
  id: number;
  creatorId: number;
}

const PostButtons: React.FC<PostButtonsProps> = ({ id, creatorId }) => {
  const [{ data: user }] = useQuery({ query: MeDocument });
  const [, deletePost] = useMutation(DeletePostDocument);

  return user?.me && user?.me.id === creatorId ? (
    <>
      <Link href={`/post/edit/${id}`}>
        <IconButton aria-label="edit" mr={2}>
          <EditIcon />
        </IconButton>
      </Link>
      <IconButton
        aria-label="delete"
        bgColor="red.600"
        onClick={() => deletePost({ id })}
      >
        <DeleteIcon color="white" />
      </IconButton>
    </>
  ) : null;
};

export default PostButtons;
