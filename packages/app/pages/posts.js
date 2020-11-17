import PropTypes from "prop-types";
import { publicCourse } from "../types.js";
import { BACKEND } from "../config/constants.js";
import {
  HEADER_BLOG_POSTS_SECTION,
  SUBHEADER_BLOG_POSTS_SECTION,
} from "../config/strings.js";
import BaseLayout from "../components/Public/BaseLayout";
import Items from "../components/Public/Items/index.js";
import FetchBuilder from "../lib/fetch.js";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(8),
  },
  header: {
    marginLeft: theme.spacing(2),
  },
  headerTop: {
    marginBottom: theme.spacing(2),
  },
}));

const generateQuery = (pageOffset = 1) => `
  query {
    courses: getPosts(offset: ${pageOffset}) {
      id,
      title,
      description,
      updated,
      creatorName,
      slug,
      featuredImage,
      courseId
    }
  }
`;

function Posts(props) {
  const classes = useStyles();

  return (
    <BaseLayout title={HEADER_BLOG_POSTS_SECTION}>
      <Grid item xs={12} className={classes.content}>
        <Grid container component="section">
          <Grid item container className={classes.header}>
            <Grid item xs={12} className={classes.headerTop}>
              <Typography variant="h4">{HEADER_BLOG_POSTS_SECTION}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                {SUBHEADER_BLOG_POSTS_SECTION}
              </Typography>
            </Grid>
          </Grid>
          <Items
            showLoadMoreButton={true}
            generateQuery={generateQuery}
            initialItems={props.courses}
            posts={true}
          />
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

const getCourses = async () => {
  let courses = [];
  try {
    const fetch = new FetchBuilder()
      .setUrl(`${BACKEND}/graph`)
      .setPayload(generateQuery())
      .setIsGraphQLEndpoint(true)
      .build();
    const response = await fetch.exec();
    courses = response.courses;
  } catch (e) {}
  return courses;
};

export async function getServerSideProps() {
  const courses = await getCourses();
  return { props: { courses } };
}

Posts.propTypes = {
  courses: PropTypes.arrayOf(publicCourse),
};

export default Posts;
