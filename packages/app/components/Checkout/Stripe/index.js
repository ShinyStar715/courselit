import React from "react";
import PropTypes from "prop-types";
import { Elements, StripeProvider } from "react-stripe-elements";
import { connect } from "react-redux";
import { STRIPE_PUBLISHABLE_KEY_EMPTY } from "../../../config/strings.js";
import CheckoutForm from "./CheckoutForm.js";
import { Typography } from "@material-ui/core";
import { siteInfoProps } from "../../../types.js";

const Stripe = props => {
  const { siteInfo } = props;
  // const [stripe] = useState(window.Stripe('pk_test_TPqKXuR984C65Bb7yWdnkAnT'))

  return (
    <>
      {siteInfo.stripePublishableKey && (
        <StripeProvider stripe={window.Stripe(siteInfo.stripePublishableKey)}>
          <Elements>
            <CheckoutForm
              clientSecret={props.clientSecret}
              onSuccess={props.onSuccess}
              onError={props.onError}
            />
          </Elements>
        </StripeProvider>
      )}
      {!siteInfo.stripePublishableKey && (
        <Typography variant="subtitle1">
          {STRIPE_PUBLISHABLE_KEY_EMPTY}
        </Typography>
      )}
    </>
  );
};

Stripe.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  siteInfo: siteInfoProps
};

const mapStateToProps = state => ({
  siteInfo: state.siteinfo
});

export default connect(mapStateToProps)(Stripe);
