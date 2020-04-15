import React, { useState } from "react";
// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// External functions/components
import StateListFilter from "./StateListFilter";
import BuildYearFilter from "./BuildYearFilter";
// import MaintenanceResponsibilityFilter from "./MaintenanceResponsibilityFilter";
// import OwnerFilter from "./OwnerFilter";

export default function FiltersDialog({
  _selectedStates,
  _setSelectedStates,
  // _numSelectedStates,
  // _setNumSelectedStates
  _selectedYears,
  _setSelectedYears
  // maintRespSelected,
  // ownerSelected
}) {
  const [open, setOpen] = useState(false);
  const scroll = "paper";

  const [selectedStates, setSelectedStates] = useState(_selectedStates);
  const [selectedYears, setSelectedYears] = useState(_selectedYears);
  const fullWidth = true;
  const maxWidth = "md";

  const handleClickOpen = event => {
    setOpen(true);
  };

  const handleClose = event => {
    setOpen(false);
  };

  const handleApply = event => {
    setOpen(false);
    _setSelectedStates(selectedStates);
    _setSelectedYears(selectedYears);
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
        maxWidth={maxWidth}
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
        <DialogContent>
          <StateListFilter
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            // numSelectedStates={numSelectedStates}
            // setNumSelectedStates={setNumSelectedStates}
          />
          <BuildYearFilter
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
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
          <Button onClick={handleCancel} color="primary" /*value="Cancel"*/>
            Cancel
          </Button>
          <Button onClick={handleApply} color="primary" /*value="Apply"*/>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  // }
}
