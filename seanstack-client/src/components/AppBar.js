import React from 'react';
import { Box } from 'grommet';

const AppBar = props => {
  return (
    <Box
      tag='header'
      direction='row'
      gap='small'
      background='brand'
      pad='small'
      elevation='medium'
      style={{ zIndex: '1' }}
      {...props}
    />
  )
}

export default AppBar