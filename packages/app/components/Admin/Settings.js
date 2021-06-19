import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  siteInfoProps,
  authProps,
  addressProps,
  networkActionProps,
} from "../../types";
import {
  getGraphQLQueryFields,
  getObjectContainingOnlyChangedFields,
} from "../../lib/utils.js";
import {
  PAYMENT_METHOD_PAYPAL,
  PAYMENT_METHOD_PAYTM,
  PAYMENT_METHOD_STRIPE,
  PAYMENT_METHOD_NONE,
  MIMETYPE_IMAGE,
} from "../../config/constants.js";
import {
  networkAction,
  newSiteInfoAvailable,
  setAppMessage,
} from "../../redux/actions.js";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Grid,
  capitalize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  SITE_SETTINGS_TITLE,
  SITE_SETTINGS_SUBTITLE,
  SITE_SETTINGS_CURRENCY_UNIT,
  SITE_SETTINGS_LOGO,
  SITE_SETTINGS_PAGE_HEADING,
  SITE_SETTINGS_CURRENCY_ISO_CODE_TEXT,
  SITE_ADMIN_SETTINGS_STRIPE_SECRET,
  SITE_ADMIN_SETTINGS_PAYPAL_SECRET,
  SITE_ADMIN_SETTINGS_PAYTM_SECRET,
  SITE_SETTINGS_SECTION_GENERAL,
  SITE_SETTINGS_SECTION_PAYMENT,
  SITE_ADMIN_SETTINGS_PAYMENT_METHOD,
  SITE_SETTINGS_STRIPE_PUBLISHABLE_KEY_TEXT,
  APP_MESSAGE_SETTINGS_SAVED,
  SITE_CUSTOMISATIONS_SETTING_HEADER,
  SITE_CUSTOMISATIONS_SETTING_CODEINJECTION_HEAD,
  HEADER_SECTION_PAYMENT_CONFIRMATION_WEBHOOK,
  SUBHEADER_SECTION_PAYMENT_CONFIRMATION_WEBHOOK,
  BUTTON_SAVE,
  PAYMENT_METHOD_NAME_NONE,
} from "../../config/strings.js";
import FetchBuilder from "../../lib/fetch";
import { decode, encode } from "base-64";
import dynamic from "next/dynamic";
import AppMessage from "../../models/app-message.js";
import { Section } from "@courselit/components-library";

const MediaSelector = dynamic(() => import("./Media/MediaSelector"));

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
    margin: "1em 0em",
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  sectionContent: {},
  saveButton: {
    marginTop: theme.spacing(4),
  },
}));

const Settings = (props) => {
  const defaultSettingsState = {
    title: "",
    subtitle: "",
    logopath: "",
    currencyUnit: "",
    currencyISOCode: "",
    paymentMethod: "",
    stripePublishableKey: "",
    codeInjectionHead: "",
    stripeSecret: "",
    paypalSecret: "",
    paytmSecret: "",
  };

  const [settings, setSettings] = useState(defaultSettingsState);
  const [newSettings, setNewSettings] = useState(defaultSettingsState);

  const classes = useStyles();
  const fetch = new FetchBuilder()
    .setUrl(`${props.address.backend}/graph`)
    .setIsGraphQLEndpoint(true)
    .setAuthToken(props.auth.token);

  useEffect(() => {
    loadAdminSettings();
  }, []);

  const loadAdminSettings = async () => {
    const query = `
    query {
      settings: getSiteInfoAsAdmin {
        title,
        subtitle,
        logopath,
        currencyUnit,
        currencyISOCode,
        paymentMethod,
        stripePublishableKey,
        codeInjectionHead
      }
    }`;
    try {
      const fetchRequest = fetch.setPayload(query).build();
      const response = await fetchRequest.exec();
      if (response.settings) {
        setSettingsState(response.settings);
      }
    } catch (e) {}
  };

  const setSettingsState = (settingsResponse) => {
    if (settingsResponse.codeInjectionHead) {
      settingsResponse.codeInjectionHead = decode(
        settingsResponse.codeInjectionHead
      );
    }
    const settingsResponseWithNullsRemoved = {
      title: settingsResponse.title || "",
      subtitle: settingsResponse.subtitle || "",
      logopath: settingsResponse.logopath || "",
      currencyUnit: settingsResponse.currencyUnit || "",
      currencyISOCode: settingsResponse.currencyISOCode || "",
      paymentMethod: settingsResponse.paymentMethod || "",
      stripePublishableKey: settingsResponse.stripePublishableKey || "",
      codeInjectionHea: settingsResponse.codeInjectionHea || "",
    };
    setSettings(Object.assign({}, settings, settingsResponseWithNullsRemoved));
    setNewSettings(
      Object.assign({}, newSettings, settingsResponseWithNullsRemoved)
    );
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    const query = `
    mutation {
      settings: updateSiteInfo(siteData: {
        title: "${newSettings.title}",
        subtitle: "${newSettings.subtitle}",
        logopath: "${newSettings.logopath}"
      }) {
        title,
        subtitle,
        logopath,
        currencyUnit,
        currencyISOCode,
        paymentMethod,
        stripePublishableKey,
        codeInjectionHead
      }
    }`;

    try {
      const fetchRequest = fetch.setPayload(query).build();
      props.dispatch(networkAction(true));
      const response = await fetchRequest.exec();
      if (response.settings) {
        setSettingsState(response.settings);
        props.dispatch(
          newSiteInfoAvailable({
            title: settings.title,
            subtitle: settings.subtitle,
            logopath: settings.logopath,
            currencyUnit: settings.currencyUnit,
            currencyISOCode: settings.currencyISOCode,
            paymentMethod: settings.paymentMethod,
            stripePublishableKey: settings.stripePublishableKey,
            codeInjectionHead: encode(settings.codeInjectionHead),
          })
        );
        props.dispatch(
          setAppMessage(new AppMessage(APP_MESSAGE_SETTINGS_SAVED))
        );
      }
    } catch (e) {
      props.dispatch(setAppMessage(new AppMessage(e.message)));
    } finally {
      props.dispatch(networkAction(false));
    }
  };

  const handleCodeInjectionSettingsSubmit = async (event) => {
    event.preventDefault();
    const query = `
    mutation {
      settings: updateSiteInfo(siteData: {
        codeInjectionHead: "${encode(newSettings.codeInjectionHead)}"
      }) {
        title,
        subtitle,
        logopath,
        currencyUnit,
        currencyISOCode,
        paymentMethod,
        stripePublishableKey,
        codeInjectionHead
      }
    }`;

    try {
      const fetchRequest = fetch.setPayload(query).build();
      props.dispatch(networkAction(true));
      const response = await fetchRequest.exec();
      if (response.settings) {
        setSettingsState(response.settings);
        props.dispatch(
          newSiteInfoAvailable({
            title: settings.title,
            subtitle: settings.subtitle,
            logopath: settings.logopath,
            currencyUnit: settings.currencyUnit,
            currencyISOCode: settings.currencyISOCode,
            paymentMethod: settings.paymentMethod,
            stripePublishableKey: settings.stripePublishableKey,
            codeInjectionHead: encode(settings.codeInjectionHead),
          })
        );
        props.dispatch(
          setAppMessage(new AppMessage(APP_MESSAGE_SETTINGS_SAVED))
        );
      }
    } catch (e) {
      props.dispatch(setAppMessage(new AppMessage(e.message)));
    } finally {
      props.dispatch(networkAction(false));
    }
  };

  const onChangeData = (e) => {
    if (!e) {
      return;
    }

    const change = Object.prototype.hasOwnProperty.call(e, "file")
      ? { logopath: e.file }
      : { [e.target.name]: e.target.value };
    setNewSettings(Object.assign({}, newSettings, change));
  };

  const handlePaymentSettingsSubmit = async (event) => {
    event.preventDefault();
    const onlyChangedSettings = getObjectContainingOnlyChangedFields(
      settings,
      newSettings
    );
    const formattedQuery = getGraphQLQueryFields(onlyChangedSettings);
    const query = `
    mutation {
      settings: updatePaymentInfo(siteData: ${formattedQuery}) {
        title,
        subtitle,
        logopath,
        currencyUnit,
        currencyISOCode,
        paymentMethod,
        stripePublishableKey,
        codeInjectionHead
      }
    }`;

    try {
      const fetchRequest = fetch.setPayload(query).build();
      props.dispatch(networkAction(true));
      const response = await fetchRequest.exec();
      if (response.settings) {
        setSettingsState(response.settings);
        props.dispatch(
          newSiteInfoAvailable({
            title: settings.title,
            subtitle: settings.subtitle,
            logopath: settings.logopath,
            currencyUnit: settings.currencyUnit,
            currencyISOCode: settings.currencyISOCode,
            paymentMethod: settings.paymentMethod,
            stripePublishableKey: settings.stripePublishableKey,
            codeInjectionHead: encode(settings.codeInjectionHead),
          })
        );
        props.dispatch(
          setAppMessage(new AppMessage(APP_MESSAGE_SETTINGS_SAVED))
        );
      }
    } catch (e) {
      props.dispatch(setAppMessage(new AppMessage(e.message)));
    } finally {
      props.dispatch(networkAction(false));
    }
  };

  const getPaymentSettings = (getNewSettings = false) => ({
    currencyUnit: getNewSettings
      ? newSettings.currencyUnit
      : settings.currencyUnit,
    currencyISOCode: getNewSettings
      ? newSettings.currencyISOCode
      : settings.currencyISOCode,
    paymentMethod: getNewSettings
      ? newSettings.paymentMethod
      : settings.paymentMethod,
    stripePublishableKey: getNewSettings
      ? newSettings.stripePublishableKey
      : settings.stripePublishableKey,
    stripeSecret: getNewSettings
      ? newSettings.stripeSecret
      : settings.stripeSecret,
    paypalSecret: getNewSettings
      ? newSettings.paypalSecret
      : settings.paypalSecret,
    paytmSecret: getNewSettings
      ? newSettings.paytmSecret
      : settings.paytmSecret,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Section>
          <Typography variant="h1" style={{ wordBreak: "break-word" }}>
            {SITE_SETTINGS_PAGE_HEADING}
          </Typography>
        </Section>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Section>
              <form onSubmit={handleSettingsSubmit}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="h4">
                      {SITE_SETTINGS_SECTION_GENERAL}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      label={SITE_SETTINGS_TITLE}
                      fullWidth
                      margin="normal"
                      name="title"
                      value={newSettings.title || ""}
                      onChange={onChangeData}
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      label={SITE_SETTINGS_SUBTITLE}
                      fullWidth
                      margin="normal"
                      name="subtitle"
                      value={newSettings.subtitle || ""}
                      onChange={onChangeData}
                    />
                  </Grid>
                  <Grid item>
                    <MediaSelector
                      title={SITE_SETTINGS_LOGO}
                      src={newSettings.logopath || props.siteinfo.logopath}
                      onSelection={onChangeData}
                      mimeTypesToShow={[...MIMETYPE_IMAGE]}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      value={BUTTON_SAVE}
                      color="primary"
                      variant="outlined"
                      disabled={
                        JSON.stringify({
                          title: settings.title,
                          subtitle: settings.subtitle,
                          logopath: settings.logopath,
                        }) ===
                          JSON.stringify({
                            title: newSettings.title,
                            subtitle: newSettings.subtitle,
                            logopath: newSettings.logopath,
                          }) ||
                        !newSettings.title ||
                        props.networkAction
                      }
                    >
                      {BUTTON_SAVE}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Section>
          </Grid>
          <Grid item>
            <Section>
              <form onSubmit={handlePaymentSettingsSubmit}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="h4">
                      {SITE_SETTINGS_SECTION_PAYMENT}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      label={SITE_SETTINGS_CURRENCY_UNIT}
                      fullWidth
                      margin="normal"
                      name="currencyUnit"
                      value={newSettings.currencyUnit || ""}
                      onChange={onChangeData}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      label={SITE_SETTINGS_CURRENCY_ISO_CODE_TEXT}
                      fullWidth
                      margin="normal"
                      name="currencyISOCode"
                      value={newSettings.currencyISOCode || ""}
                      onChange={onChangeData}
                      maxLength={3}
                    />
                  </Grid>
                  <Grid item>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel htmlFor="outlined-paymentmethod-simple">
                        {SITE_ADMIN_SETTINGS_PAYMENT_METHOD}
                      </InputLabel>
                      <Select
                        autoWidth
                        value={newSettings.paymentMethod}
                        onChange={onChangeData}
                        inputProps={{
                          name: "paymentMethod",
                          id: "outlined-paymentmethod-simple",
                        }}
                      >
                        <MenuItem value={PAYMENT_METHOD_NONE}>
                          <Typography color="textSecondary">
                            {capitalize(PAYMENT_METHOD_NAME_NONE.toLowerCase())}
                          </Typography>
                        </MenuItem>
                        <MenuItem value={PAYMENT_METHOD_STRIPE}>
                          {capitalize(PAYMENT_METHOD_STRIPE.toLowerCase())}
                        </MenuItem>
                        {/* <MenuItem value={PAYMENT_METHOD_PAYPAL} disabled={true}>
                          {capitalize(PAYMENT_METHOD_PAYPAL.toLowerCase())}
                        </MenuItem> */}
                        {/* <MenuItem value={PAYMENT_METHOD_PAYTM} disabled={true}>
                          {capitalize(PAYMENT_METHOD_PAYTM.toLowerCase())}
                        </MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>

                  {newSettings.paymentMethod === PAYMENT_METHOD_STRIPE && (
                    <Grid item>
                      <TextField
                        variant="outlined"
                        label={SITE_SETTINGS_STRIPE_PUBLISHABLE_KEY_TEXT}
                        fullWidth
                        margin="normal"
                        name="stripePublishableKey"
                        value={newSettings.stripePublishableKey || ""}
                        onChange={onChangeData}
                      />
                      <TextField
                        variant="outlined"
                        label={SITE_ADMIN_SETTINGS_STRIPE_SECRET}
                        fullWidth
                        margin="normal"
                        name="stripeSecret"
                        type="password"
                        value={newSettings.stripeSecret || ""}
                        onChange={onChangeData}
                      />
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography variant="subtitle2">
                            {HEADER_SECTION_PAYMENT_CONFIRMATION_WEBHOOK}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            {SUBHEADER_SECTION_PAYMENT_CONFIRMATION_WEBHOOK}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography>
                            <a
                              href={`${props.address.backend}/payment/webhook`}
                            >
                              {`${props.address.backend}/payment/webhook`}
                            </a>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {newSettings.paymentMethod === PAYMENT_METHOD_PAYPAL && (
                    <Grid item>
                      <TextField
                        variant="outlined"
                        label={SITE_ADMIN_SETTINGS_PAYPAL_SECRET}
                        fullWidth
                        margin="normal"
                        name="paypalSecret"
                        type="password"
                        value={newSettings.paypalSecret || ""}
                        onChange={onChangeData}
                        disabled={true}
                      />
                    </Grid>
                  )}
                  {newSettings.paymentMethod === PAYMENT_METHOD_PAYTM && (
                    <Grid item>
                      <TextField
                        variant="outlined"
                        label={SITE_ADMIN_SETTINGS_PAYTM_SECRET}
                        fullWidth
                        margin="normal"
                        name="paytmSecret"
                        type="password"
                        value={newSettings.paytmSecret || ""}
                        onChange={onChangeData}
                        disabled={true}
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <Button
                      type="submit"
                      value={BUTTON_SAVE}
                      color="primary"
                      variant="outlined"
                      disabled={
                        JSON.stringify(getPaymentSettings()) ===
                        JSON.stringify(getPaymentSettings(true))
                      }
                    >
                      {BUTTON_SAVE}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Section>
          </Grid>
          <Grid item>
            <Section>
              <form onSubmit={handleCodeInjectionSettingsSubmit}>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variant="h4">
                      {SITE_CUSTOMISATIONS_SETTING_HEADER}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      label={SITE_CUSTOMISATIONS_SETTING_CODEINJECTION_HEAD}
                      fullWidth
                      margin="normal"
                      name="codeInjectionHead"
                      value={newSettings.codeInjectionHead || ""}
                      onChange={onChangeData}
                      multiline
                      rows={10}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      value={BUTTON_SAVE}
                      color="primary"
                      variant="outlined"
                      disabled={
                        settings.codeInjectionHead ===
                          newSettings.codeInjectionHead || props.networkAction
                      }
                    >
                      {BUTTON_SAVE}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Section>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Settings.propTypes = {
  siteinfo: siteInfoProps,
  auth: authProps,
  dispatch: PropTypes.func.isRequired,
  address: addressProps,
  networkAction: networkActionProps,
};

const mapStateToProps = (state) => ({
  siteinfo: state.siteinfo,
  auth: state.auth,
  address: state.address,
  networkAction: state.networkAction,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
