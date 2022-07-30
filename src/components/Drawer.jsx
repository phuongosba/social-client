import React, { useContext, useState } from "react";
import {
  Box,
  SwipeableDrawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  IconButton,
  makeStyles,
  ListItemIcon,
  Avatar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ListIcon from "@mui/icons-material/List";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
const useStyles = makeStyles({
  list: {
    width: "250px",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  title_text: {
    fontWeight: "600",
    color: "black",
  },
  listItem: {
    color: "#555",
    "&:hover": {
      backgroundColor: "#efefef",
      borderRadius: "10px",
    },
  },
  listItemText: {
    fontWeight: "600",
  },
});
export default function Drawer() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => {
          setOpen(true);
        }}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {}}
      >
        <div className={classes.list}>
          <Link to={`/profile/${user.username}`}>
            <Box textAlign="center" p={2} className={classes.title}>
              <Avatar
                alt=""
                src={user.profilePicture}
                className={classes.image}
              />
              <span className={classes.title_text}>{user.name}</span>
            </Box>
          </Link>
          <Divider />
          <List>
            <Link to="/">
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <HomeIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      className={classes.listItemText}
                    >
                      Trang chủ
                    </Typography>
                  }
                  className={classes.listItemText}
                />
              </ListItem>
            </Link>

            <Link to="/notification">
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <ListIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      className={classes.listItemText}
                    >
                      Thông báo
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            {user.authorize === 1 && (
              <Link to="/dashboard">
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        className={classes.listItemText}
                      >
                        Quản trị
                      </Typography>
                    }
                  />
                </ListItem>
              </Link>
            )}
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}
