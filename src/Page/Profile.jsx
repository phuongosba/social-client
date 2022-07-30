import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";
import ProfileImage from "../components/ProfileImage";
import Feed from "../components/Feed";
import ProfileRight from "../components/ProfileRight";
import Leftbar from "../components/Leftbar";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context/AuthContext";
import { SettingsRemoteOutlined } from "@material-ui/icons";
import ErrorPage from "../components/ErrorPage";
const useStyles = makeStyles((theme) => ({
  profileContainer: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    paddingTop: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  profileRight: {
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
  profileLeft: {
    order: "1/2",
    [theme.breakpoints.down("sm")]: {
      order: "3",
    },
  },
  right: {
    [theme.breakpoints.between("xs", "sm")]: {
      display: "none",
    },
  },
}));
export default function Profile() {
  const classes = useStyles();
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState({});
  const username = useParams().username;
  const [error, setError] = useState(false);
  const URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${URL}/api/users/profile/${username}`, {
          headers: { "x-access-token": token },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [username]);

  const isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item md={2} className={classes.right}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} md={10} xs={12}>
          {isEmpty(user) ? (
            <div className={classes.profile}>
              <ErrorPage string={"Người dùng không tồn tại"} />
            </div>
          ) : (
            <div className={classes.profile}>
              <ProfileImage user={user} changeUser={(user) => setUser(user)} />
              <div className={classes.profileContainer}>
                <div className={classes.profileRight}>
                  <ProfileRight
                    key={user._id}
                    user={user}
                    changeUser={(user) => setUser(user)}
                  />
                </div>
                <div className={classes.profileLeft}>
                  <Feed userId={user._id} />
                </div>
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}
