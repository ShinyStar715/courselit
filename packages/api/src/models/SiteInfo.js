/**
 * A model for containing site information like site title etc.
 *
 * This will only contain one record.
 */
const mongoose = require("mongoose");

const SiteInfoSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  logopath: { type: String },
  currencyUnit: { type: String },
  currencyISOCode: { type: String, maxlength: 3 },
  copyrightText: { type: String },
  about: { type: String },
  paymentMethod: { type: String },
  stripePublishableKey: { type: String },
  themePrimaryColor: { type: String },
  themeSecondaryColor: { type: String },
  codeInjectionHead: { type: String },
  stripeSecret: { type: String },
  paytmSecret: { type: String },
  paypalSecret: { type: String },
});

module.exports = mongoose.model("SiteInfo", SiteInfoSchema);
