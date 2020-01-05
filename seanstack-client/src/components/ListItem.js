import React from "react";

import { Box } from "grommet";

const ListItem = props => (
  <Box
    as="li"
    border={props.index ? "bottom" : "horizontal"}
    pad="small"
    direction="row"
    justify="between"
    {...props}
  />
);

export default ListItem
