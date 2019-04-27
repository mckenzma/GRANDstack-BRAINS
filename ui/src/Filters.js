import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

function FiltersButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button variant="contained" className={classes.button} color="secondary">
        <BallotIcon /> Filters
      </Button>
    </div>
  );
}

FiltersButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FiltersButton);
