import {
  Avatar,
  Button,
  makeStyles,
  TextareaAutosize,
} from "@material-ui/core";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  cmt_container: {
    paddingTop: "10px",
    paddingRight: "10px",
    paddingLeft: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    justifyContent: "flex-start",
  },
  cmt_text: {
    padding: " 5px 10px",
    backgroundColor: "#e0e0e0",
    borderRadius: "16px",
    marginLeft: "1rem",
  },
  cmt_textName: {
    fontSize: "0.8rem",
  },
  icon_button: {
    borderRadius: "50%",
    padding: "5px !important",
  },
  readMore: {
    fontWeight: "600",
    cursor: "pointer",
  },
  form_cmt: {
    backgroundColor: "#e0e0e0",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#eceff1",
    },
    width: "80%",
    marginLeft: "1rem",
  },

  button_cmt: {
    borderRadius: "16px",
    backgroundColor: "#757575",

    color: "white",
    fontWeight: "600",
    "&:hover": { backgroundColor: "#18478b" },
  },
  textArea: {
    width: "100%",
    backgroundColor: "transparent",
    padding: "5px",
    resize: "none",
  },
  menuItem: {
    display: "block",
    margin: "0 auto",
    padding: "5px",
    textAlign: "center",
  },
}));

export default function Comment({ cmt, deleteComment }) {
  const classes = useStyles();
  const [readMore, setReadMore] = useState(false);
  const { user, token } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open_menu = Boolean(anchorEl);
  const [onEdit, setOnEdit] = useState(false);
  const [content, setContent] = useState(cmt.content);
  const desc = useRef();
  const [userCmt, setUserCmt] = useState({});
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const Edit_cmt = (e) => {
    setOnEdit(true);

    setAnchorEl(null);
  };
  const URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const ourRequest = axios.CancelToken.source(); //1st step
    const fetchUser = async () => {
      const res = await axios.get(
        `${URL}/api/users/${cmt.userId}`,
        {
          headers: { "x-access-token": token },
        },
        {
          cancelToken: ourRequest.token, //2nd step
        }
      );
      setUserCmt(res.data);
    };
    fetchUser();
    return () => {
      ourRequest.cancel("cancel by user"); //3rd step
    };
  }, [cmt.userId]);
  const handleDelete = async (e) => {
    e.preventDefault();
    var config = {
      method: "delete",
      url: `${URL}/api/comments/${cmt._id}`,
      headers: {
        "x-access-token": token,
      },
      data: {
        userId: user._id,
      },
    };
    await axios(config)
      .then(function (res) {
        handleClose();
        deleteComment(cmt._id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const newComment = {
        userId: user._id,
        content: desc.current.value,
      };
      await axios.put(`${URL}/api/comments/${cmt._id}`, newComment, {
        headers: { "x-access-token": token },
      });
      setContent(desc.current.value);
      setOnEdit(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={classes.cmt_container}>
      <Link to="/">
        <Avatar alt="" src={userCmt.profilePicture} className={classes.image} />
      </Link>
      {onEdit ? (
        <form className={classes.form_cmt}>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Empty"
            defaultValue={content}
            className={classes.textArea}
            ref={desc}
          />
          <button className={classes.button_cmt} onClick={handleEdit}>
            Đăng
          </button>
        </form>
      ) : (
        <div className={classes.cmt_text}>
          <h6 className={classes.cmt_textName}>{userCmt.name}</h6>
          <span className={classes.cmt_textContent}>
            {content.length < 100
              ? content
              : readMore
              ? content + " "
              : content.slice(0, 100) + "...."}
          </span>
          {content.length > 100 && (
            <span
              className={classes.readMore}
              onClick={() => setReadMore(!readMore)}
            >
              {readMore ? "Hide content" : "Read more"}
            </span>
          )}
        </div>
      )}
      {user._id === userCmt._id && (
        <div>
          <Button
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open_menu ? "true" : undefined}
            onClick={handleClick}
            className={classes.icon_button}
          >
            <MoreHorizIcon className={classes.icon} />
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
            <MenuItem className={classes.menuItem} onClick={handleDelete}>
              Xóa bình luận
            </MenuItem>
            <MenuItem onClick={(e) => Edit_cmt(e)} className={classes.menuItem}>
              Sửa bình luận
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}
