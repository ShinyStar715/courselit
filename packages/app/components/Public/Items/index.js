import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { networkAction } from "../../../redux/actions";
import FetchBuilder from "../../../lib/fetch";
import { BACKEND } from "../../../config/constants";
import { Grid, Button } from "@material-ui/core";
import { BTN_LOAD_MORE } from "../../../config/strings";
import Post from "./Post";
import { publicCourse } from "../../../types";
import Course from "./Course";

const List = (props) => {
  const [courses, setCourses] = useState(props.initialItems || []);
  const [offset, setOffset] = useState(2);
  const [shouldShowLoadMoreButton, setShouldShowLoadMoreButton] = useState(
    typeof props.showLoadMoreButton === "boolean"
      ? props.showLoadMoreButton
      : false
  );
  const { generateQuery } = props;
  const posts = typeof props.posts === "boolean" ? props.posts : false;

  useEffect(() => {
    getPosts();
  }, [offset]);

  const getPosts = async () => {
    try {
      props.dispatch && props.dispatch(networkAction(true));
      const fetch = new FetchBuilder()
        .setUrl(`${BACKEND}/graph`)
        .setPayload(generateQuery(offset))
        .setIsGraphQLEndpoint(true)
        .build();
      const response = await fetch.exec();
      if (response.courses) {
        if (response.courses.length > 0) {
          setCourses([...courses, ...response.courses]);
        } else {
          setShouldShowLoadMoreButton(false);
        }
      }
    } finally {
      props.dispatch && props.dispatch(networkAction(false));
    }
  };

  return courses.length > 0 ? (
    <>
      <Grid item container xs={12} justify="space-between">
        {courses.map((x, index) =>
          posts ? <Post key={index} {...x} /> : <Course key={index} {...x} />
        )}
      </Grid>
      {shouldShowLoadMoreButton && courses.length > 0 && (
        <Grid item xs={12}>
          <Button onClick={() => setOffset(offset + 1)}>{BTN_LOAD_MORE}</Button>
        </Grid>
      )}
    </>
  ) : (
    <></>
  );
};

List.propTypes = {
  generateQuery: PropTypes.func.isRequired,
  initialItems: PropTypes.arrayOf(publicCourse),
  showLoadMoreButton: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

export default connect(() => ({}), mapDispatchToProps)(List);
