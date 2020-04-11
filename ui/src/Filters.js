import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

<<<<<<< HEAD
// <<<<<<< HEAD
// // import StateListFilter from "./StateListFilter";
// // import BuildYearFilter from "./BuildYearFilter";
// // import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";
// =======
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
import StateListFilter from "./StateListFilter";
import BuildYearFilter from "./BuildYearFilter";
// import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";
<<<<<<< HEAD
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea

export default function FiltersDialog({
  _selectedStates,
  _setSelectedStates,
  // _numSelectedStates,
  // _setNumSelectedStates
  _selectedYears,
<<<<<<< HEAD
  // <<<<<<< HEAD
  //   _setSelectedYears,
  //   _selectedOwners,
  //   _setSelectedOwners
  //   // maintRespSelected,
  //   // ownerSelected
  // }) {
  // =======
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
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
<<<<<<< HEAD
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea

  const [open, setOpen] = useState(false);
  const scroll = "paper";

  const [selectedStates, setSelectedStates] = useState(_selectedStates);
  const [selectedYears, setSelectedYears] = useState(_selectedYears);
<<<<<<< HEAD
  // <<<<<<< HEAD
  // const [selectedOwners, setSelectedOwners] = useState(_selectedOwners);
  // =======
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // const [numSelectedStates, setNumSelectedStates] = useState(
  //   _numSelectedStates
  // );

  const fullWidth = true;
  const maxWidth = "md";

<<<<<<< HEAD
  // <<<<<<< HEAD
  //   const handleClickOpen = event => {
  // =======
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // const handleClickOpen = scroll => () => {
  // const handleClickOpen = event => {
  const handleClickOpen = event => {
    // this.setState({ open: true, scroll });
<<<<<<< HEAD
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
    setOpen(true);
  };

  const handleClose = event => {
    //still needed?
<<<<<<< HEAD
    // <<<<<<< HEAD
    // =======
    //     // this.setState({ open: false });
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
    // this.setState({ open: false });
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
    setOpen(false);
  };

  const handleApply = event => {
    setOpen(false);
    _setSelectedStates(selectedStates);
    _setSelectedYears(selectedYears);
<<<<<<< HEAD
    // <<<<<<< HEAD
    //     _setSelectedOwners(selectedOwners);
    // =======
    //     // this.setState({ yearSelected: this.state.yearSelected });
    //     // this.setState({ maintRespSelected: this.state.maintRespSelected });
    //     // this.setState({ ownerSelected: this.state.ownerSelected });
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
    // this.setState({ yearSelected: this.state.yearSelected });
    // this.setState({ maintRespSelected: this.state.maintRespSelected });
    // this.setState({ ownerSelected: this.state.ownerSelected });
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
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
<<<<<<< HEAD
        // <<<<<<< HEAD
        //         maxWidth={maxWidth}
        //         disableBackdropClick
        //         disableEscapeKeyDown
        //         open={open}
        //         onClose={handleClose}
        // =======
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
        // maxWidth={this.state.maxWidth}
        maxWidth={maxWidth}
        disableBackdropClick
        disableEscapeKeyDown
        // open={this.state.open}
        open={open}
        // onClose={this.handleClose}
        onClose={handleClose}
        // scroll={this.state.scroll}
<<<<<<< HEAD
        // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
        <DialogContent>
<<<<<<< HEAD
          {/*<<<<<<< HEAD
          {/*<StateListFilter
=======
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
          <StateListFilter
            // triggerParentUpdate={this.updateThisProperty}
            // triggerParentUpdate={updateThisProperty}
            // selected={this.props.selected}
<<<<<<< HEAD
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            // numSelectedStates={numSelectedStates}
            // setNumSelectedStates={setNumSelectedStates}
<<<<<<< HEAD
<<<<<<< HEAD
          />*/}
          {/*<BuildYearFilter
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />* /}
=======*/}
          {/*/>*/}
=======
          />
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
          <BuildYearFilter
            // triggerParentUpdate={this.updateThisProperty}
            // triggerParentUpdate={updateThisProperty}
            // yearSelected={this.props.yearSelected}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
<<<<<<< HEAD
          {/*>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
          {/*<MaintenanceResponsibilityFilter
              triggerParentUpdate={this.updateThisProperty}
              maintRespSelected={this.props.maintRespSelected}
              maintRespSelected={maintRespSelected}
<<<<<<< HEAD
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
=======
            />*/}
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
          {/*<OwnerFilter
              triggerParentUpdate={this.updateThisProperty}
              ownerSelected={this.props.ownerSelected}
              ownerSelected={ownerSelected}
            />*/}
        </DialogContent>
        <DialogActions>
          <Button
            // onClick={this.handleCancel}
<<<<<<< HEAD
            // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            onClick={handleCancel}
            color="primary" /*value="Cancel"*/
          >
            Cancel
          </Button>
          <Button
<<<<<<< HEAD
            // <<<<<<< HEAD
            // =======
            // onClick={this.handleApply}
            // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
            // onClick={this.handleApply}
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            onClick={handleApply}
            color="primary" /*value="Apply"*/
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
<<<<<<< HEAD
  // <<<<<<< HEAD
  // }
  // =======
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // }
}

// FiltersDialog.propTypes = {
//   onClose: PropTypes.func
// };

// export default FiltersDialog;
<<<<<<< HEAD
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
