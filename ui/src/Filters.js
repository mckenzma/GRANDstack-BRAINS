import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import StateListFilter from "./StateListFilter";
import BuildYearFilter from "./BuildYearFilter";
import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";

class FiltersDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      scroll: "paper",
      value: props.value,
      fullWidth: true,
      maxWidth: "xl",

      selected: this.props.selected,
      yearSelected: this.props.yearSelected,
      maintRespSelected: this.props.maintRespSelected
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
    this.setState({ open: false });
    this.setState({ selected: this.state.selected });
    this.setState({ yearSelected: this.state.yearSelected });
    this.setState({ maintRespSelected: this.state.maintRespSelected });
    this.props.triggerFiltersUpdate(this.state);
  };

  handleCancel = () => {
    this.props = this.props;
    this.setState({ open: false });
  };

  updateThisProperty(propertyName, value) {
    this.setState({ [propertyName]: value });
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.handleClickOpen("paper")}
          variant="contained"
          color="secondary"
        >
          <BallotIcon />
          Filters
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={this.state.maxWidth}
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
          <DialogContent>
            <StateListFilter
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
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCancel}
              color="primary" /*value="Cancel"*/
            >
              Cancel
            </Button>
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
};

export default FiltersDialog;
