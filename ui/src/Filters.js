import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

// function FiltersButton(props) {
//   const { classes } = props;
//   return (
//     <div>
//       <Button variant="contained" className={classes.button} color="secondary">
//         <BallotIcon />
//         Filters
//       </Button>
//     </div>
//   );
// }

// FiltersButton.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(FiltersButton);

class FiltersDialog extends React.Component {
  state = {
    open: false,
    scroll: "paper"
  };

  handleClickOpen = scroll => () => {
    this.setState({ open: true, scroll });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button
          onClick={this.handleClickOpen("paper")}
          variant="contained"
          /*className={classes.button}*/ color="secondary"
        >
          <BallotIcon />
          Filters
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Filters</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Filters go either here or outside of this div
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default FiltersDialog;
