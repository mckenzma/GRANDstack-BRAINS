import React, { Component } from "react";
import "./App.css";
//import BridgeList from './BridgeList';
import MapLeaf from "./MapLeaflet";

import PropTypes from "prop-types";
import classNames from "classnames";
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
import StateListMenu from "./StateListMenu";

//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
//import ListItemText from '@material-ui/core/ListItemText';

import CustomizedDialogDemo from "./About";

//import Button from '@material-ui/core/Button';
//import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    //height: 430,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
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
    position: "relative",
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
    padding: theme.spacing.unit * 3,
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
    // maxWidth: 500,
    width: "100%"
  },
  text: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  main: {
    // height: 400,
    overflowY: "auto",
    // position: 'relative',
    position: "relative"
  },
  list: {
    marginBottom: theme.spacing.unit * 2
  },
  subHeader: {
    backgroundColor: "#fff"
  },
  toolbar: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  fabButton: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto"
  },
  button: {
    margin: theme.spacing.unit
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

      //name: "AZ",
      name: "",

      // from here
      open: false,
      anchor: "left",
      openDialog: false,

      selected: [] //trying to pull selected array up to pass into bridge query
    };
    this.updateThisProperty = this.updateThisProperty.bind(this);
    // this.updateThisPropertySelected = this.updateThisPropertySelected.bind(this);
  }

  /*  state = {
    open: false,
    anchor: 'left',
    openDialog: false,
  };*/

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

  // updateThisProperty(name) {
  //   this.setState({ name: name });
  //   // console.log("update property: " + selected);
  //   // this.setState({ selected: selected }); //trying to pull selected array up to pass into bridge query
  //   //console.log("look at me");
  // }

  updateThisProperty(propertyName, value) {
    this.setState({ [propertyName]: value });
    // console.log("update property: " + propertyName + ": " + value);
  }

  // updateThisPropertySelected(selected) {
  //   this.setState({ selected: selected });
  //   console.log("update property: " + selected);
  //   // this.setState({ selected: selected }); //trying to pull selected array up to pass into bridge query
  //   //console.log("look at me");
  // }

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;
    //const { openDialog } = this.state;

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

        {/*<List>
          <ListItem >
            <Button onClick={this.handleDialogOpen}>
              About
            </Button>
            <Dialog
              open={this.state.openDialog}
              onClose={this.handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"About"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Interesting information about this project goes here!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleDialogClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </ListItem>
        </List>*/}

        <CustomizedDialogDemo />
        <Divider />
        {/*<StateListMenu />*/}
        <StateListMenu triggerParentUpdate={this.updateThisProperty} />
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
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="title"
                color="inherit"
                noWrap
                className={classes.root}
              >
                National Bridge Index
              </Typography>
              {/*<Button variant="contained" color="inherit" disabled >Summary</Button>
              <Button variant="contained" color="inherit" disabled >Filters</Button>*/}
            </Toolbar>
          </AppBar>
          {before}
          <main
            className={classNames(
              classes.content,
              classes[`content-${anchor}`],
              {
                [classes.contentShift]: open,
                [classes[`contentShift-${anchor}`]]: open
              }
            )}
          >
            <div className={classes.drawerHeader} />
            {/*<BridgeList />*/}
            <MapLeaf name={this.state.name} selected={this.state.selected} />
            {/*<MapLeaf triggerParentUpdate={this.updateThisProperty}/>*/}
          </main>
          {after}
        </div>

        <div className={classes.container} />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
