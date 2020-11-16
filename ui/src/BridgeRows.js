import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Table from "@material-ui/core/Table";

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
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xl");
  const [showChanges, setShowChanges] = useState(true);

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
        // aria-labelledby=""
      >
        <DialogTitle id="raw-data-rows-title">
          Raw Row Data
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={showChanges}
                  onChange={handleSwitch}
                  name="checkedA"
                />
              }
              label="Highlight Changes"
            />
            {/* <FormControlLabel
        control={
          <Switch
            checked={showChanges}
            onChange={handleSwitch}
            name="checkedB"
            color="primary"
          />
        }
        label="Primary"
      /> */}
            {/* <FormControlLabel control={<Switch />} label="Uncontrolled" />
      <FormControlLabel disabled control={<Switch />} label="Disabled" />
      <FormControlLabel disabled control={<Switch checked />} label="Disabled" /> */}
          </FormGroup>
        </DialogTitle>
        <BridgeTable
          code={code}
          placeCode={placeCode}
          countyCode={countyCode}
          stateCode={stateCode}
          showChanges={showChanges}
        />
      </Dialog>
    </>
  );
}
