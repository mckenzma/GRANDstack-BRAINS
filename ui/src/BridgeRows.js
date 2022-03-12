import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import BridgeTable from "./BridgeRowTable";

export default function ShowBridgeRows({
  code,
  placeCode,
  countyCode,
  stateCode
}) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xl");
  const [showChanges, setShowChanges] = useState(true);
  const [hideColumns, setHideColumns] = useState(false);

  // const [state, setState] = React.useState({
  //   changes: true,
  //   columns: true
  // });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSwitch() {
    if (showChanges) setShowChanges(false);
    else setShowChanges(true);
  }

  function handleHideColumns() {
    if (hideColumns) setHideColumns(false);
    else setHideColumns(true);
  }

  // const [selectedSwtiches, setSelectedSwitches] = useState([]);
  // const [selected, setSelected] = useState([]);
  // function handleClick(event, name) {
  //   setSelected(selectedSwtiches);
  //   const selectedIndex = selectedSwtiches.indexOf(name);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selectedSwtiches, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selectedSwtiches.slice(1));
  //   } else if (selectedIndex === selectedSwtiches.length - 1) {
  //     newSelected = newSelected.concat(selectedSwtiches.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selectedSwtiches.slice(0, selectedIndex),
  //       selectedSwtiches.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedSwitches(newSelected);
  // }

  // console.log(state);
  // console.log(selectedSwtiches);

  return (
    <>
      <Button onClick={handleClickOpen} variant="contained" color="secondary">
        Show Raw Data Rows
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        scroll={scroll}
      >
        <DialogTitle id="raw-data-rows-title">
          Raw Row Data
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={showChanges}
                  onChange={handleSwitch}
                  // onClick={(event) => handleClick(event,"showChanges")}
                  name="changes"
                  color="primary"
                />
              }
              label="Highlight Changes"
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={hideColumns}
                  onChange={handleHideColumns}
                  // onClick={(event) => handleClick(event,"hideColumns")}
                  name="columns"
                  color="primary"
                />
              }
              label="Hide Unchanged Columns"
            />
          </FormGroup>
        </DialogTitle>
        <BridgeTable
          code={code}
          placeCode={placeCode}
          countyCode={countyCode}
          stateCode={stateCode}
          showChanges={showChanges}
          hideColumns={hideColumns}
        />
      </Dialog>
    </>
  );
}
