import React, { Component } from 'react';
import './App.css';
// import UserList from './UserList';
import StateList from './StateList';
import BridgeList from './BridgeList';

// import Map from './Map';
// import 'mapbox-gl/dist/mapbox-gl.css';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
// import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';

// import React, { Fragment } from 'react';
import { Fragment } from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
// import MenuIcon from '@material-ui/icons/Menu';
// import AddIcon from '@material-ui/icons/Add';
// import SearchIcon from '@material-ui/icons/Search';
// import MoreIcon from '@material-ui/icons/MoreVert';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    //height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },

  container: {
    position: 'relative',
    // maxWidth: 500,
    width: '100%',
  },
  text: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  main: {
    height: 400,
    overflowY: 'auto',
    // position: 'relative',
    position: 'relative',
  },
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: '#fff',
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
});

// const messages = [
//   {
//     id: 1,
//     primary: 'Brunch this week?',
//     secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
//     person: '/static/images/adeel.jpg',
//   },
//   {
//     id: 2,
//     primary: 'Birthday Gift',
//     secondary: `Do you have a suggestion for a good present for John on his work 
//       anniversary. I am really confused & would love your thoughts on it.`,
//     person: '/static/images/uxceo-128.jpg',
//   },
//   {
//     id: 3,
//     primary: 'Recipe to try',
//     secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
//     person: '/static/images/remy.jpg',
//   },
//   {
//     id: 4,
//     primary: 'Yes!',
//     secondary: 'I have the tickets to the ReactConf for this year.',
//     person: '/static/images/uxceo-128.jpg',
//   },
//   {
//     id: 5,
//     primary: "Doctor's Appointment",
//     secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
//     person: '/static/images/adeel.jpg',
//   },
//   {
//     id: 6,
//     primary: 'Discussion',
//     secondary: `Menus that are generated by the bottom app bar (such as a bottom 
//       navigation drawer or overflow menu) open as bottom sheets at a higher elevation 
//       than the bar.`,
//     person: '/static/images/remy.jpg',
//   },
//   {
//     id: 7,
//     primary: 'Summer BBQ',
//     secondary: `Who wants to have a cookout this weekend? I just got some furniture
//       for my backyard and would love to fire up the grill.`,
//     person: '/static/images/uxceo-128.jpg',
//   },
// ];

class App extends Component {
  state = {
    open: false,
    anchor: 'left',

    // businesses: [],
    // mapCenter: {
    //   longitude: -93.2650,
    //   latitude: 44.9778,
    //   zoom: 13,
    // }
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>{mailFolderListItems}</List>
        {/*something*/}
        <Divider />
        <List>{otherMailFolderListItems}</List>
        {/*something else*/}
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === 'left') {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        {/*<TextField
          id="persistent-anchor"
          select
          label="Anchor"
          value={anchor}
          onChange={this.handleChangeAnchor}
          margin="normal"
        >
          <MenuItem value="left">left</MenuItem>
          <MenuItem value="right">right</MenuItem>
        </TextField>*/}
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
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
              <Typography variant="title" color="inherit" noWrap>
                B.R.A.I.N.S.
              </Typography>
            </Toolbar>
          </AppBar>
          {before}
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            {/*<Typography>{'You think water moves fast? You should see ice.'}</Typography>*/}
            {/*<UserList />*/}
            {/*<StateList />*/}
            <BridgeList />
            {/*<Map />*/}
          </main>
          {after}
        </div>

        <div className={classes.container}>
      {/*<Paper square className={classes.main}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Inbox
        </Typography>
        <List className={classes.list}>
          {messages.map(({ id, primary, secondary, person }) => (
            <Fragment key={id}>
              {id === 1 && <ListSubheader className={classes.subHeader}>Today</ListSubheader>}
              {id === 3 && <ListSubheader className={classes.subHeader}>Yesterday</ListSubheader>}
              <ListItem button>
                <Avatar alt="Profile Picture" src={person} />
                <ListItemText primary={primary} secondary={secondary} />
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Paper>
      {/*<AppBar position="sticky" color="primary">
        <Toolbar className={classes.toolbar}>
          {/*<IconButton color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Button variant="fab" color="secondary" aria-label="Add" className={classes.fabButton}>
            <AddIcon />
          </Button>
          <div>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </div>*/}
        {/*</Toolbar>
      </AppBar>*/}
    </div>

      </div>

      
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

//export default App;
export default withStyles(styles, { withTheme: true})(App);

// <div className="App">
//         <header className="App-header">
//           {/*<img src={process.env.PUBLIC_URL + '/img/grandstack.png'} className="App-logo" alt="logo" />*/}
//           {/*<h1 className="App-title">Welcome to GRANDstack</h1>*/}
//           <h1 className="App-title">B.R.A.I.N.S.</h1>
          
//         </header>
        
//         {/*<UserList />*/}
//         <StateList />
//         {/*<Map />*/}
//       </div>