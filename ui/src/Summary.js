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

// import StateListFilter from "./StateListFilter";
// import BuildYearFilter from "./BuildYearFilter";
// import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";

// import DonutChart from "./ChartDonut";
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
    // this.updateThisProperty = this.updateThisProperty.bind(this);
    // this.handleApply = this.handleApply.bind(this);
  }

  handleClickOpen = scroll => () => {
    this.setState({ open: true, scroll });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // handleApply = () => {
  //   this.setState({ open: false });
  //   this.setState({ selected: this.state.selected });
  //   this.setState({ yearSelected: this.state.yearSelected });
  //   this.setState({ maintRespSelected: this.state.maintRespSelected });
  //   this.setState({ ownerSelected: this.state.ownerSelected });
  //   this.props.triggerFiltersUpdate(this.state);
  // };

  // handleCancel = () => {
  //   this.props = this.props;
  //   this.setState({ open: false });
  // };

  // updateThisProperty(propertyName, value) {
  //   this.setState({ [propertyName]: value });
  // }

  render() {
    const { classes } = this.props;
    // const { classes } = this.state;

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
                {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <DonutChart />
                  </Paper>
                </Grid>*/}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <DonutChartState
                      selected={this.props.selected}
                      // yearSelected={this.state.yearSelected}
                      // maintRespSelected={this.state.maintRespSelected}
                      // ownerSelected={this.state.ownerSelected}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <BarChartState
                    // selected={this.state.selected}
                    // yearSelected={this.state.yearSelected}
                    // maintRespSelected={this.state.maintRespSelected}
                    // ownerSelected={this.state.ownerSelected}
                    />
                  </Paper>
                </Grid>
                {/*<Grid item xs={6} sm={3}>
                  <Paper className={classes.paper}>xs=6 sm=3</Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper className={classes.paper}>xs=6 sm=3</Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper className={classes.paper}>xs=6 sm=3</Paper>
                </Grid>*/}
              </Grid>
            </div>

            {/*<StateListFilter
              triggerParentUpdate={this.updateThisProperty}
              selected={this.props.selected}
            />
            <BuildYearFilter
              triggerParentUpdate={this.updateThisProperty}
              yearSelected={this.props.yearSelected}
            />
            <MaintenanceResponsibilityFilter
              triggerParentUpdate={this.updateThisProperty}
              maintRespSelected={this.props.maintRespSelected}
            />
            <OwnerFilter
              triggerParentUpdate={this.updateThisProperty}
              ownerSelected={this.props.ownerSelected}
            />*/}
          </DialogContent>
          {/*<DialogActions>
            <Button
              onClick={this.handleCancel}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleApply}
              color="primary"
            >
              Apply
            </Button>
          </DialogActions>*/}
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
