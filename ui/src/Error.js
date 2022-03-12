import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";

// Material UI components
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography>{children}</Typography>
      {/* {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null} */}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function ErrorDialog(errorMessage) {
  const [open, setOpen] = useState(true);

  // const handleClickOpen = event => {
  //   setOpen(true);
  // };

  // const handleClose = event => {
  //   setOpen(false);
  // };

  return (
    <Dialog
      // onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" /*onClose={handleClose}*/>
        Error
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>{errorMessage.errorMessage}</Typography>
        <Typography>It appears the graph database isn't available.</Typography>
      </DialogContent>
    </Dialog>
  );
}
