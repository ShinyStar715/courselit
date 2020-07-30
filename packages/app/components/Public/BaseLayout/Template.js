import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import Section from "./Section";
import { makeStyles } from "@material-ui/styles";
import Footer from "./Footer";

const useStyles = makeStyles({
  mainContent: {
    // minHeight: "80vh"
  }
});

const Template = props => {
  const classes = useStyles(props);
  const router = useRouter();

  return (
    <>
      <Grid container>
        {router.pathname === "/" && <Section name="top" />}
        <Grid container item direction="row">
          <Grid container item direction="column" xs={12} sm={8} md={9}>
            <Grid container item className={classes.mainContent}>
              {props.children}
            </Grid>
            <Grid item container>
              <Section name="bottom" />
            </Grid>
          </Grid>
          <Grid container item direction="column" xs={12} sm={4} md={3}>
            <Section name="aside" />
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

Template.propTypes = {
  children: PropTypes.object
};

export default Template;
