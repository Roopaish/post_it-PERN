import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { withApollo as createWithApollo } from "next-apollo";
import { PaginatedPosts } from "../gql/graphql";

const createClient = (ctx?: NextPageContext) =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      // pagination of posts
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts ?? []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
    credentials: "include",
  });

export const withApollo = createWithApollo(createClient);
