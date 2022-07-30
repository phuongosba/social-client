import React, { useContext, useEffect, useState } from "react";

import { Grid, makeStyles } from "@material-ui/core";

import HomeIcon from "@mui/icons-material/Home";
import Leftbar from "../components/Leftbar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import parse from "html-react-parser";
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.between("xs", "sm")]: {
      display: "none",
    },
  },
  contentpad: {
    paddingTop: theme.spacing(10),
  },
  title: {
    textAlign: "center",
    color: "#5b91e5",
    fontSize: "30px",
  },
  subtitle: {
    color: "#9e9e9e",
    textAlign: "right",
    margin: "20px",
    fontWeight: "300",
    fontSize: "16px",
    fontStyle: "italic",
  },
  notes: {
    textAlign: "center",
    fontWeight: 600,

    color: "#f08080",
  },

  contentContainer: {
    margin: "20px",
    width: "100%",
    backgroundColor: "transparent",
    color: "black",
    fontSize: "1.5rem",
    resize: "none",
  },
}));
export default function NotificationDetail() {
  const classes = useStyles();
  const { token } = useContext(AuthContext);
  const [noti, setNoti] = useState({});
  const [cate, setCate] = useState({});
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const slugNoti = useParams().slug;

  const URL = process.env.REACT_APP_API_URL;
  const fecthNoti = async () => {
    try {
      const res = await axios.get(`${URL}/api/notifications/${slugNoti}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.data;
      setNoti(data.notifications);
      setCate(data.cate);
      setContent(parse(data.notifications.content));
      setDate(data.notifications.createdAt.slice(0, 10));
    } catch (err) {
      setContent(parse("<p>Thông báo không tồn tại<p>"));
    }
  };
  useEffect(() => {
    fecthNoti();
    console.log(noti);
  }, [slugNoti]);
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item md={2} className={classes.right}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} md={10} xs={12} className={classes.contentpad}>
          <div className="category-name blue ">
            <span>Chi tiết thông báo</span>
          </div>
          <div>
            <h2 className={classes.title}>{noti.title}</h2>
          </div>
          <div>
            <h5 className={classes.subtitle}>
              <Link to={`/notification/${cate.slug}`}>{cate.name} </Link>||
              {date}
            </h5>
          </div>
          <div>
            <h2 className={classes.notes}>Thông báo</h2>
          </div>
          <div className={classes.contentContainer}>{content}</div>
        </Grid>
      </Grid>
    </>
  );
}
