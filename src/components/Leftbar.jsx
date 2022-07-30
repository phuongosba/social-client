import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  makeStyles,
  Typography,
  Box,
  Divider,
  Avatar,
} from "@material-ui/core";
import { AuthContext } from "../Context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ListIcon from "@mui/icons-material/List";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    color: "white",
    paddingTop: theme.spacing(10),
    backgroundColor: "#18478b",
    position: "sticky",
    top: 0,
    [theme.breakpoints.up("sm")]: {
      backgroundColor: "white",
      color: "#555",
    },
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  title_text: {
    fontWeight: "600",
    color: "black",
    fontSize: "0.85rem",
    textAlign: "left",
  },
  item: {
    display: "flex",
    alignItems: "center",
    with: "100%",
    color: "#555",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(2),
      cursor: "pointer",
    },
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderRadius: "1rem",
    "&:hover": {
      color: "#40c4ff",
    },
  },
  icon: {
    [theme.breakpoints.up("sm")]: {
      marginRight: "0 !important",
      marginLeft: "0 !important",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "auto",
      marginLeft: "auto",
    },
  },
  text: {
    fontSize: "1rem",
    fontWeight: "500",
    marginLeft: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: "block !important",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none ",
    },
  },
}));

export default function Leftbar() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  return (
    <Container className={classes.container}>
      <Link to={`/profile/${user.username}`}>
        <Box textAlign="center" p={2} className={classes.title}>
          <Avatar alt="" src={user.profilePicture} className={classes.image} />
          <span className={classes.title_text}>{user.name}</span>
        </Box>
      </Link>
      <Divider />
      <Link to="/">
        <div className={classes.item}>
          <HomeIcon className={classes.icon} />
          <Typography variant="body1" className={classes.text}>
            Trang chủ
          </Typography>
        </div>
      </Link>

      <Link to="/notification">
        <div className={classes.item}>
          <ListIcon className={classes.icon} />
          <Typography variant="body1" className={classes.text}>
            Thông báo{" "}
          </Typography>
        </div>
      </Link>
      {user.authorize === 1 && (
        <Link to="/dashboard">
          <div className={classes.item}>
            <AdminPanelSettingsIcon className={classes.icon} />
            <Typography variant="body1" className={classes.text}>
              Quản trị
            </Typography>
          </div>
        </Link>
      )}
      {user.authorize === 2 && (
        <Link to="/falcuty">
          <div className={classes.item}>
            <ManageAccountsIcon className={classes.icon} />
            <Typography variant="body1" className={classes.text}>
              Quản lý
            </Typography>
          </div>
        </Link>
      )}
    </Container>
  );
}
