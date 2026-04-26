// Simple Knex client wrapper
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import knex from "knex";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require("../../knexfile");

const db = knex(knexConfig);

export default db;
