import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
// import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import DonutChartState from "./ChartDonutState";
import BarChartState from "./ChartBarState";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class SummaryDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      scroll: "paper",
      value: props.value,
      fullWidth: true,
      maxWidth: "xl",

      selected: this.props.selected
      // yearSelected: this.props.yearSelected,
      // maintRespSelected: this.props.maintRespSelected,
      // ownerSelected: this.props.ownerSelected
    };
  }

  handleClickOpen = scroll => () => {
    this.setState({ open: true, scroll });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          onClick={this.handleClickOpen("paper")}
          variant="contained"
          color="secondary"
        >
          Summary
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Summary</DialogTitle>
          <DialogContent>
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper}>
                    <DonutChartState
                      selected={this.props.selected}
                      // yearSelected={this.state.yearSelected}
                      // maintRespSelected={this.state.maintRespSelected}
                      // ownerSelected={this.state.ownerSelected}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper}>
                    <BarChartState
                      selected={this.props.selected}
                      // yearSelected={this.state.yearSelected}
                      // maintRespSelected={this.state.maintRespSelected}
                      // ownerSelected={this.state.ownerSelected}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

SummaryDialog.propTypes = {
  onClose: PropTypes.func
  // classes: PropTypes.object.isRequired,
  // theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SummaryDialog);
