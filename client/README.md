## Packages

```json
{
  "dependencies": {
    "@chakra-ui/icons": "^2.0.2",
    "@chakra-ui/react": "^2.2.1", // chakra-ui is a great ui library
    "@chakra-ui/theme-tools": "^2.0.2",
    "@emotion/react": "^11.9.0",
    "@emotion/styled": "^11.9.0",
    "formik": "^2.2.9", // working with forms is easy with formik
    "graphql": "^16.6.0", // working to graphql apis
    "next": "latest",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "urql": "^3.0.3" // graphql client
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^2.16.1", // to generate graphql types from the source endpoint
    "@types/node": "^18.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.7.2"
  }
}
```

## graphql-codegen/cli

- yarn graphql-codegen init
- Fill out the questions as required

```bash
? What type of application are you building? Application built with React
? Where is your schema? :(path or url) http://localhost:4000/graphql
? Where are your operations fragments?: src/graphql/**/*.graphql
? Where to write the output: src/gql
? Do you want to generate an introspection file? No
? How to name the config file? codegen.ts
? What script in package.json should run the co&gen? gen
```

- yarn gen to generate the types and watch for changes and put them in the src/gql folder
- Using it with any graphql client

```tsx
// all the argument and return types are generated
import { useMutation } from "urql";
import { RegisterDocument } from "../gql/graphql";

const Home = () => {
  const [, register] = useMutation(RegisterDocument);
  ...
};
```
