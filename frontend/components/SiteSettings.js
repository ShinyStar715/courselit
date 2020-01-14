import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { siteInfoProps, authProps } from '../types'
import MediaManager from './MediaManager'
import {
  makeGraphQLQueryStringFromJSObject,
  queryGraphQLWithUIEffects,
  getGraphQLQueryFields,
  getObjectContainingOnlyChangedFields
} from '../lib/utils.js'
import {
  BACKEND,
  PAYMENT_METHOD_PAYPAL,
  PAYMENT_METHOD_PAYTM,
  PAYMENT_METHOD_STRIPE
} from '../config/constants.js'
import { networkAction, newSiteInfoAvailable, setAppError } from '../redux/actions.js'
import ImgSwitcher from './ImgSwitcher.js'
import {
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Grid
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import {
  SITE_SETTINGS_TITLE,
  SITE_SETTINGS_SUBTITLE,
  SITE_SETTINGS_CURRENCY_UNIT,
  SITE_SETTINGS_LOGO,
  SITE_SETTINGS_COPYRIGHT_TEXT,
  SITE_SETTINGS_ABOUT_TEXT,
  SITE_SETTINGS_PAGE_HEADING,
  SITE_SETTINGS_CURRENCY_ISO_CODE_TEXT,
  SITE_ADMIN_SETTINGS_STRIPE_SECRET,
  SITE_ADMIN_SETTINGS_PAYPAL_SECRET,
  SITE_ADMIN_SETTINGS_PAYTM_SECRET,
  SITE_SETTINGS_SECTION_GENERAL,
  SITE_SETTINGS_SECTION_PAYMENT,
  SITE_ADMIN_SETTINGS_PAYMENT_METHOD,
  SITE_SETTINGS_STRIPE_PUBLISHABLE_KEY_TEXT
} from '../config/strings.js'
import AppError from '../models/app-error.js'

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: '100%',
    marginBottom: '1.8em'
  }
}))

const SiteSettings = props => {
  const [settings, setSettings] = useState({
    title: props.siteinfo.title,
    subtitle: props.siteinfo.subtitle,
    logopath: props.siteinfo.logopath,
    currencyUnit: props.siteinfo.currencyUnit,
    copyrightText: props.siteinfo.copyrightText,
    currencyISOCode: props.siteinfo.currencyISOCode,
    about: props.siteinfo.about,
    paymentMethod: props.siteinfo.paymentMethod,
    stripePublishableKey: props.siteinfo.stripePublishableKey
  })
  const [adminSettings, setAdminSettings] = useState({
    stripeSecret: '',
    paypalSecret: '',
    paytmSecret: ''
  })
  const [mediaManagerVisibility, setMediaManagerVisibility] = useState(false)
  const executeGQLCall = queryGraphQLWithUIEffects(
    `${BACKEND}/graph`,
    props.dispatch,
    networkAction,
    props.auth.token
  )
  const classes = useStyles()

  useEffect(() => {
    loadAdminSettings()
  }, [])

  const loadAdminSettings = async () => {
    const query = `
    query {
      adminSettings: getSettings {
        stripeSecret,
        paypalSecret,
        paytmSecret
      }
    }`
    try {
      const response = await executeGQLCall(query)
      if (response.adminSettings) {
        setAdminSettings(
          Object.assign({}, adminSettings, response.adminSettings)
        )
      }
    } catch (e) {}
  }

  const handleGeneralSettingsSubmit = async (event) => {
    event.preventDefault()
    const onlyChangedSettings = getObjectContainingOnlyChangedFields(
      props.siteinfo,
      settings
    )
    console.log(props.siteinfo, settings, onlyChangedSettings)
    const formattedQuery = getGraphQLQueryFields(
      onlyChangedSettings, ['paymentMethod']
    )
    const query = `
    mutation {
      site: updateSiteInfo(siteData: ${
        // makeGraphQLQueryStringFromJSObject(
        //   removeEmptyProperties(settings, 'err')
        // )
        formattedQuery
      }) {
        title,
        subtitle,
        logopath,
        currencyUnit,
        currencyISOCode,
        copyrightText,
        about,
        paymentMethod,
        stripePublishableKey
      }
    }`
    try {
      await executeGQLCall(query, response => {
        if (response.site) {
          props.dispatch(newSiteInfoAvailable(response.site))
        }
      })
    } catch (e) {
      props.dispatch(
        setAppError(
          new AppError(e.message)
        )
      )
    }
  }

  const onChangeData = (e) => {
    const change = typeof e === 'string' ? { logopath: e } : { [e.target.name]: e.target.value }
    setSettings(Object.assign({}, settings, change))
  }

  const toggleMediaManagerVisibility = () =>
    setMediaManagerVisibility(!mediaManagerVisibility)

  const onAdminSettingsChanged = (e) => {
    const change = { [e.target.name]: e.target.value }
    setAdminSettings(Object.assign({}, adminSettings, change))
  }

  const handleAdminSettingsSubmit = async (event) => {
    event.preventDefault()
    const query = `
    mutation {
      adminSettings: updateSettings(settingsData: ${
        makeGraphQLQueryStringFromJSObject(
          adminSettings
        )
        // getGraphQLQueryFields(removeEmptyProperties(adminSettings), ['paymentMethod'])
      }) {
        stripeSecret,
        paypalSecret,
        paytmSecret
      }
    }`
    console.log(query)
    try {
      await executeGQLCall(query, response => {
        if (response.adminSettings) {
          setAdminSettings(
            Object.assign({}, adminSettings, response.adminSettings)
          )
        }
      })
    } catch (e) {
      props.dispatch(
        setAppError(
          new AppError(e.message)
        )
      )
    }
  }

  return (
    <section>
      <Typography variant='h3'>
        {SITE_SETTINGS_PAGE_HEADING}
      </Typography>
      <Grid container direction='column'>
        <Grid item>
          <Typography variant='h5'>
            {SITE_SETTINGS_SECTION_GENERAL}
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={handleGeneralSettingsSubmit}>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_TITLE}
              fullWidth
              margin="normal"
              name='title'
              value={settings.title || ''}
              onChange={onChangeData}/>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_SUBTITLE}
              fullWidth
              margin="normal"
              name='subtitle'
              value={settings.subtitle || ''}
              onChange={onChangeData}/>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_CURRENCY_UNIT}
              fullWidth
              margin="normal"
              name='currencyUnit'
              value={settings.currencyUnit || ''}
              onChange={onChangeData}/>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_CURRENCY_ISO_CODE_TEXT}
              fullWidth
              margin="normal"
              name='currencyISOCode'
              value={settings.currencyISOCode || ''}
              onChange={onChangeData}
              maxLength={3}/>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_COPYRIGHT_TEXT}
              fullWidth
              margin="normal"
              name='copyrightText'
              value={settings.copyrightText || ''}
              onChange={onChangeData}/>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_ABOUT_TEXT}
              fullWidth
              margin="normal"
              name='about'
              value={settings.about || ''}
              onChange={onChangeData}/>
            <ImgSwitcher
              title={SITE_SETTINGS_LOGO}
              src={settings.logopath || props.siteinfo.logopath}
              onSelection={onChangeData}/>
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel htmlFor='outlined-paymentmethod-simple'>
                {SITE_ADMIN_SETTINGS_PAYMENT_METHOD}
              </InputLabel>
              <Select
                autoWidth
                value={settings.paymentMethod}
                onChange={onChangeData}
                inputProps={{
                  name: 'paymentMethod',
                  id: 'outlined-paymentmethod-simple'
                }}>
                <MenuItem value={PAYMENT_METHOD_STRIPE}>Stripe</MenuItem>
                <MenuItem value={PAYMENT_METHOD_PAYPAL}>Paypal</MenuItem>
                <MenuItem value={PAYMENT_METHOD_PAYTM}>Paytm</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant='outlined'
              label={SITE_SETTINGS_STRIPE_PUBLISHABLE_KEY_TEXT}
              fullWidth
              margin="normal"
              name='stripePublishableKey'
              value={settings.stripePublishableKey || ''}
              onChange={onChangeData}/>
            <Button
              variant='contained'
              color='default'
              type='submit'
              value='Save'
              disabled={!!((!settings.title && !settings.subtitle && !settings.logopath))}>
                Save
            </Button>
          </form>
        </Grid>
        <Grid item>
          <Typography variant='h5'>
            {SITE_SETTINGS_SECTION_PAYMENT}
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={handleAdminSettingsSubmit}>
            <TextField
              variant='outlined'
              label={SITE_ADMIN_SETTINGS_STRIPE_SECRET}
              fullWidth
              margin="normal"
              name='stripeSecret'
              type='password'
              value={adminSettings.stripeSecret || ''}
              onChange={onAdminSettingsChanged}/>
            <TextField
              variant='outlined'
              label={SITE_ADMIN_SETTINGS_PAYPAL_SECRET}
              fullWidth
              margin="normal"
              name='paypalSecret'
              type='password'
              value={adminSettings.paypalSecret || ''}
              onChange={onAdminSettingsChanged}/>
            <TextField
              variant='outlined'
              label={SITE_ADMIN_SETTINGS_PAYTM_SECRET}
              fullWidth
              margin="normal"
              name='paytmSecret'
              type='password'
              value={adminSettings.paytmSecret || ''}
              onChange={onAdminSettingsChanged}/>
            <Button
              variant='contained'
              color='default'
              type='submit'
              value='Save'
              disabled={!!((!settings.title && !settings.subtitle && !settings.logopath))}>
                Save
            </Button>
          </form>
        </Grid>
      </Grid>
      {mediaManagerVisibility &&
        <MediaManager
          toggleVisibility={toggleMediaManagerVisibility}
          onMediaSelected={onChangeData}/>
      }
    </section>
  )
}

SiteSettings.propTypes = {
  siteinfo: siteInfoProps,
  auth: authProps,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  siteinfo: state.siteinfo,
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteSettings)
