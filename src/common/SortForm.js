import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import CloudUploadSharpIcon from '@material-ui/icons/CloudUploadSharp'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    alignItems: 'center'
  },
  label: { fontSize: '1.25rem' },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}))

const SortForm = ({ handleCheckboxChange, uploadFiles }) => {
  const matches = useMediaQuery('(max-width:400px)')
  const classes = useStyles()

  if (matches) {
    classes.label = '{}' //needs to be string otherwise will throw error
  }

  const [sort, setSort] = useState(true)
  const handleChange = e => {
    setSort(e.target.checked)
    handleCheckboxChange(e.target.checked)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper}>
        <FormGroup className={classes.form}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sort}
                onChange={handleChange}
                value='sort'
                color='secondary'
              />
            }
            label={
              <Typography className={classes.label}>
                Auto sort after uploading
              </Typography>
            }
          />
        </FormGroup>
        <label htmlFor='upload-images-btn'>
          <Button
            component='span'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}>
            Upload Images
            <CloudUploadSharpIcon className={classes.rightIcon} />
          </Button>
        </label>
        <input
          style={{ display: 'none' }}
          accept='image/*'
          id='upload-images-btn'
          type='file'
          multiple='multiple'
          onChange={e => {
            uploadFiles(e)
          }}
        />
      </Paper>
    </Container>
  )
}

export default SortForm
