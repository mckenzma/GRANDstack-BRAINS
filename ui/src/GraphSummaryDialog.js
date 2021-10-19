import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import GraphSummaryNodes from "./GraphSummaryNodes";
import GraphSummaryRelationships from "./GraphSummaryRelationships";

import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";

// TODO update to makeStyles
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

export default function GraphSummaryDialog() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const [maxWidth, setMaxWidth] = useState("xl");

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
        <ListItemText>Graph Summary</ListItemText>
      </ListItem>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={maxWidth}
        // scroll={scroll}
        //scroll={this.state.scroll} // set this with useState?
        // aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Graph Data Summary
        </DialogTitle>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={1}>
            <Grid item xs={6} md={6}>
              <Paper>
                <GraphSummaryNodes />
              </Paper>
            </Grid>
            <Grid item xs={6} md={6}>
              <GraphSummaryRelationships />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
