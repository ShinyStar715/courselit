import * as React from "react";
import { connect } from "react-redux";

interface PriceTagProps {
  cost: number;
  siteInfo: any;
  freeCostText: string
}

const PriceTag = (props: PriceTagProps) => {
  const cost = props.cost || 0;
  const costText =
    cost <= 0
      ? props.freeCostText
      : props.siteInfo.currencyUnit
      ? `${props.siteInfo.currencyUnit}${cost}`
      : `${cost} ${props.siteInfo.currencyISOCode}`;

  return <>{costText}</>;
};

const mapStateToProps = (state: any) => ({
  siteInfo: state.siteinfo,
});

export default connect(mapStateToProps)(PriceTag);
