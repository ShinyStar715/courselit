import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {
  MEDIA_BACKEND,
  URL_EXTENTION_COURSES,
} from "../../../config/constants.js";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { formulateMediaUrl } from "../../../lib/utils.js";
import Card from "../Card.js";
import PriceTag from "../../PriceTag.js";

const useStyles = (featuredImage) =>
  makeStyles((theme) => ({
    link: {
      textDecoration: "none",
      color: "inherit",
      marginBottom: theme.spacing(4),
      display: "block",
    },
    featuredImage: {
      height: 360,
      width: "100%",
      background: `url('${formulateMediaUrl(
        MEDIA_BACKEND,
        featuredImage
      )}') no-repeat center center`,
      backgroundSize: "cover",
    },
    title: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(0.5),
    },
  }));

const ListItem = (props) => {
  const classes = useStyles(props.featuredImage)();

  return (
    <Grid item xs={12} md={4}>
      <Link
        href={`/${URL_EXTENTION_COURSES}/[id]/[slug]`}
        as={`/${URL_EXTENTION_COURSES}/${props.id}/${props.slug}`}
      >
        <a className={classes.link}>
          <Card>
            <Grid item container direction="column" component="article">
              {props.featuredImage && (
                <Grid item className={classes.featuredImage} />
              )}
              <Grid
                item
                container
                className={classes.title}
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="h5">{props.title}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    <PriceTag cost={props.cost}></PriceTag>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </a>
      </Link>
    </Grid>
  );
};

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  creatorName: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  featuredImage: PropTypes.string,
  cost: PropTypes.number.isRequired,
};

export default ListItem;
