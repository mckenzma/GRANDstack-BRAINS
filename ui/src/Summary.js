import React, { useState } from "react";
// MAterial UI components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
// External functions/components
// import DonutChartState from "./charts/ChartDonutState";
import BarChartState from "./charts/ChartBarState";
// import HeatMapState from "./ChartHeatState";
// import StackedBarChart1 from "./charts/StackedBarChart1";
// import StackedBarChart2 from "./charts/StackedBarChart2";

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

export default function SummaryDialog({ _selectedStates, _selectedYears }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xl");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Button onClick={handleClickOpen} variant="contained" color="secondary">
        Summary
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Summary</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <DonutChartState _selectedStates={_selectedStates} />
                </Paper>
              </Grid> */}
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <BarChartState _selectedStates={_selectedStates} />
                </Paper>
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
              {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <StackedBarChart1 />
                  </Paper>
                </Grid>*/}
              {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <StackedBarChart2 />
                  </Paper>
                </Grid>*/}
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
