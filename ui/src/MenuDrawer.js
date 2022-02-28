import React, { useState } from "react";
// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";

// Externale functions/components
import AboutDialog from "./About";
import GraphSummaryDialog from "./GraphSummaryDialog";

const useStyles = makeStyles(theme => ({}));

export default function MenuDrawer() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = event => {
    setOpen(true);
  };

  const handleClickClose = event => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Open Drawer"
        onClick={handleClickOpen}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor={"left"}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleClickClose}>
            {classes.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />

        <AboutDialog />
        <GraphSummaryDialog />
      </Drawer>
    </>
  );
}
