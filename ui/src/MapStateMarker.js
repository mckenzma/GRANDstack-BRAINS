import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";

import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2
  }
}))(MuiDialogContent);

class StateMarker extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  toggleDialog = (open, state_name) => () => {
    this.setState({
      open: open,
      state_name: state_name
    });
  };

  // constructor(props) {
  //   super(props);

  //   this.state = {};
  // }

  render() {
    const { classes } = this.props;

    const stateIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });

    return (
      <Query
        query={gql`
          {
            State {
              name
              abbreviation
              longitude_decimal
              latitude_decimal
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <div>
              {data.State.map(s => {
                return (
                  <Marker
                    key={s.abbreviation}
                    position={[s.latitude_decimal, s.longitude_decimal]}
                    icon={stateIcon}
                    onClick={this.toggleDialog(true, s.name)}
                  />
                );
              })}

              <Dialog
                open={this.state.open}
                onClose={this.toggleDialog(false, "")}
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={this.handleClose}
                  aria-labelledby="customized-dialog-title"
                >
                  {this.state.state_name}
                </DialogTitle>
                <DialogContent>
                  <Typography gutterBottom>
                    This is where custom queries and recommendations will be
                    added!
                  </Typography>
                </DialogContent>
              </Dialog>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(StateMarker);
