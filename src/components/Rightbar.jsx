import React, { useContext, useEffect, useState } from "react";
import { Avatar, Container, makeStyles, Typography } from "@material-ui/core";
import "../css/Rightbar.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import parse from "html-react-parser";
import ItemNoti from "./ItemNoti";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    top: "0",
    height: "100vh",
    position: "sticky",
  },

  rightBarFriendInfo: {
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
  },
  image: {
    marginRight: theme.spacing(1),
  },
  rightBarWrapper: {
    paddingLeft: theme.spacing(11),
  },

  rightbarList: {
    padding: "0",
    margin: "0",
    position: "sticky",
    maxHeight: "50vh",
    top: "0",
    overflowY: "scroll",
    listStyle: "none",
  },
  rightBarNoti: {
    "&:nth-child(odd)": {
      borderLeft: "5px solid #99dfff",
      backgroundColor: "#e1f5fe",
    },
    "&:nth-child(even)": {
      borderLeft: "5px solid #9e9e9e",
      backgroundColor: "#eeeeee",
    },
  },
  textTitle: {
    textOverflow: " ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontWeight: "600",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& a": {
      fontStyle: "italic",
      fontSize: "0.75rem",
    },
  },
}));

export default function Rightbar() {
  const classes = useStyles();
  const { token } = useContext(AuthContext);
  const [newNotification, setNewNotification] = useState([]);
  const URL = process.env.REACT_APP_API_URL;
  const fetchNotification = async () => {
    try {
      const res = await axios.get(`${URL}/api/notifications/?page=10`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = res.data;
      setNewNotification(data);
    } catch (err) {
      console.log("Requet cancel", err.message);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <Container className={classes.container}>
      <div className={classes.rightBarWrapper}>
        <div className={classes.headerContainer}>
          <Typography variant="h6">Thông báo</Typography>
          <Link to="/notification">Xem tất cả</Link>
        </div>

        <ul className={classes.rightbarList}>
          {newNotification.map((noti) => (
            <li key={noti._id} className={classes.rightBarNoti}>
              <Link to={`/notification/noti/${noti.slug}`}>
                <ItemNoti key={noti._id} noti={noti} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
