import {
  AppBar,
  InputBase,
  makeStyles,
  Toolbar,
  Typography,
  alpha,
  Badge,
  Avatar,
} from "@material-ui/core";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Block, Cancel, NightsStay } from "@material-ui/icons";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import Drawer from "./Drawer";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import "../css/ProfileRight.css";
import io from "socket.io-client";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { display } from "@mui/system";
const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#18478b",
  },
  logoLg: {
    display: "none",
    color: "white",
    [theme.breakpoints.up("md")]: {
      display: "block",
    },
  },
  logoSm: {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  search: {
    display: "flex",
    alignItems: "center",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      display: "flex !important",
    },
    [theme.breakpoints.down("sm")]: {
      display: (props) => (props.open ? "flex" : "none"),
    },
  },
  input: {
    color: "white",
    marginLeft: theme.spacing(1),
  },
  cancel: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  searchButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
  icons: {
    alignItems: "center",
    display: (props) => (props.open ? "none" : "flex"),
  },
  icon: {
    color: "white",
    cursor: "pointer",
    "&:hover": {
      color: "#40c4ff",
    },
  },
  badge: {
    marginRight: theme.spacing(2),
  },

  logoSm_Text: {
    color: "white",
  },
  subMenu: {
    display: "block",
  },
  btn_cancel: {
    color: "red !important",
  },
  btn_edit: {
    color: "#03a9f4",
  },
  menuItem: {
    display: "block",
    margin: "0 auto",
    padding: "5px",
    textAlign: "center",
  },
  link: {
    "&:hover": {
      color: "white",
    },
  },
  searchContainer: {
    width: "30%",
    position: "relative",
  },
  listContainer: {
    width: "100%",
    display: "block",
    background: "white",
    color: "black",
    position: "absolute",
    boxShadow:
      " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
    "& ul": {
      paddingLeft: "0 !important",
    },
    "& li": {
      marginLeft: "10px",
      marginRight: "10px",
      marginTop: "10px",
      display: "flex",
      padding: "10px",
      fontSize: "1.25rem",
      gap: "10px",
      fontWeight: "bold",
      color: "black",
      "&:hover": {
        backgroundColor: "#eeeeee",
        borderRadius: "16px",
      },
    },
  },
}));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const classes = useStyles({ open });
  const { token, user } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [listUser, setListUser] = useState([]);
  //Socket thông báo
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = React.useState("");
  const [openNotifiAlert, setOpenNotifiAlert] = React.useState(false);
  const URL = process.env.REACT_APP_API_URL;
  const [searchText, setSearchText] = useState("");
  const setupSocket = () => {
    if (!socket && token && user) {
      const newSocket = io(`${URL}`, {
        query: { token },
        transports: ["websocket"],
      });
      newSocket.on("connect", () => {
        console.log("Connected");
      });
      newSocket.on("disconect", () => {
        setSocket(null);
      });
      setSocket(newSocket);
    }
  };
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${URL}/api/users`, {
        headers: { "x-access-token": token },
      });
      const data = res.data;
      setListUser(data);
    } catch (err) {
      console.log("Requet cancel", err.message);
    }
  };

  useEffect(() => {
    setupSocket();
    fetchUser();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (msg) => {
        setMessage(msg);

        setOpenNotifiAlert(true);
      });
    }
  });

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Đăng nhập
  const open_menu = Boolean(anchorEl);
  const password = useRef();
  const reNewPassword = useRef();
  const newPassword = useRef();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //modal doi mk
  const [openPass, setOpenPass] = useState(false);

  const handleOpenPass = () => {
    setOpenPass(true);
    setAnchorEl(null);
  };

  const handleClosePass = () => {
    setOpenPass(false);
    setAnchorEl(null);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.current.value !== reNewPassword.current.value) {
      setError("Nhập lại mật khẩu không trùng khớp");
    } else if (newPassword.current.value.length < 6) {
      setError("Độ dài mật khẩu mới phải hơn 6");
    } else {
      try {
        const newUser = {
          password: password.current.value,
          newPassword: newPassword.current.value,
        };

        await axios.put(`/users/${user._id}`, newUser, {
          headers: { "x-access-token": token },
        });
        setSuccess(true);
        setTimeout(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.reload();
        }, 2000);
      } catch (err) {
        setError("Sai mật khẩu");
        console.log(err);
      }
    }
  };
  //end modal doi mk
  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
    setAnchorEl(null);
  };
  const params = useParams();
  const handleTop = () => {
    if (window.location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Link to="/" className={classes.logoLg}>
            <Typography
              variant="h6"
              onClick={handleTop}
              className={classes.link}
            >
              US Social
            </Typography>
          </Link>
          <div className={classes.logoSm}>
            <Drawer />
            <Link to="/">
              <Typography variant="h6" className={classes.logoSm_Text}>
                META
              </Typography>
            </Link>
          </div>
          <div className={classes.searchContainer}>
            <div className={classes.search}>
              <SearchIcon />
              <InputBase
                placeholder="Tìm kiếm...."
                className={classes.input}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Cancel
                className={classes.cancel}
                onClick={() => setOpen(false)}
              />
            </div>
            {searchText !== "" && (
              <div className={classes.listContainer}>
                <ul>
                  {listUser
                    .filter((user) =>
                      user.name.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .map((user) => (
                      <Link key={user._id} to={`/profile/${user.username}`}>
                        <li>
                          <Avatar
                            alt=""
                            src={user.profilePicture}
                            className={classes.image}
                          />
                          <span>{user.name}</span>
                        </li>
                      </Link>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <div className={classes.icons}>
            <SearchIcon
              className={classes.searchButton}
              onClick={() => setOpen(true)}
            />

            <Link to={`/profile/${user.username}`}>
              <Avatar
                alt=""
                src={user.profilePicture}
                className={classes.image}
              />
            </Link>
            <div>
              <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open_menu ? "true" : undefined}
                onClick={handleClick}
              >
                <ArrowDropDownCircleIcon className={classes.icon} />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open_menu}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                className={classes.subMenu}
              >
                <MenuItem onClick={handleOpenPass} className={classes.menuItem}>
                  Đổi mật khẩu
                </MenuItem>
                <MenuItem onClick={Logout} className={classes.menuItem}>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </div>
          </div>

          <Dialog open={openPass} onClose={handleClosePass}>
            <DialogTitle>Đổi mật khẩu</DialogTitle>

            <DialogContent>
              {error ? <span className="error">{error}</span> : <span></span>}
              {success ? (
                <div className="success_container">
                  <span className="success">Đổi mật khẩu thành công</span>
                  <span className="success_sub">Vui lòng đăng nhập lại</span>
                  <CircularProgress color="inherit" className="icon_loading" />
                </div>
              ) : (
                <form className="form_update_info">
                  <div className="form_update_info-item">
                    <label htmlFor="fname" className="form_update_info-label">
                      Mật khẩu:
                    </label>
                    <input
                      aria-label=""
                      className="form_update_info-input"
                      type="password"
                      ref={password}
                      onClick={(e) => setError("")}
                    />
                  </div>
                  <div className="form_update_info-item">
                    <label htmlFor="fname" className="form_update_info-label">
                      Mật khẩu mới:
                    </label>
                    <input
                      aria-label=""
                      type="password"
                      className="form_update_info-input"
                      ref={newPassword}
                      onClick={(e) => setError("")}
                    />
                  </div>
                  <div>
                    <label htmlFor="fname" className="form_update_info-label">
                      Nhập lại mật khẩu mới:
                    </label>
                    <input
                      aria-label=""
                      className="form_update_info-input"
                      type="password"
                      ref={reNewPassword}
                      onClick={(e) => setError("")}
                    />
                  </div>
                </form>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePass} className={classes.btn_cancel}>
                Hủy
              </Button>
              <Button
                onClick={(e) => updatePassword(e)}
                className={classes.btn_edit}
              >
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={openNotifiAlert}
        autoHideDuration={6000}
        onClose={() => {
          setOpenNotifiAlert(false);
        }}
      >
        <a href={message.url}>
          <Alert
            onClose={() => {
              setOpenNotifiAlert(false);
            }}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message.name} vừa đăng thông báo "{message.title}"
          </Alert>
        </a>
      </Snackbar>
      {message ? (
        <a href={message.url}>
          <Alert severity="success">
            {message.name} vừa đăng thông báo "{message.title}"
          </Alert>
        </a>
      ) : (
        <></>
      )}
    </>
  );
}
