import React from "react";

import { Grid, makeStyles } from "@material-ui/core";

import HomeIcon from "@mui/icons-material/Home";
import Leftbar from "../components/Leftbar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";
import Navbar from "../components/Navbar";
import CateNoti from "../components/CateNotis/CateNoti";
import AllNotification from "../components/AllNotification";
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.between("xs", "sm")]: {
      display: "none",
    },
  },
  contentpad: {
    paddingTop: theme.spacing(10),
  },
  notificationContainer: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",

    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  cateNotification: {
    order: "3",
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    [theme.breakpoints.up("sm")]: {
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
    },
    [theme.breakpoints.down("sm")]: {
      order: "2",
    },
  },
  listNotification: {
    order: "1/2",
    [theme.breakpoints.down("sm")]: {
      order: "3",
    },
  },
}));
export default function Notification() {
  const classes = useStyles();
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item md={2} className={classes.right}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} md={10} xs={12} className={classes.contentpad}>
          <div className={classes.notificationContainer}>
            <div className={classes.listNotification}>
              <AllNotification />
            </div>
            <div className={classes.cateNotification}>
              <CateNoti />
            </div>
          </div>
          {/* */}
        </Grid>
      </Grid>
    </>
  );
}
