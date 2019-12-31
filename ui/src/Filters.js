import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import StateListFilter from "./StateListFilter";
// import BuildYearFilter from "./BuildYearFilter";
// import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";

export default function FiltersDialog({
  _selectedStates,
  _setSelectedStates //,
  // _numSelectedStates,
  // _setNumSelectedStates
  // yearSelected,
  // maintRespSelected,
  // ownerSelected
}) {
  // class FiltersDialog extends React.Component {
  // constructor(props) {
  //   super(props);

  // this.state = {
  // open: false,
  // scroll: "paper",
  // value: props.value,
  // fullWidth: true,
  // maxWidth: "md",

  // selected: this.props.selected,
  // yearSelected: this.props.yearSelected,
  // maintRespSelected: this.props.maintRespSelected,
  // ownerSelected: this.props.ownerSelected
  // };
  // this.updateThisProperty = this.updateThisProperty.bind(this);
  // this.handleApply = this.handleApply.bind(this);
  // }

  const [open, setOpen] = useState(false);
  const scroll = "paper";

  const [selectedStates, setSelectedStates] = useState(_selectedStates);
  // const [numSelectedStates, setNumSelectedStates] = useState(
  //   _numSelectedStates
  // );

  const fullWidth = true;
  const maxWidth = "md";

  // const handleClickOpen = scroll => () => {
  // const handleClickOpen = event => {
  const handleClickOpen = event => {
    // this.setState({ open: true, scroll });
    setOpen(true);
  };

  const handleClose = event => {
    //still needed?
    // this.setState({ open: false });
    setOpen(false);
  };

  const handleApply = event => {
    setOpen(false);
    _setSelectedStates(selectedStates);
    // this.setState({ yearSelected: this.state.yearSelected });
    // this.setState({ maintRespSelected: this.state.maintRespSelected });
    // this.setState({ ownerSelected: this.state.ownerSelected });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained" color="secondary">
        <BallotIcon />
        Filters
      </Button>
      <Dialog
        fullWidth={true}
        // maxWidth={this.state.maxWidth}
        maxWidth={maxWidth}
        disableBackdropClick
        disableEscapeKeyDown
        // open={this.state.open}
        open={open}
        // onClose={this.handleClose}
        onClose={handleClose}
        // scroll={this.state.scroll}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
        <DialogContent>
          <StateListFilter
            // triggerParentUpdate={this.updateThisProperty}
            // triggerParentUpdate={updateThisProperty}
            // selected={this.props.selected}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            // numSelectedStates={numSelectedStates}
            // setNumSelectedStates={setNumSelectedStates}
          />
          {/*<BuildYearFilter
            // triggerParentUpdate={this.updateThisProperty}
            // triggerParentUpdate={updateThisProperty}
            // yearSelected={this.props.yearSelected}
            yearSelected={yearSelected}
          />*/}
          {/*<MaintenanceResponsibilityFilter
              triggerParentUpdate={this.updateThisProperty}
              maintRespSelected={this.props.maintRespSelected}
              maintRespSelected={maintRespSelected}
            />*/}
          {/*<OwnerFilter
              triggerParentUpdate={this.updateThisProperty}
              ownerSelected={this.props.ownerSelected}
              ownerSelected={ownerSelected}
            />*/}
        </DialogContent>
        <DialogActions>
          <Button
            // onClick={this.handleCancel}
            onClick={handleCancel}
            color="primary" /*value="Cancel"*/
          >
            Cancel
          </Button>
          <Button
            // onClick={this.handleApply}
            onClick={handleApply}
            color="primary" /*value="Apply"*/
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  // }
}

// FiltersDialog.propTypes = {
//   onClose: PropTypes.func
// };

// export default FiltersDialog;
