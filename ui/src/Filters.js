import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

// <<<<<<< HEAD
// // import StateListFilter from "./StateListFilter";
// // import BuildYearFilter from "./BuildYearFilter";
// // import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";
// =======
import StateListFilter from "./StateListFilter";
import BuildYearFilter from "./BuildYearFilter";
// import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea

export default function FiltersDialog({
  _selectedStates,
  _setSelectedStates,
  // _numSelectedStates,
  // _setNumSelectedStates
  _selectedYears,
  // <<<<<<< HEAD
  //   _setSelectedYears,
  //   _selectedOwners,
  //   _setSelectedOwners
  //   // maintRespSelected,
  //   // ownerSelected
  // }) {
  // =======
  _setSelectedYears
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
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea

  const [open, setOpen] = useState(false);
  const scroll = "paper";

  const [selectedStates, setSelectedStates] = useState(_selectedStates);
  const [selectedYears, setSelectedYears] = useState(_selectedYears);
  // <<<<<<< HEAD
  // const [selectedOwners, setSelectedOwners] = useState(_selectedOwners);
  // =======
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // const [numSelectedStates, setNumSelectedStates] = useState(
  //   _numSelectedStates
  // );

  const fullWidth = true;
  const maxWidth = "md";

  // <<<<<<< HEAD
  //   const handleClickOpen = event => {
  // =======
  // const handleClickOpen = scroll => () => {
  // const handleClickOpen = event => {
  const handleClickOpen = event => {
    // this.setState({ open: true, scroll });
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
    setOpen(true);
  };

  const handleClose = event => {
    //still needed?
    // <<<<<<< HEAD
    // =======
    //     // this.setState({ open: false });
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
    setOpen(false);
  };

  const handleApply = event => {
    setOpen(false);
    _setSelectedStates(selectedStates);
    _setSelectedYears(selectedYears);
    // <<<<<<< HEAD
    //     _setSelectedOwners(selectedOwners);
    // =======
    //     // this.setState({ yearSelected: this.state.yearSelected });
    //     // this.setState({ maintRespSelected: this.state.maintRespSelected });
    //     // this.setState({ ownerSelected: this.state.ownerSelected });
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
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
        // <<<<<<< HEAD
        //         maxWidth={maxWidth}
        //         disableBackdropClick
        //         disableEscapeKeyDown
        //         open={open}
        //         onClose={handleClose}
        // =======
        // maxWidth={this.state.maxWidth}
        maxWidth={maxWidth}
        disableBackdropClick
        disableEscapeKeyDown
        // open={this.state.open}
        open={open}
        // onClose={this.handleClose}
        onClose={handleClose}
        // scroll={this.state.scroll}
        // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
        <DialogContent>
          {/*<<<<<<< HEAD
          {/*<StateListFilter
=======
          <StateListFilter
            // triggerParentUpdate={this.updateThisProperty}
            // triggerParentUpdate={updateThisProperty}
            // selected={this.props.selected}
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            // numSelectedStates={numSelectedStates}
            // setNumSelectedStates={setNumSelectedStates}
<<<<<<< HEAD
          />*/}
          {/*<BuildYearFilter
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />* /}
=======*/}
          {/*/>*/}
          <BuildYearFilter
            // triggerParentUpdate={this.updateThisProperty}
            // triggerParentUpdate={updateThisProperty}
            // yearSelected={this.props.yearSelected}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
          {/*>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
          {/*<MaintenanceResponsibilityFilter
              triggerParentUpdate={this.updateThisProperty}
              maintRespSelected={this.props.maintRespSelected}
              maintRespSelected={maintRespSelected}
            />* /}
<<<<<<< HEAD
          <OwnerFilter
              selectedOwners={selectedOwners}
              setSelectedOwners={setSelectedOwners}
            />
        </DialogContent>
        <DialogActions>
          <Button
=======
          {/*<OwnerFilter
              triggerParentUpdate={this.updateThisProperty}
              ownerSelected={this.props.ownerSelected}
              ownerSelected={ownerSelected}
            />*/}
        </DialogContent>
        <DialogActions>
          <Button
            // onClick={this.handleCancel}
            // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            onClick={handleCancel}
            color="primary" /*value="Cancel"*/
          >
            Cancel
          </Button>
          <Button
            // <<<<<<< HEAD
            // =======
            // onClick={this.handleApply}
            // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            onClick={handleApply}
            color="primary" /*value="Apply"*/
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  // <<<<<<< HEAD
  // }
  // =======
  // }
}

// FiltersDialog.propTypes = {
//   onClose: PropTypes.func
// };

// export default FiltersDialog;
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
