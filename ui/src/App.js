import React, { useState, useRef, useEffect } from "react";
import "./App.css";
// Material UI components
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
// Externale functions/components
import MapLeaf from "./MapLeaflet";
import AboutDialog from "./About";
import GraphSummaryDialog from "./GraphSummaryDialog";
import FiltersDialog from "./Filters";
import SummaryDialog from "./Summary";
import MenuDrawer from "./MenuDrawer";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
}));

// TODO: add theme const & theme provider

export default function App() {
  const classes = useStyles();
  // const [order, setOrder] = useState("asc");
  // const [orderBy, setOrderBy] = useState("name");
  // const [lng, setLng] = useState(-98.5795);
  // const [lat, setLat] = useState(39.8283);
  // const [zoom, setZoom] = useState(4);
  // const [right, setRight] = useState(false);
  // const [bridge_id, setBridge_id] = useState(null);
  // const [bridge_lat, setBridge_lat] = useState(null);
  // const [bridge_lng, setBrige_lng] = useState(null);
  // const [bridge_year, setBridge_year] = useState(null);
  // const [owned_by, setOwned_by] = useState(null);
  // const [maintained_by, setMaintained_by] = useState(null);
  // const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState("left");
  // const [openDialog, setOpenDialog] = useState(false);
  const [_selectedStates, _setSelectedStates] = useState([
    // "AZ",
    // "DC",
    // "MN",
    // "MT",
    {
      code: "11",
      abbreviation: "DC"
    },
    {
      code: "24",
      abbreviation: "MD"
    },
    {
      code: "51",
      abbreviation: "VA"
    }
    // "51",
    // "VA"

    // "WA"
  ]);
  const [_selectedYears, _setSelectedYears] = useState([
    1987,
    1998,
    2005,
    2009,
    2012,
    2016,
    2017,
    2020
  ]);
  const [maintRespSelected, setMaintRespSelected] = useState([]);
  const [ownerSelected, setOwnerSelected] = useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const handleChangeAnchor = event => {
  //   setAnchor(event.target.value);
  // };

  // const handleDialogOpen = () => {
  //   setOpenDialog(true);
  // };

  // const handleDialogClose = () => {
  //   setOpenDialog(false);
  // };

  // const drawer = (
  //   <Drawer
  //     variant="persistent"
  //     anchor={anchor}
  //     open={open}
  //     classes={{
  //       paper: classes.drawerPaper
  //     }}
  //   >
  //     <div className={classes.drawerHeader}>
  //       {/*<IconButton onClick={this.handleDrawerClose}>*/}
  //       <IconButton onClick={handleDrawerClose}>
  //         {/*{theme.direction === "rtl" ? (*/}
  //         {classes.direction === "rtl" ? (
  //           <ChevronRightIcon />
  //         ) : (
  //           <ChevronLeftIcon />
  //         )}
  //       </IconButton>
  //     </div>
  //     <Divider />

  //     <AboutDialog />
  //     <GraphSummaryDialog />
  //   </Drawer>
  // );

  // let before = null;
  // let after = null;

  // if (anchor === "left") {
  //   before = drawer;
  // } else {
  //   after = drawer;
  // }

  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  useEffect(() => {
    if (headerRef) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  });

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar
          ref={headerRef}
          // className={classNames(classes.appBar, {
          //   [classes.appBarShift]: open,
          //   [classes[`appBarShift-${anchor}`]]: open
          // })}
        >
          <Toolbar disableGutters={!open}>
            <MenuDrawer />
            {/* <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerOpen}
              // className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton> */}
            <Typography
              variant="h5"
              color="inherit"
              noWrap
              className={classes.root}
            >
              National Bridge Inventory
            </Typography>
            <FiltersDialog
              _selectedStates={_selectedStates}
              _setSelectedStates={_setSelectedStates}
              // _numSelectedStates={_numSelectedStates}
              // _setNumSelectedStates={_setNumSelectedStates}
              _selectedYears={_selectedYears}
              _setSelectedYears={_setSelectedYears}
              // setYearSelected={setYearSelected}ed}
              // maintRespSelected={maintRespSelected}
              // setMaintRespSelected={setMaintRespSelected}
              // ownerSelected={ownerSelected}
              // setOwnerSelected={setOwnerSelected}
            />
            <SummaryDialog
              _selectedStates={_selectedStates}
              _selectedYears={_selectedYears}
            />
          </Toolbar>
        </AppBar>
        {/* {before} this is related to where the drawer shows up. drawer moved to separate component */}
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
            headerHeight={headerHeight}
          />
        </main>
        {/* {after} this is related to where the drawer shows up. drawer moved to separate component */}
      </div>

      {/*<div className={classes.container} />
        {/* does this do anything */}
    </div>
  );
}
