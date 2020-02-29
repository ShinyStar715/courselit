import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider
} from "@material-ui/core";
import Link from "next/link";
import TextEditor from "./TextEditor";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { BACKEND } from "../config/constants";
import { formulateMediaUrl, formattedLocaleDate } from "../lib/utils";
import { publicCourse, profileProps } from "../types";
import BuyButton from "./Checkout";
import { connect } from "react-redux";
import PriceTag from "./PriceTag";

const useStyles = featuredImage =>
  makeStyles(theme => ({
    creatoravatarcontainer: {
      display: "flex",
      alignItems: "center"
    },
    creatorcard: {
      paddingTop: "0.8em"
    },
    creatoravatar: {
      borderRadius: "1.5em",
      width: "3em",
      marginRight: "1em"
    },
    featuredimagecontainer: {
      marginTop: "2.4em",
      width: "100%",
      height: 240,
      overflow: "hidden",
      marginBottom: "1.8em",
      background: `url('${formulateMediaUrl(
        BACKEND,
        featuredImage
      )}') no-repeat center center`,
      backgroundSize: "cover"
    },
    enrollmentArea: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(4)
    },
    enrollmentAreaPriceTag: {
      marginRight: theme.spacing(2)
    }
  }));

const Article = props => {
  const { course, options, profile } = props;
  const classes = useStyles(course.featuredImage)();
  let courseDescriptionHydrated;
  try {
    courseDescriptionHydrated = TextEditor.hydrate(course.description);
  } catch (err) {
    // do nothing
  }

  return (
    <Card>
      <CardContent>
        <article className={classes.article}>
          <Typography variant="h2">{course.title}</Typography>
          {options.showAttribution && (
            <Grid container className={classes.creatorcard}>
              <Grid item className={classes.creatoravatarcontainer}>
                <img
                  src="/static/logo.jpg"
                  className={classes.creatoravatar}
                ></img>
              </Grid>
              <Grid item>
                <Typography variant="overline" component="p">
                  <Link
                    href="/creator/[id]"
                    as={`/creator/${course.creatorId}`}
                  >
                    <a>{course.creatorName}</a>
                  </Link>
                </Typography>
                <Typography variant="overline" className={classes.updatedtime}>
                  {formattedLocaleDate(course.updated)}
                </Typography>
              </Grid>
            </Grid>
          )}
          {course.featuredImage && (
            <div className={classes.featuredimagecontainer} />
          )}
          {options.showEnrollmentArea &&
            !profile.purchases.includes(course.id) && (
              <div className={classes.enrollmentArea}>
                <Grid container direction="row" alignItems="center">
                  <Grid item className={classes.enrollmentAreaPriceTag}>
                    <PriceTag cost={course.cost} />
                  </Grid>
                  <Grid>
                    <BuyButton
                      course={course}
                      onTransactionSuccess={() => {}}
                      onTransactionFailure={() => {}}
                    />
                  </Grid>
                </Grid>
                <Divider></Divider>
              </div>
            )}
          {courseDescriptionHydrated && (
            <TextEditor
              initialContentState={TextEditor.hydrate(course.description)}
              readOnly={true}
            />
          )}
        </article>
      </CardContent>
    </Card>
  );
};

Article.propTypes = {
  course: publicCourse.isRequired,
  options: PropTypes.shape({
    showAttribution: PropTypes.bool,
    showEnrollmentArea: PropTypes.bool
  }).isRequired,
  profile: profileProps
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps)(Article);
