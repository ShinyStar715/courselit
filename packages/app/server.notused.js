// Next.js Server.
// Copied from https://nextjs.org/learn/basics/server-side-support-for-clean-urls/create-a-custom-server

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get(`/post/:id/:slug`, (req, res) => {
      const actualPage = `/post`;
      const queryParams = { courseId: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get(`/course/:id/:slug`, (req, res) => {
      const actualPage = `/course`;
      const queryParams = { courseId: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) {
        throw err;
      }
    });
  })
  .catch((ex) => {
    process.exit(1);
  });
