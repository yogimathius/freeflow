const pg = require("pg");

const client = new pg.Client({
  user: "hrzzfkujdrnush",
  password: "03f2cb63b479f8c299251bae3cbc7c01a8ba902f6c553a8abc50e097b8951233",
  database: "dbjg02odg83ppr",
  // port: 5432,
  host: "ec2-54-208-11-146.compute-1.amazonaws.com",
  ssl: {rejectUnauthorized: false}
});

client
  .connect()
  .catch((e) => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;
