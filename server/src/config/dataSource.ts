import { DataSource } from "typeorm";
console.log(__dirname, "./migrations/*.js");
export const dataSource = new DataSource({
  type: "postgres",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER,
  logging: true,
  synchronize: true,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
});
