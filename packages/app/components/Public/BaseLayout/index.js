import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Head from "next/head";
import { MEDIA_BACKEND } from "../../../config/constants.js";
import { formulateMediaUrl } from "../../../lib/utils.js";
import { siteInfoProps } from "../../../types.js";
import Template from "./Template.js";
import Scaffold from "./Scaffold.js";

const MasterLayout = (props) => {
  return (
    <>
      <Head>
        <title>
          {props.title} | {props.siteInfo.title}
        </title>
        {props.siteInfo.logopath && (
          <link
            rel="icon"
            href={formulateMediaUrl(
              MEDIA_BACKEND,
              props.siteInfo.logopath,
              true
            )}
          />
        )}
        <link
          rel="icon"
          href={
            props.siteInfo.logopath
              ? formulateMediaUrl(MEDIA_BACKEND, props.siteInfo.logopath, true)
              : "/courselit_backdrop_square.webp"
          }
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Scaffold>
        <Template>{props.children}</Template>
      </Scaffold>
    </>
  );

  // return (
  //   <>
  //     <Head>
  //       <title>
  //         {props.title} | {props.siteInfo.title}
  //       </title>
  //       {props.siteInfo.logopath && (
  //         <link
  //           rel="icon"
  //           href={formulateMediaUrl(
  //             MEDIA_BACKEND,
  //             props.siteInfo.logopath,
  //             true
  //           )}
  //         />
  //       )}
  //     </Head>
  //     <CssBaseline />
  //     <Header />
  //     <LinearProgress className={classes.showProgressBar} />
  //     <ContainedBodyLayout>
  //       <Grid container>
  //         {router.pathname === "/" && <Section name="top" />}
  //         <Grid container item direction="row" spacing={2}>
  //           <Grid container item direction="column" xs={12} sm={8} md={9}>
  //             <Grid container item className={classes.mainContent}>
  //               {props.children}
  //             </Grid>
  //             <Section name="bottom" />
  //           </Grid>
  //           <Grid container item direction="column" xs={12} sm={4} md={3}>
  //             <Section name="aside" />
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //     </ContainedBodyLayout>
  //     <Footer />
  //   </>
  // );
};

MasterLayout.propTypes = {
  children: PropTypes.object,
  networkAction: PropTypes.bool,
  siteInfo: siteInfoProps.isRequired,
  title: PropTypes.string.isRequired,
  layout: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  networkAction: state.networkAction,
  siteInfo: state.siteinfo,
  layout: state.layout,
});

export default connect(mapStateToProps)(MasterLayout);
