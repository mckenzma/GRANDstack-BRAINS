//<<<<<<< HEAD
//import React, { Component, useState } from 'react';
//import './App.css';
//import BridgeList from './BridgeList';
//import MapLeaf from './MapLeaflet';

//import PropTypes from 'prop-types';
// import classNames from 'classnames';
// import { withStyles } from '@material-ui/core/styles';
// import { makeStyles } from "@material-ui/core/styles";
// import Drawer from '@material-ui/core/Drawer';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// =======
import React, { useState } from "react";
import "./App.css";

import MapLeaf from "./MapLeaflet";
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea

import PropTypes from "prop-types";
// import classNames from "classnames";
// import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import AboutDialog from "./About";
import GraphSummaryDialog from "./GraphSummaryDialog";

import FiltersDialog from "./Filters";
import SummaryDialog from "./Summary";

// import FiltersDialog from './Filters';
// import SummaryDialog from './Summary';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  //<<<<<<< HEAD
  // const styles = theme => ({
  //=======
  // const styles = theme => ({
  //>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
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
    // <<<<<<< HEAD
    //     padding: theme.spacing(2),
    //     transition: theme.transitions.create('margin', {
    // =======
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto",
    transition: theme.transitions.create("margin", {
      // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
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
    // <<<<<<< HEAD
    //     paddingRight: theme.spacing(2),
    // =======
    paddingRight: theme.spacing(2)
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  },
  main: {
    overflowY: "auto"
  },
  list: {
    // <<<<<<< HEAD
    //     marginBottom: theme.spacing(2),
    // =======
    marginBottom: theme.spacing(2)
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  },
  subHeader: {
    backgroundColor: "#fff"
  },
  toolbar: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  button: {
    // <<<<<<< HEAD
    //     margin: theme.spacing(1)},
    // });

    // class App extends Component {
    //   constructor(props) {
    //     super(props);

    //     this.state = {
    //       // from StateMenuList.js
    //       order: "asc",
    //       orderBy: "name",
    //       // from MapLeaflet.js
    //       lng: -98.5795, // center of US
    //       lat: 39.8283, //center of US
    //       zoom: 4,
    //       right: false,
    //       bridge_id: null,
    //       bridge_lat: null,
    //       bridge_lng: null,
    //       build_year: null,
    //       owned_by: null,
    //       maintained_by: null,

    //       //name: "AZ",
    //       name: "",

    //       // from here
    //       open: false,
    //       anchor: 'left',
    //       openDialog: false,
    //     };
    //     this.updateThisProperty = this.updateThisProperty.bind(this);
    //   }
    // <<<<<<< Updated upstream
    // =======
    // =======
    margin: theme.spacing(1)
  }
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // });
}));

// TODO: add theme const & theme provider

export default function App() {
  const classes = useStyles();
  // class App extends Component {
  // constructor(props) {
  // super(props);

  // this.state = {
  // from StateMenuList.js
  // order: "asc",
  const [order, setOrder] = useState("asc");
  // orderBy: "name",
  const [orderBy, setOrderBy] = useState("name");
  // from MapLeaflet.js
  // lng: -98.5795, // center of US
  const [lng, setLng] = useState(-98.5795);
  // lat: 39.8283, //center of US
  const [lat, setLat] = useState(39.8283);
  // zoom: 4,
  const [zoom, setZoom] = useState(4);
  // right: false,
  const [right, setRight] = useState(false);
  // bridge_id: null,
  const [bridge_id, setBridge_id] = useState(null);
  // bridge_lat: null,
  const [bridge_lat, setBridge_lat] = useState(null);
  // bridge_lng: null,
  const [bridge_lng, setBrige_lng] = useState(null);
  // build_year: null,
  const [bridge_year, setBridge_year] = useState(null);
  // owned_by: null,
  const [owned_by, setOwned_by] = useState(null);
  // maintained_by: null,
  const [maintained_by, setMaintained_by] = useState(null);

  // name: "",
  const [name, setName] = useState("");

  // from here
  // open: false,
  const [open, setOpen] = useState(false);
  // anchor: "left",
  const [anchor, setAnchor] = useState("left");
  // openDialog: false,
  const [openDialog, setOpenDialog] = useState(false);

  // selected: [], //trying to pull selected array up to pass into bridge query
  // selected: ["DC"], //hard coded for development
  // <<<<<<< HEAD
  const [_selectedStates, _setSelectedStates] = useState([
    "AZ",
    "DC",
    "MN",
    "MT",
    "VA",
    "WA"
  ]);
  // =======
  // const [_selectedStates, _setSelectedStates] = useState(["DC"]);
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // const [numSelected, setNumSelected] = useState(0);
  // const [_numSelectedStates, _setNumSelectedStates] = useState(1); // refactor to remove this
  // yearSelected: [], //needed?
  // yearSelected: [1942], //hard coded for development
  // <<<<<<< HEAD
  const [_selectedYears, _setSelectedYears] = useState([
    1987,
    1998,
    2005,
    2009,
    2010,
    2012,
    2013,
    2017
  ]);
  // maintRespSelected: [],
  const [maintRespSelected, setMaintRespSelected] = useState([]);
  // ownerSelected: []
  const [_selectedOwners, _setSelectedOwners] = useState([]);
  // =======
  // const [_selectedYears, _setSelectedYears] = useState([1942]);
  // maintRespSelected: [],
  // const [maintRespSelected, setMaintRespSelected] = useState([]);
  // ownerSelected: []
  // const [ownerSelected, setOwnerSelected] = useState([]);
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  // };
  // this.updateThisProperty = this.updateThisProperty.bind(this);
  // this.handleFilters = this.handleFilters.bind(this);
  // }

  // console.log(_selectedStates);
  const handleDrawerOpen = () => {
    // this.setState({ open: true });
    setOpen(true);
    // <<<<<<< HEAD
  };
  // >>>>>>> Stashed changes

  // state = {
  //   open: false,
  //   anchor: 'left',
  //   openDialog: false,
  // };

  // handleDrawerOpen = () => {
  //   this.setState({ open: true });
  // };

  // handleDrawerClose = () => {
  //   this.setState({ open: false });
  // };

  // handleChangeAnchor = event => {
  //   this.setState({
  //     anchor: event.target.value,
  //   });
  // };

  // handleDialogOpen = () => {
  //   this.setState({ openDialog: true });
  // };
  // handleDialogClose = () => {
  //   this.setState({ openDialog: false})
  // };

  // updateThisProperty(name) {
  //   this.setState({ name: name });
  //   //console.log("look at me");
  // }

  // render() {
  // const { classes, theme } = this.props;
  // const { anchor, open } = this.state;
  //const { openDialog } = this.state;

  //   const drawer = (
  //     <Drawer
  //       variant="persistent"
  //       anchor={anchor}
  //       open={open}
  //       classes={{
  //         paper: classes.drawerPaper,
  //       }}
  //     >
  //       <div className={classes.drawerHeader}>
  //         <IconButton /*onClick={this.handleDrawerClose}*/>
  //           {/*{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}*/}
  //         </IconButton>
  //       </div>
  //       <Divider />
  //
  //
  //        {/*<List>
  //          <ListItem >
  //            <Button onClick={this.handleDialogOpen}>
  //              About
  //            </Button>
  //            <Dialog
  //              open={this.state.openDialog}
  //              onClose={this.handleDialogClose}
  //              aria-labelledby="alert-dialog-title"
  //              aria-describedby="alert-dialog-description"
  //            >
  //{/*<<<<<<< Updated upstream* /}
  //              <DialogTitle id="alert-dialog-title">{"About"}</DialogTitle>
  //              <DialogContent>
  //                <DialogContentText id="alert-dialog-description">
  //                  Interesting information about this project goes here!
  //                </DialogContentText>
  //              </DialogContent>
  //              <DialogActions>
  //                <Button onClick={this.handleDialogClose} color="primary">
  //                  Close
  //                </Button>
  //              </DialogActions>
  //            </Dialog>
  //          </ListItem>
  //        </List>*/}
  //
  //
  //
  //
  //
  //        {/*<CustomizedDialogDemo />*/}
  //        <Divider />
  //        {/*<StateListMenu />*/}
  //        {/*<StateListMenu /*triggerParentUpdate={this.updateThisProperty}*/ />*/}
  //      </Drawer>
  //    );
  // =======
  // };

  const handleDrawerClose = () => {
    // this.setState({ open: false });
    setOpen(false);
  };

  const handleChangeAnchor = event => {
    // this.setState({
    //   anchor: event.target.value
    // });
    setAnchor(event.target.value);
  };

  const handleDialogOpen = () => {
    // this.setState({ openDialog: true });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    // this.setState({ openDialog: false });
    setOpenDialog(false);
  };
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea

  // updateThisProperty(propertyName, value) {
  //   this.setState({ [propertyName]: value });
  // }

  // handleFilters(state) {
  //   this.setState({
  //     selected: state.selected,
  //     numSelected: state.numSelected,
  //     yearSelected: state.yearSelected,
  //     numYearSelected: state.numYearSelected,
  //     maintRespSelected: state.maintRespSelected,
  //     ownerSelected: state.ownerSelected
  //   });
  // }

  // render() {
  // const { classes, theme } = this.props;
  // const { anchor, open } = this.state;

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
        {/*<IconButton onClick={this.handleDrawerClose}>*/}
        <IconButton onClick={handleDrawerClose}>
          {/*{theme.direction === "rtl" ? (*/}
          {classes.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />

      {/*<<<<<<< HEAD
    if (anchor === 'left') {
      before = drawer;
    } else {
      after = drawer;
    }
return (
<div>
<AppBar>
<Toolbar>
<Typography>
=======*/}
      <AboutDialog />
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
              // onClick={this.handleDrawerOpen}
              onClick={handleDrawerOpen}
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
              {/*>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea*/}
              National Bridge Index
            </Typography>
            <FiltersDialog
              // selected={this.state.selected}
              _selectedStates={_selectedStates}
              _setSelectedStates={_setSelectedStates}
              // numSelected={this.state.numSelected}
              // _numSelectedStates={_numSelectedStates}
              // _setNumSelectedStates={_setNumSelectedStates}
              // yearSelected={this.state.yearSelected}
              _selectedYears={_selectedYears}
              _setSelectedYears={_setSelectedYears}
              // setYearSelected={setYearSelected}
              // maintRespSelected={this.state.maintRespSelected}
              // maintRespSelected={maintRespSelected}
              // setMaintRespSelected={setMaintRespSelected}
              // ownerSelected={this.state.ownerSelected}
              // ownerSelected={ownerSelected}
              // <<<<<<< HEAD
              _selectedOwners={_selectedOwners}
              _setSelectedOwners={_setSelectedOwners}
              // setOwnerSelected={setOwnerSelected}
              // triggerFiltersUpdate={this.handleFilters}
            />
            {/*<SummaryDialog
=======
              // setOwnerSelected={setOwnerSelected}
              // triggerFiltersUpdate={this.handleFilters}
            />
            <SummaryDialog
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
              // selected={this.state.selected}
              _selectedStates={_selectedStates}
              // yearSelected={this.state.yearSelected}
              _selectedYears={_selectedYears}
              // maintRespSelected={this.state.maintRespSelected}
              // ownerSelected={this.state.ownerSelected}
<<<<<<< HEAD
            />*/}
            {/*=======*/}
            {/*/>
{/*>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea*/}
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
          {/*<<<<<<< HEAD*/}
          <div className={classes.drawerHeader} />
          {/*does this do anything?*/}
          {/*<MapLeaf
=======
          {/*<div className={classes.drawerHeader} />
            {/*does this do anything?*/}
          <MapLeaf
            //>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
            _selectedStates={_selectedStates}
            _selectedYears={_selectedYears}
            // maintRespSelected={this.state.maintRespSelected}
            // ownerSelected={this.state.ownerSelected}
            //<<<<<<< HEAD
            //           />*/}
            //         </main>
            //         {after}
            //       </div>

            //     );
            //   }
            // =======
          />
        </main>
        {after}
      </div>

      {/*<div className={classes.container} />
        {/* does this do anything */}
    </div>
  );
  // }
}

// App.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(App);
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
