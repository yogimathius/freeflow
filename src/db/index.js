const pg = require("pg");

const client = new pg.Client({
  user: "aeunenyrcobiwo",
  password: "3ff7cf3833afa86838e9c9e7abe1053d8674f7e2702b983fddb322a608530a64",
  database: "dacbq559bp3ulv",
  // port: 5432,
  host: "ec2-34-194-73-236.compute-1.amazonaws.com",
  ssl: {rejectUnauthorized: false}
});

client
  .connect()
  .catch((e) => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;
