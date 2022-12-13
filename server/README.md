## Commands

- `tsc -w` to watch file changes and compile
- `node dist/index.js` runs the compiled js version of the server
- `nodemon dist/index.js` to re-run app on changes
- `npx mikro-orm migration:create` to create new migrations from cli

## Packages

```json
{
  "dependencies": {
    "@mikro-orm/cli": "^5.5.3",
    "@mikro-orm/core": "^5.5.3",
    "@mikro-orm/migrations": "^5.5.3",
    "@mikro-orm/postgresql": "^5.5.3",
    "apollo-server-express": "^3.11.1", // helps creating graphql endpoints easily
    "argon2": "^0.30.2", // hashing password
    "dotenv-safe": "^8.2.0",
    "express": "^4.18.2", // our server with great middleware
    "graphql": "^16.6.0",
    "pg": "^8.8.0",
    "type-graphql": "^1.1.1",
    "connect-redis": "^6.1.3",
    "redis": "^4.5.1", // using redis database for faster read and write of session data
    "express-session": "^1.17.3"
  },
  /* config for mikro-orm */
  "mikro-orm": {
    "useTsNode": true,
    "configPaths": ["./src/mikro-orm.config.ts", "./dist/mikro-orm.config.js"]
  }
}
```
