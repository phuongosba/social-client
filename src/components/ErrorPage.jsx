import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import "../css/ErrorPage.css";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.between("xs", "sm")]: {
      display: "none",
    },
  },
  contentpad: {
    paddingTop: theme.spacing(10),
    width: "100%",
    height: "calc(100% - 80px)",
  },
  error: {},
}));
export default function ErrorPage({ string }) {
  const classes = useStyles();

  return (
    <div className={classes.contentpad}>
      <h1>{string}</h1>

      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <Link to="/" className="more-link ">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
