import React, { useContext, useEffect, useState } from "react";
import { Avatar, Container, makeStyles, Typography } from "@material-ui/core";
import "../css/Rightbar.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    top: "0",
    height: "100vh",
    position: "sticky",
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
    color: "black",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontWeight: "600",
  },
  subtitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "rgb(172, 170, 170)",
    fontSize: "0.75rem",
    fontStyle: "italic",
  },
  link: {
    fontSize: "0.75rem",
    fontStyle: "italic",
  },
}));
export default function ItemNoti({ noti }) {
  const classes = useStyles();
  const [cate, setCate] = useState({});
  const URL = process.env.REACT_APP_API_URL;
  const getCateName = async (id) => {
    const cate = await axios.get(`${URL}/api/admin/categories/${id}`);

    setCate(cate.data);
  };
  useEffect(() => {
    getCateName(noti.categoryId);
  }, []);
  return (
    <div className={classes.rightBarNotiInfo}>
      <Typography variant="body1" className={classes.textTitle}>
        {noti.title}
      </Typography>
      <div className="textContent">{parse(noti.content)}</div>
      <div className={classes.subtitle}>
        <Link to={`/notification/${cate.slug}`} className={classes.link}>
          {cate.name}
        </Link>
        <span className={classes.date}>{noti.createdAt.slice(0, 10)}</span>
      </div>
    </div>
  );
}
