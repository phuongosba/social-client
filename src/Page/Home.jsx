import React, { useEffect, useState } from "react";

import { Grid, makeStyles } from "@material-ui/core";

import Leftbar from "../components/Leftbar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";
import Navbar from "../components/Navbar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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
export default function Home({ socket }) {
  const classes = useStyles();
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (msg) => {
        setMessage(msg);
        console.log(message);
        setOpen(true);
      });
    }
  });
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item md={2} className={classes.right}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} md={7} xs={12} className={classes.contentpad}>
          <Feed />
        </Grid>
        <Grid item md={3} className={classes.right}>
          <Rightbar />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Link to={message.url}>
          <Alert
            onClose={() => {
              setOpen(false);
            }}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message.name} vừa đăng thông báo "{message.title}"
          </Alert>
        </Link>
      </Snackbar>
      {message ? (
        <Link to={message.url}>
          <Alert severity="success">
            {message.name} vừa đăng thông báo "{message.title}"
          </Alert>
        </Link>
      ) : (
        <></>
      )}
    </>
  );
}
