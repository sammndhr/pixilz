import React from 'react'
import { Paper, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 3),
    textAlign: 'center'
  },
  text: {
    display: 'inline-block'
  },
  leftIcon: {
    marginRight: theme.spacing(1),
    display: 'inline-block',
    verticalAlign: 'sub'
  }
}))

const ImageSizeWarning = () => {
  const classes = useStyles()
  return (
    <div>
      <Paper className={classes.root}>
        <Typography component='p' className={classes.text}>
          <WarningIcon className={classes.leftIcon} />
          Displayed size isn't the final size. Please expand browser to view
          exact size.
        </Typography>
      </Paper>
    </div>
  )
}

export default ImageSizeWarning
