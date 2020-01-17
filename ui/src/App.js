import React, { useState } from "react";
import "./App.css";

import MapLeaf from "./MapLeaflet";

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

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
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
  const [_selectedStates, _setSelectedStates] = useState(["DC"]);
  // const [numSelected, setNumSelected] = useState(0);
  // const [_numSelectedStates, _setNumSelectedStates] = useState(1); // refactor to remove this
  // yearSelected: [], //needed?
  // yearSelected: [1942], //hard coded for development
  const [_selectedYears, _setSelectedYears] = useState([1942]);
  // maintRespSelected: [],
  const [maintRespSelected, setMaintRespSelected] = useState([]);
  // ownerSelected: []
  const [ownerSelected, setOwnerSelected] = useState([]);
  // };
  // this.updateThisProperty = this.updateThisProperty.bind(this);
  // this.handleFilters = this.handleFilters.bind(this);
  // }

  // console.log(_selectedStates);
  const handleDrawerOpen = () => {
    // this.setState({ open: true });
    setOpen(true);
  };

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
              // setOwnerSelected={setOwnerSelected}
              // triggerFiltersUpdate={this.handleFilters}
            />
            <SummaryDialog
              // selected={this.state.selected}
              _selectedStates={_setSelectedStates}
              // yearSelected={this.state.yearSelected}
              _selectedYears={_setSelectedYears}
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
            _selectedStates={_selectedStates}
            _selectedYears={_selectedYears}
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
  // }
}

// App.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(App);
