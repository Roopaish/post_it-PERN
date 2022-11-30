## Commands

- `tsc -w` to watch file changes and compile
- `node dist/index.js` runs the compiled js version of the server
- `nodemon dist/index.js` to re-run app on changes
- `npx mikro-orm migration:create` to create new migrations from cli

## Packages

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "watch": "tsc -w",
    "dev": "nodemon dist/index.js",
    "start": "node dist/index.js",
    "start:ts": "ts-node src/index.ts",
    "dev:ts": "nodemon --exec ts-node src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^18.11.9",
    "nodemon": "^2.0.20",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.3"
  },
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
    "type-graphql": "^1.1.1"
  },
  /* config for mikro-orm */
  "mikro-orm": {
    "useTsNode": true,
    "configPaths": ["./src/mikro-orm.config.ts", "./dist/mikro-orm.config.js"]
  }
}
```
