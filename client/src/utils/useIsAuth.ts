import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { MeDocument } from "../gql/graphql";

export const useIsAuth = () => {
  const { data, loading } = useQuery(MeDocument);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/login?next=" + router.pathname);
    }
  }, [data, router]);
};
