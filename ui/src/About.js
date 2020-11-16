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
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function AboutDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = event => {
    setOpen(true);
  };

  const handleClose = event => {
    setOpen(false);
  };

  return (
    <div>
      <ListItem
        button
        variant="outlined"
        color="secondary"
        onClick={handleClickOpen}
      >
        <ListItemText>About</ListItemText>
      </ListItem>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          About
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This demo was built on the{" "}
            <a href="https://grandstack.io/">
              <u>GRANDstack</u>
            </a>{" "}
            utilizing GraphQL, React, Apollo, and Neo4j Database.
          </Typography>
          <br />
          <Typography gutterBottom>
            All data included in this web application can be found at{" "}
            <a href="https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm">
              <u>Nation Bridge Inventory</u>
            </a>{" "}
            (NBI) website. Data decoding was done in accordance with{" "}
            <a href="https://www.fhwa.dot.gov/bridge/mtguide.pdf">
              <u>
                Recording and Coding Guide for the Structure Inventory and
                Appraisal of the Nations Bridges
              </u>
            </a>{" "}
            for importation into the{" "}
            <a href="https://neo4j.com/">
              <u>Neo4j</u>
            </a>{" "}
            database.
          </Typography>
          <br />
          <Typography gutterBottom>
            The purpose of this web application is to provide an interactive
            experience for you to explore the National Bridge Inventory data.
          </Typography>
          <br />
          <Typography gutterBottom>
            This application and database was designed and built by{" "}
            <a href="https://www.mckenzma.com/">
              <u>Michael McKenzie</u>
            </a>{" "}
            .
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
