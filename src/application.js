const fs = require("fs");
const path = require("path");

const express = require("express");
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

// const QueryRoot = new graphql.GraphQLObjectType({
//   name: 'Query',
//   fields: () => ({
//     hello: {
//       type: graphql.GraphQLString,
//       resolve: () => "Hello world!"
//     }
//   })
// })

// const schema = new graphql.GraphQLSchema({ query: QueryRoot });

const app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   graphiql: true,
// }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const db = require("./db");

const comments = require("./routes/comments");
const likes = require("./routes/likes");
const userSkills = require("./routes/user_skills");
const messages = require("./routes/messages");
const userMessages = require("./routes/messages");
const posts = require("./routes/posts");
const postsSkills = require("./routes/posts_skills");
const dbSkills = require("./routes/db_skills");
const index = require("./routes/index");
const login = require("./routes/login-logout");
const experiences = require("./routes/experiences");
const users = require("./routes/users");
const register = require("./routes/register");

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8",
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}




module.exports = function application(
  ENV,
  actions = { updateComments: () => {}, deleteComments: () => {} }
) {
  
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
 
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
 
    // Pass to next layer of middleware
    next();
 });
     
  app.use(helmet());
  app.use(bodyparser.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyparser.urlencoded({ extended: true }));

  app.use("/api", comments(db, actions.updateComments, actions.deleteComments));
  app.use("/api", likes(db));
  app.use("/api", userSkills(db));
  app.use("/api", messages(db));
  app.use("/api", posts(db));
  app.use("/api", postsSkills(db));
  app.use("/api", dbSkills(db));
  app.use("/api", index());
  app.use("/api", login(db));
  app.use("/api", experiences(db));
  app.use("/api", users(db));
  app.use("/api", register(db));

  if (ENV === "development" || ENV === "test") {
    Promise.all([
      read(path.resolve(__dirname, `db/schema/create.sql`)),
      read(path.resolve(__dirname, `db/schema/${ENV}.sql`)),
    ])
      .then(([create, seed]) => {
        app.get("/api/debug/reset", (request, response) => {
          db.query(create)
            .then(() => db.query(seed))
            .then(() => {
              console.log("Database Reset");
              response.status(200).send("Database Reset");
            });
        });
      })
      .catch((error) => {
        console.log(`Error setting up the reset route: ${error}`);
      });
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
  
  app.close = function () {
    return db.end();
  };

  return app;
};
