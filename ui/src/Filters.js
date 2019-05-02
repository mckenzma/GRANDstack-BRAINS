import React from "react";
import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import StateListMenu from "./StateListMenu";
import BuildYearFilter from "./BuildYearFilter";

// const styles = theme => ({
//   button: {
//     margin: theme.spacing.unit
//   },
//   input: {
//     display: "none"
//   }
// });

// function FiltersButton(props) {
//   const { classes } = props;
//   return (
//     <div>
//       <Button variant="contained" className={classes.button} color="secondary">
//         <BallotIcon />
//         Filters
//       </Button>
//     </div>
//   );
// }

// FiltersButton.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(FiltersButton);

class FiltersDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      scroll: "paper",
      value: props.value,
      fullWidth: true,
      maxWidth: "xl",

      // selected: [] //trying to pull selected array up to pass into bridge query
      selected: this.props.selected,
      yearSelected: this.props.yearSelected
    };
    this.updateThisProperty = this.updateThisProperty.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleClickOpen = scroll => () => {
    this.setState({ open: true, scroll });
  };

  handleClose = () => {
    //still needed?
    this.setState({ open: false });
  };

  handleApply = () => {
    // this.props.onClose(this.state.value);

    this.setState({ open: false });
    this.setState({ selected: this.state.selected });
    this.setState({ yearSelected: this.state.yearSelected });
    // this.props = this.state;
    // this.setState({ selected: this.state.selected });
    // this.updateThisProperty("selected", this.state.selected);
    // this.props.triggerParentUpdate("selected", this.props.selected);
    this.props.triggerFiltersUpdate(this.state);
    // console.log(this.state.selected);
    // console.log(this.state.yearSelected);
    // console.log("trigger filters to update in parent...but how?");
  };

  handleCancel = () => {
    // this.props.onClose(this.props.value);
    this.props = this.props;
    this.setState({ open: false });
    // console.log("filter changes canceled");
  };

  // handleChange = (event, value) => {
  //   this.setState({ value });
  // };

  updateThisProperty(propertyName, value) {
    this.setState({ [propertyName]: value });
    // this.props.triggerParentUpdate(propertyName, value); // move this to only happen when selecting "Apply"
    // console.log("property updated at 'Filters.js': " + propertyName + ": " + value);
  }

  render() {
    // const { selected } = this.state;
    // const { classes, theme } = this.props;

    return (
      <div>
        <Button
          onClick={this.handleClickOpen("paper")}
          variant="contained"
          // className={this.props.button}

          color="secondary"
        >
          <BallotIcon />
          Filters
        </Button>
        <Dialog
          // fullWidth={this.state.fullWidth}
          fullWidth={true}
          maxWidth={this.state.maxWidth}
          disableBackdropClick
          disableEscapeKeyDown
          //maxWidth="xl"
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
          <DialogContent>
            {/*<DialogContentText>
              Filters go either here or outside of this div
            </DialogContentText>*/}
            <StateListMenu
              triggerParentUpdate={this.updateThisProperty}
              selected={this.props.selected}
            />
            <BuildYearFilter
              triggerParentUpdate={this.updateThisProperty}
              yearSelected={this.props.yearSelected}
            />
          </DialogContent>
          <DialogActions>
            {/*<Button onClick={this.handleClose} color="primary">*/}
            <Button
              onClick={this.handleCancel}
              color="primary" /*value="Cancel"*/
            >
              Cancel
            </Button>
            {/*<Button onClick={this.handleClose} color="primary">*/}
            <Button
              onClick={this.handleApply}
              color="primary" /*value="Apply"*/
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

FiltersDialog.propTypes = {
  onClose: PropTypes.func
  // classes: PropTypes.object.isRequired,
  // theme: PropTypes.object.isRequired
};

export default FiltersDialog;
