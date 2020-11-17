import PropTypes from "prop-types";
import BaseLayout from "../components/Public/BaseLayout";
import Items from "../components/Public/Items/index.js";
import { publicCourse } from "../types.js";
import { capitalize, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FetchBuilder from "../lib/fetch.js";
import { BACKEND } from "../config/constants.js";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  content: {
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    paddingTop: theme.spacing(2),
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
    courses: getCourses(offset: ${pageOffset}) {
      id
      title,
      description,
      featuredImage,
      updated,
      creatorName,
      cost,
      slug,
      isFeatured,
      courseId
    }
  }
`;

const Courses = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const path = capitalize(router.pathname.split("/")[1]);

  return (
    <BaseLayout title={path}>
      <Grid item xs={12} className={classes.content}>
        <Grid container component="section">
          <Grid item container className={classes.header}>
            <Grid item xs={12} className={classes.headerTop}>
              <Typography variant="h4">{path}</Typography>
            </Grid>
          </Grid>
          <Items
            showLoadMoreButton={true}
            generateQuery={generateQuery}
            initialItems={props.courses}
          />
        </Grid>
      </Grid>
    </BaseLayout>
  );
};

const getCourses = async () => {
  let courses = [];
  const query = generateQuery();
  try {
    const fetch = new FetchBuilder()
      .setUrl(`${BACKEND}/graph`)
      .setPayload(query)
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

Courses.propTypes = {
  courses: PropTypes.arrayOf(publicCourse),
};

export default Courses;
