import React from 'react';
import { Box } from 'grommet';

export const AppBar = props => {
  return (
    <Box
      tag='header'
      direction='row'
      // align='center'
      // justify='between'
      background='brand'
      pad={{ left: 'medium', right: 'mediunm', vertial: 'medium' }}
      elevation='medium'
      style={{ zIndex: '1' }}
      {...props}
    
    />
  )
}
