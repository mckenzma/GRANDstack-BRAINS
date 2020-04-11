<<<<<<< HEAD
// <<<<<<< HEAD
import React, { useState } from "react";

import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
// =======
// import React from "react";

// import { Query } from "react-apollo";
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
import React from "react";

import { Query } from "react-apollo";
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
import gql from "graphql-tag";

import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

<<<<<<< HEAD
// <<<<<<< HEAD
const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
  // =======
  // const styles = theme => ({
  // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
const styles = theme => ({
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(0.25)
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
<<<<<<< HEAD
  // // <<<<<<< HEAD
  // // });
}));

const GET_OWNERS = gql`
  {
    Entity {
      #id
      code
      description
    }
  }
`;

export default function OwnerFilter({ selectedOwners, setSelectedOwners }) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_OWNERS);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("description");

  // const [owner, setOwner] = useState(null);
  const [description, setDescription] = useState(null);

  const [state, setState] = useState(null);

  const [selected, setSelected] = useState("");
  const [numSelected, setNumSelected] = useState(0);
  const [numSelectedOwners, setNumSelectedOwners] = useState(
    selectedOwners.length
  );

  const handleChange = description => event => {
    setState({ ...state, [description]: event.target.checked });
  };

  const handleClick = (event, description) => {
    setSelected(selectedOwners);
    const selectedIndex = selectedOwners.indexOf(description);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedOwners, description);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedOwners.slice(1));
    } else if (selectedIndex === selectedOwners.length - 1) {
      newSelected = newSelected.concat(selectedOwners.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedOwners.slice(0, selectedIndex),
        selectedOwners.slice(selectedIndex + 1)
      );
    }

    setSelectedOwners(selectedOwners.sort());
    setNumSelectedOwners(newSelected.length);
  };

  const handleSelectAllClick = (event, data) => {
    // =======
    // });

    // function getSorting(order, orderBy) {
    //   return order === "desc"
    //     ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    //     : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    // }

    // class OwnerFilter extends React.Component {
    //   constructor(props) {
    //     super(props);

    //     this.state = {
    //       order: "asc", // sets order of descriptions to be listed in the menu
    //       orderBy: "description",
    //       ownerSelected: this.props.ownerSelected,
    //       numOwnerSelected: this.props.numOwnerSelected
    //     };
    //   }

    //   handleChange = description => event => {
    //     this.setState({ selectedValue: event.target.value });
    //   };

    //   handleClick = (event, description) => {
    //     const { ownerSelected } = this.state;
    //     const selectedIndex = ownerSelected.indexOf(description);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //       newSelected = newSelected.concat(ownerSelected, description);
    //     } else if (selectedIndex === 0) {
    //       newSelected = newSelected.concat(ownerSelected.slice(1));
    //     } else if (selectedIndex === ownerSelected.length - 1) {
    //       newSelected = newSelected.concat(ownerSelected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //       newSelected = newSelected.concat(
    //         ownerSelected.slice(0, selectedIndex),
    //         ownerSelected.slice(selectedIndex + 1)
    //       );
    //     }

    //     this.setState({ ownerSelected: newSelected.sort() });
    //     this.setState({ numOwnerSelected: newSelected.length });
    //     this.props.triggerParentUpdate("ownerSelected", newSelected);
    //     this.props.triggerParentUpdate("numOwnerSelected", newSelected.length);
    //   };

    // handleSelectAllClick = (event, data) => {
    // >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
});

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class OwnerFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of descriptions to be listed in the menu
      orderBy: "description",
      ownerSelected: this.props.ownerSelected,
      numOwnerSelected: this.props.numOwnerSelected
    };
  }

  handleChange = description => event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleClick = (event, description) => {
    const { ownerSelected } = this.state;
    const selectedIndex = ownerSelected.indexOf(description);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(ownerSelected, description);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(ownerSelected.slice(1));
    } else if (selectedIndex === ownerSelected.length - 1) {
      newSelected = newSelected.concat(ownerSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        ownerSelected.slice(0, selectedIndex),
        ownerSelected.slice(selectedIndex + 1)
      );
    }

    this.setState({ ownerSelected: newSelected.sort() });
    this.setState({ numOwnerSelected: newSelected.length });
    this.props.triggerParentUpdate("ownerSelected", newSelected);
    this.props.triggerParentUpdate("numOwnerSelected", newSelected.length);
  };

  handleSelectAllClick = (event, data) => {
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.description);
<<<<<<< HEAD
      // <<<<<<< HEAD
      setSelectedOwners(newSelected.sort());
      setNumSelectedOwners(rowCount);
      return;
    }
    setSelectedOwners([]);
    setNumSelected(0);
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // const rowOwnerCount = Object.keys(data.Owner).length;
  const rowCount = Object.keys(data.Entity).length;

  return (
    // <div className={classes.root}>
    <FormControl className={classes.formControl}>
      <InputLabel>Owners</InputLabel>
      <Select
        multiple
        value={selectedOwners}
        renderValue={selectedOwners => (
          <div className={classes.chips}>
            {selectedOwners.map(value => (
              <Chip key={value} label={value} />
            ))}
          </div>
        )}
      >
        <MenuItem>
          <Checkbox
            // disabled
            indeterminate={
              numSelectedOwners > 0 && numSelectedOwners < rowCount
            }
            checked={numSelectedOwners === rowCount}
            onChange={event => handleSelectAllClick(event, Object(data.Entity))}
          />
          <ListItemText>Select All</ListItemText>
        </MenuItem>
        <Divider />
        {data.Entity.slice()
          .sort(getSorting(order, orderBy))
          .map(n => {
            // const isOwnerSelected = this.isOwnerSelected(
            //   n.description
            // );
            return (
              <MenuItem
                key={n.code + "_" + n.description}
                value={n.description}
              >
                {/*<MenuItem key={n.description}>*/}
                <Checkbox
                  checked={selectedOwners.indexOf(n.description) !== -1}
                  onChange={handleChange(n.description)}
                  value={n.description}
                  // selected={isOwnerSelected} // is this actually needed? - test removal
                  onClick={event => handleClick(event, n.description)}
                />
                <ListItemText>{n.description}</ListItemText>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}
// =======
//       this.setState({ ownerSelected: newSelected.sort() });
//       this.setState(state => ({
//         numOwnerSelected: state.ownerSelected.length
//       }));
//       this.props.triggerParentUpdate(state => ({
//         numOwnerSelected: state.ownerSelected.length
//       }));
//       this.props.triggerParentUpdate("ownerSelected", newSelected);
//       return;
//     }
//     this.setState({ ownerSelected: [] });
//     this.setState(state => ({
//       numOwnerSelected: state.ownerSelected.length
//     }));
//     this.props.triggerParentUpdate(state => ({
//       ownerSelected: state.ownerSelected
//     }));
//   };

//   isOwnerSelected = description =>
//     this.state.ownerSelected.indexOf(description) !== -1;

//   render() {
//     const { order, orderBy } = this.state;

//     const { numOwnerSelected } = this.state;

//     const { classes } = this.props;

//     return (
//       <Query
//         query={gql`
//           {
//             Owner {
//               id
//               description
//             }
//           }
//         `}
//       >
//         {({ loading, error, data }) => {
//           if (loading) return <p>Loading...</p>;
//           if (error) return <p>Error</p>;

//           const rowOwnerCount = Object.keys(data.Owner).length;

//           return (
//             <div className={classes.root}>
//               <FormControl className={classes.formControl}>
//                 <InputLabel>Owner</InputLabel>
//                 <Select
//                   multiple
//                   value={this.state.ownerSelected}
//                   renderValue={ownerSelected => (
//                     <div className={classes.chips}>
//                       {this.state.ownerSelected.map(value => (
//                         <Chip key={value} label={value} />
//                       ))}
//                     </div>
//                   )}
//                 >
//                   <MenuItem>
//                     <Checkbox
//                       // disabled
//                       indeterminate={
//                         numOwnerSelected > 0 && numOwnerSelected < rowOwnerCount
//                       }
//                       checked={numOwnerSelected === rowOwnerCount}
//                       onChange={event =>
//                         this.handleSelectAllClick(event, Object(data.Owner))
//                       }
//                     />
//                     <ListItemText>Select All</ListItemText>
//                   </MenuItem>
//                   <Divider />
//                   {data.Owner.slice()
//                     .sort(getSorting(order, orderBy))
//                     .map(n => {
//                       const isOwnerSelected = this.isOwnerSelected(
//                         n.description
//                       );
//                       return (
//                         <MenuItem key={n.description}>
//                           <Checkbox
//                             checked={isOwnerSelected}
//                             onChange={this.handleChange(n.description)}
//                             value={n.description}
//                             selected={isOwnerSelected} // is this actually needed? - test removal
//                             onClick={event =>
//                               this.handleClick(event, n.description)
//                             }
//                           />
//                           <ListItemText>{n.description}</ListItemText>
//                         </MenuItem>
//                       );
//                     })}
//                 </Select>
//               </FormControl>
//             </div>
//           );
//         }}
//       </Query>
//     );
//   }
// }

// OwnerFilter.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(OwnerFilter);
// >>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
=======
      this.setState({ ownerSelected: newSelected.sort() });
      this.setState(state => ({
        numOwnerSelected: state.ownerSelected.length
      }));
      this.props.triggerParentUpdate(state => ({
        numOwnerSelected: state.ownerSelected.length
      }));
      this.props.triggerParentUpdate("ownerSelected", newSelected);
      return;
    }
    this.setState({ ownerSelected: [] });
    this.setState(state => ({
      numOwnerSelected: state.ownerSelected.length
    }));
    this.props.triggerParentUpdate(state => ({
      ownerSelected: state.ownerSelected
    }));
  };

  isOwnerSelected = description =>
    this.state.ownerSelected.indexOf(description) !== -1;

  render() {
    const { order, orderBy } = this.state;

    const { numOwnerSelected } = this.state;

    const { classes } = this.props;

    return (
      <Query
        query={gql`
          {
            Owner {
              id
              description
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          const rowOwnerCount = Object.keys(data.Owner).length;

          return (
            <div className={classes.root}>
              <FormControl className={classes.formControl}>
                <InputLabel>Owner</InputLabel>
                <Select
                  multiple
                  value={this.state.ownerSelected}
                  renderValue={ownerSelected => (
                    <div className={classes.chips}>
                      {this.state.ownerSelected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem>
                    <Checkbox
                      // disabled
                      indeterminate={
                        numOwnerSelected > 0 && numOwnerSelected < rowOwnerCount
                      }
                      checked={numOwnerSelected === rowOwnerCount}
                      onChange={event =>
                        this.handleSelectAllClick(event, Object(data.Owner))
                      }
                    />
                    <ListItemText>Select All</ListItemText>
                  </MenuItem>
                  <Divider />
                  {data.Owner.slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      const isOwnerSelected = this.isOwnerSelected(
                        n.description
                      );
                      return (
                        <MenuItem key={n.description}>
                          <Checkbox
                            checked={isOwnerSelected}
                            onChange={this.handleChange(n.description)}
                            value={n.description}
                            selected={isOwnerSelected} // is this actually needed? - test removal
                            onClick={event =>
                              this.handleClick(event, n.description)
                            }
                          />
                          <ListItemText>{n.description}</ListItemText>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
          );
        }}
      </Query>
    );
  }
}

OwnerFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(OwnerFilter);
>>>>>>> 53613e45cc5999579bb569b91ca1765e4ce075ea
