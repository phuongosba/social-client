import React from "react";

import { Grid, makeStyles } from "@material-ui/core";

import HomeIcon from "@mui/icons-material/Home";
import Leftbar from "../components/Leftbar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";
import Navbar from "../components/Navbar";
import CateNoti from "../components/CateNotis/CateNoti";
import ListNotis from "../components/ListNotis/ListNotis";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.between("xs", "sm")]: {
      display: "none",
    },
  },
  contentpad: {
    paddingTop: theme.spacing(10),
  },
}));
export default function ListNotification() {
  const classes = useStyles();
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item md={2} className={classes.right}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} md={10} xs={12} className={classes.contentpad}>
          <ListNotis />
        </Grid>
      </Grid>
    </>
  );
}
