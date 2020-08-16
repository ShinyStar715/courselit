/**
 * Dashboard for creators.
 */
import { useEffect } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import {
  LibraryBooks,
  SupervisedUserCircle,
  PermMedia,
  SettingsApplications,
  Palette,
} from "@material-ui/icons";
import SiteSettings from "../components/Admin/SiteSettings.js";
import { CREATOR_AREA_PAGE_TITLE } from "../config/strings.js";
import MediaManager from "../components/Admin/Media/MediaManager.js";
import Courses from "../components/Admin/CoursesManager.js";
import UsersManager from "../components/UsersManager.js";
import AppLoader from "../components/AppLoader.js";
import Design from "../components/Admin/Design";
import ComponentScaffold from "../components/Public/BaseLayout/ComponentScaffold.js";

const Create = (props) => {
  useEffect(() => {
    if (props.profile.fetched && !props.profile.isCreator) {
      Router.push("/");
    }
  }, [props.profile.fetched]);

  useEffect(() => {
    if (props.auth.checked && props.auth.guest) {
      Router.push("/");
    }
  }, [props.auth.checked]);

  const items = [
    {
      name: "Courses",
      element: <Courses />,
      icon: <LibraryBooks />,
    },
    {
      name: "Media",
      element: <MediaManager onMediaSelected={() => {}} />,
      icon: <PermMedia />,
    },
  ];

  if (props.profile.isAdmin) {
    items.push(
      ...[
        {
          name: "Settings",
          element: <SiteSettings />,
          icon: <SettingsApplications />,
        },
        {
          name: "Users",
          element: <UsersManager />,
          icon: <SupervisedUserCircle />,
        },
        {
          name: "Design & Navigation",
          element: <Design />,
          icon: <Palette />,
        },
      ]
    );
  }

  return props.profile.fetched && props.profile.isCreator ? (
    <ComponentScaffold items={items} pageTitle={CREATOR_AREA_PAGE_TITLE} />
  ) : (
    <AppLoader />
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps)(Create);
