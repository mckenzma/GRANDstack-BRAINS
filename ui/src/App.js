import React, { Component } from "react";
import "./App.css";

import MapLeaf from "./MapLeaflet";

import PropTypes from "prop-types";
// import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import CustomizedDialogDemo from "./About";
import GraphSummaryDialog from "./GraphSummaryDialog";

import FiltersDialog from "./Filters";
import SummaryDialog from "./Summary";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
    flexGrow: 1
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  },

  container: {
    position: "relative",
    width: "100%"
  },
  text: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  main: {
    overflowY: "auto"
  },
  list: {
    marginBottom: theme.spacing(2)
  },
  subHeader: {
    backgroundColor: "#fff"
  },
  toolbar: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  button: {
    margin: theme.spacing(1)
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // from StateMenuList.js
      order: "asc",
      orderBy: "name",
      // from MapLeaflet.js
      lng: -98.5795, // center of US
      lat: 39.8283, //center of US
      zoom: 4,
      right: false,
      bridge_id: null,
      bridge_lat: null,
      bridge_lng: null,
      build_year: null,
      owned_by: null,
      maintained_by: null,

      name: "",

      // from here
      open: false,
      anchor: "left",
      openDialog: false,

      // selected: [], //trying to pull selected array up to pass into bridge query
      selected: ["DC"], //hard coded for development
      // yearSelected: [], //needed?
      yearSelected: [1942], //hard coded for development
      maintRespSelected: [],
      ownerSelected: []
    };
    this.updateThisProperty = this.updateThisProperty.bind(this);
    this.handleFilters = this.handleFilters.bind(this);
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  handleDialogOpen = () => {
    this.setState({ openDialog: true });
  };
  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  updateThisProperty(propertyName, value) {
    this.setState({ [propertyName]: value });
  }

  handleFilters(state) {
    this.setState({
      selected: state.selected,
      numSelected: state.numSelected,
      yearSelected: state.yearSelected,
      numYearSelected: state.numYearSelected,
      maintRespSelected: state.maintRespSelected,
      ownerSelected: state.ownerSelected
    });
  }

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />

        <CustomizedDialogDemo />
        <GraphSummaryDialog />
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
          // className={classNames(classes.appBar, {
          //   [classes.appBarShift]: open,
          //   [classes[`appBarShift-${anchor}`]]: open
          // })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                // className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h5"
                color="inherit"
                noWrap
                className={classes.root}
              >
                National Bridge Index
              </Typography>
              <FiltersDialog
                selected={this.state.selected}
                numSelected={this.state.numSelected}
                yearSelected={this.state.yearSelected}
                maintRespSelected={this.state.maintRespSelected}
                ownerSelected={this.state.ownerSelected}
                triggerFiltersUpdate={this.handleFilters}
              />
              <SummaryDialog
                selected={this.state.selected}
                yearSelected={this.state.yearSelected}
                // maintRespSelected={this.state.maintRespSelected}
                // ownerSelected={this.state.ownerSelected}
              />
            </Toolbar>
          </AppBar>
          {before}
          <main
          // className={classNames(
          //   classes.content,
          //   classes[`content-${anchor}`],
          //   {
          //     [classes.contentShift]: open,
          //     [classes[`contentShift-${anchor}`]]: open
          //   }
          // )}
          >
            {/*<div className={classes.drawerHeader} />
            {/*does this do anything?*/}
            <MapLeaf
              selected={this.state.selected}
              yearSelected={this.state.yearSelected}
              // maintRespSelected={this.state.maintRespSelected}
              // ownerSelected={this.state.ownerSelected}
            />
          </main>
          {after}
        </div>

        {/*<div className={classes.container} />
        {/* does this do anything */}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
