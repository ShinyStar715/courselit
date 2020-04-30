/**
 * The application server for the entire API.
 */

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const optionalAuthMiddlewareCreator = require("./middlewares/optionalAuth.js");
require("./middlewares/passport.js")(passport);
require("./config/db.js")();
const { routePrefix } = require("./config/constants.js");

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000" })); // for next.js development server
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

// Routes
app.use(`${routePrefix}/auth`, require("./routes/auth.js")(passport));
app.use(
  `${routePrefix}/graph`,
  optionalAuthMiddlewareCreator(passport),
  graphqlHTTP(req => ({
    schema: require("./graphql/schema.js"),
    graphiql: true,
    context: { user: req.user }
  }))
);
app.use(
  `${routePrefix}/media`,
  // passport.authenticate('jwt', { session: false }),
  require("./routes/media.js")(passport)
);
app.use(`${routePrefix}/payment`, require("./routes/payment.js")(passport));

app.listen(process.env.PORT || 80);
