const { text } = require("express");
const router = require("express").Router();
module.exports = (db) => {
  router.get("/posts", (req, res) => {
    db.query(
      `
      SELECT posts.id as post_id, owner_id, text_body, time_posted, status_field, posts.active, avatar, username, users.active,name,db_skills.id as stack_id
      FROM posts
      JOIN user_profiles ON user_profiles.id = owner_id
      JOIN users on users.id = owner_id
      JOIN  posts_skills on posts_skills.post_id=posts.id JOIN db_skills on db_skills.id = posts_skills.db_skills_id
      GROUP BY owner_id, posts.id, user_profiles.id, users.id,name,db_skills.id
      ORDER BY time_posted DESC;
      `
    ).then((data) => {
      res.json(data.rows);
    });
  });

  // router.get("/posts/:id", (req, res) => {
  //   const queryParams = [4];
  //   db.query(
  //     `
  //   SELECT active, is_helper,is_helped,owner_id,text_body,time_posted
  //   FROM posts
  //   WHERE owner_id = $1;`,
  //     queryParams
  //   )
  //     .then((data) => {
  //       res.json(data.rows);
  //     })
  //     .catch((err) => {
  //       console.log("user-profile api", err);
  //     });
  // });
  router.post("/posts", (req, res) => {
    const {
      owner_id,
      text_body,
      time_posted,
      is_helper,
      is_helped,
      active,
    } = req.body.newPost;
    const param = [
      owner_id,
      text_body,
      time_posted,
      is_helper,
      is_helped,
      "active",
      active,
    ];
    // const queryString =;
    console.log(param);
    db.query(
      `INSERT INTO posts
    (owner_id, text_body, time_posted, is_helper, is_helped, status_field, active)
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;`,
      param
    ).then((data) => {
      console.log(data.rows[0]);
      res.json(data.rows[0]);
    });
    // .catch((err) => {
    //   console.log("what the heck", err);
    //   res.status(500).send("bad juju on the DB I guess");
    // });
  });

  router.put("/posts", (req, res) => {
    console.log("editing post", req.body);
    const { text_body, post_id } = req.body;
    const params = [text_body, post_id];
    db.query(
      `
      UPDATE posts
      SET text_body = $1
      WHERE id=$2
      RETURNING *;
      `,
      params
    ).then((data) => {
      res.json(data.rows[0]);
    });
  });

  router.delete("/posts", (req, res) => {
    console.log("hello", req.query);
    const { post_id } = req.query;

    db.query(
      `
      DELETE FROM posts
      WHERE id = $1
      `,
      [post_id]
    ).then((data) => {
      res.json(data.rows[0]);
    });
  });
  return router;
};
