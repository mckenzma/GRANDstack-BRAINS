import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import DonutChartState from "./ChartDonutState";
import BarChartState from "./ChartBarState";

// import HeatMapState from "./ChartHeatState";

// import StackedBarChart1 from "./StackedBarChart1";
// import StackedBarChart2 from "./StackedBarChart2";

const useStyles = makeStyles(theme => ({
  // <<<<<<< HEAD
  // =======
  //   // const styles = theme => ({
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
  // });
}));

// <<<<<<< HEAD
// export default function SummaryDialog({ _selectedStates, _selectedYears, _selectedOwners }) {
//   const classes = useStyles();

// =======
export default function SummaryDialog({ _selectedStates, _selectedYears }) {
  const classes = useStyles();
  // class SummaryDialog extends React.Component {
  // constructor(props) {
  // super(props);

  // this.state = {
  // open: false,
  // scroll: "paper",
  // value: props.value,
  // fullWidth: true,
  // maxWidth: "xl",

  // selected: this.props.selected,
  // yearSelected: this.props.yearSelected,
  // maintRespSelected: this.props.maintRespSelected,
  // ownerSelected: this.props.ownerSelected
  // };
  // }
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  // const [value,setValue] = useState(props.value);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xl");

  const handleClickOpen = () => {
    // <<<<<<< HEAD
    // =======
    //     // const handleClickOpen = scroll => () => {
    //     // this.setState({ open: true, scroll });
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
    setOpen(true);
  };

  const handleClose = () => {
    // <<<<<<< HEAD
    setOpen(false);
  };

  //  return (
  //    <div>
  //      <Button
  //=======
  //    // this.setState({ open: false });
  //    setOpen(false);
  //  };

  // render() {
  // const { classes } = this.props;

  return (
    <div>
      <Button
        // onClick={this.handleClickOpen("paper")}
        // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
        // onClick={handleClickOpen("paper")}
        onClick={handleClickOpen}
        variant="contained"
        color="secondary"
      >
        Summary
      </Button>
      <Dialog
        fullWidth={true}
        // <<<<<<< HEAD
        //         maxWidth={maxWidth}
        //         open={open}
        //         onClose={handleClose}
        // =======
        // maxWidth={this.state.maxWidth}
        maxWidth={maxWidth}
        // open={this.state.open}
        open={open}
        // onClose={this.handleClose}
        onClose={handleClose}
        // scroll={this.state.scroll}
        // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Summary</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <Grid container spacing={24}>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <DonutChartState
                    // <<<<<<< HEAD
                    //                     _selectedStates={_selectedStates}
                    // =======
                    // selected={this.props.selected}
                    _selectedStates={_selectedStates}
                    // yearSelected={this.state.yearSelected}
                    // maintRespSelected={this.state.maintRespSelected}
                    // ownerSelected={this.state.ownerSelected}
                    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <BarChartState
                    // <<<<<<< HEAD
                    _selectedStates={_selectedStates}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {/*<Paper className={classes.paper}>
                    <HeatMapState
                      _selectedStates={_selectedStates}
                      _selectedOwners={_selectedOwners}
                    />
                  </Paper>*/}
              </Grid>
              {/*=======
                    // selected={this.props.selected}
                    _selectedStates={_selectedStates}
                    // yearSelected={this.state.yearSelected}
                    // maintRespSelected={this.state.maintRespSelected}
                    // ownerSelected={this.state.ownerSelected}
                  />
                </Paper>*/}
            </Grid>
            {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <HeatMapState
                      selected={this.props.selected}
                      // yearSelected={this.state.yearSelected}
                      // maintRespSelected={this.state.maintRespSelected}
                      ownerSelected={this.props.ownerSelected}
                    />
                  </Paper>
                </Grid>*/}
            {/*>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea*/}
            {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <StackedBarChart1 />
                  </Paper>
                </Grid>*/}
            {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <StackedBarChart2 />
                  </Paper>
                </Grid>* /}
            </Grid>*/}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  // <<<<<<< HEAD
  // }
  // =======
  // }
}

// SummaryDialog.propTypes = {
//   onClose: PropTypes.func
// classes: PropTypes.object.isRequired,
// theme: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(SummaryDialog);
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
