## Commands

- `tsc -w` to watch file changes and compile
- `node dist/index.js` runs the compiled js version of the server
- `nodemon dist/index.js` to re-run app on changes
- `npx mikro-orm migration:create` to create new migrations from cli
- `npx typeorm migration:create ./src/migrations` to create new migrations from cli

## Packages

```json
{
  "scripts": {
    "watch": "tsc -w",
    "dev": "nodemon dist/index.js",
    "start": "node dist/index.js",
    "start:ts": "ts-node src/index.ts",
    "dev:ts": "nodemon --exec ts-node src/index.ts",
    "create:migration": "mikro-orm migration:create" // create new migrations when schema changes
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
    "pg": "^8.8.0", // postgres client
    "type-graphql": "^1.1.1",
    "connect-redis": "^6.1.3",
    "redis": "^4.5.1", // using redis database for faster read and write of session data
    "express-session": "^1.17.3",
    "ioredis": "^5.2.4", // replacing redis package with ioredis because its better
    "uuid": "^9.0.0" // generating unique ids
  },
  /* config for mikro-orm */
  "mikro-orm": {
    "useTsNode": true,
    "configPaths": ["./src/mikro-orm.config.ts", "./dist/mikro-orm.config.js"]
  }
}
```

## How session-cookie authentication works?

- `req.session.userId = user.id`  
   this sets session data,  
   then anything stuck in session is saved in redis database  
   eg: {userId: 1} is saved with a generated key like  
  `someKey -> {userId: 1}`
- express-session will then set a cookie in the browser with the session id  
  eg: `someCookieValue`, it is a signed/encrypted version of the `someKey` generated with a `secretKey`
- when the user makes a request, the cookie is sent to the server
  `someCookieValue >>> server`
- server unsigns/decrypts `someCookieValue` using `secretKey` to get `someKey`
- then we look for value of `someKey` in redis database getting `{userId: 1}` which is stored as session data on the server i.e. `req.session`
