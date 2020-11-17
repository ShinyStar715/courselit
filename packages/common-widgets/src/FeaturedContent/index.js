import React from 'react';
import AdminWidget from './AdminWidget';
import metadata from "./metadata";
import Widget from './Widget';

export default {
  widget: Widget,
  adminWidget: () => <div></div>,
  metadata,
};
