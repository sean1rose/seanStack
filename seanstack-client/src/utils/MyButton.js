import React from 'react'
import { Button } from 'grommet'

export default ({children, onClick, icon, as, to, label, style}) => {
  // console.log('icon - ', icon)
  if (as && to) {
    return (
      <Button as={as} to={to} icon={icon} onClick={onClick} label={label} style={style} >
        {children}
      </Button>
    )
  }
  else {
    return (
      <Button icon={icon} onClick={onClick} label={label} style={style}>
        {children}
      </Button>
    )
  }
}
