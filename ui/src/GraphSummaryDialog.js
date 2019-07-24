import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import GraphSummaryNodes from "./GraphSummaryNodes";
import GraphSummaryRelationships from "./GraphSummaryRelationships";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2
  }
}))(MuiDialogContent);

class GraphSummaryDialog extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
      maxWidth: "xl"
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Query
        query={gql`
          {
            relationshipSummaryCount {
              type
              count
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          // console.log(data.relationshipSummaryCount);

          return (
            // <div>
            //   {data.relationshipSummaryCount.map(rsc => {
            //   // {data}
            //     return(
            //       <p>{rsc.type}: {rsc.count}</p>
            //     );
            //   })}
            //   </div>

            <div>
              <ListItem
                button
                variant="outlined"
                color="secondary"
                onClick={this.handleClickOpen}
              >
                <ListItemText>Graph Summary</ListItemText>
              </ListItem>
              <Dialog
                onClose={this.handleClose}
                aria-labelledby="customized-dialog-title"
                open={this.state.open}
                fullWidth={true}
                maxWidth={this.state.maxWidth}
                scroll={this.state.scroll}
                // aria-labelledby="scroll-dialog-title"
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={this.handleClose}
                >
                  Graph Data Summary
                </DialogTitle>
                <DialogContent>
                  <GraphSummaryNodes />
                  <GraphSummaryRelationships />
                  {/*({data.relationshipSummaryCount.map(rsc => {
                      return(
                        <p key={rsc.type}>{rsc.type}: {rsc.count}</p>
                      );
                    })}*/}
                  {/*<Typography gutterBottom>
                    Enter information from query about graph strucutre
                  </Typography>*/}
                </DialogContent>
              </Dialog>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default GraphSummaryDialog;
