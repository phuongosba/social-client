import React, { useContext, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Divider,
  makeStyles,
  Typography,
  TextareaAutosize,
} from "@material-ui/core";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import { CircularProgress } from "@mui/material";
const useStyles = makeStyles((theme) => ({
  share: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    "-webkit-box-shadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
    boxShadow: " 0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
  },
  shareWrapper: {
    padding: "10px",
  },
  shareTop: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    marginRight: "10px",
  },
  shareInput: {
    border: "none",
    width: "100%",
    resize: "none",
    color: "black",
    "&:focus": {
      outLine: "none",
    },
  },
  divider: {
    margin: "1.25rem",
  },
  shareBottom: {
    display: " flex",
    alignItems: "center",
    justifyContent: " space-between",
  },
  shareOptions: {
    display: "flex",

    marginLeft: "1.25rem",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  shareOption: {
    display: "flex",
    alignItems: "center",
    marginRight: "1rem",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
    },
  },
  shareIcon: {
    fontSize: "1rem",
    marginRight: "3px",
  },
  shareOptionText: {
    fontSize: "14px",
    fontWeight: "700",
  },
  shareButton: {
    border: "none",
    padding: "7px",
    borderRadius: "5px",
    backgroundColor: "green",
    fontWeight: "500",
    marginRight: "20px",
    cursor: "pointer",
    color: " white",
    "&:hover": {
      backgroundColor: theme.palette.success.light,
    },
  },
  shareImgContainer: {
    padding: "0 20px 10px 20px",
    position: "relative",
  },

  shareImg: {
    width: "100%",
    objectFit: "cover",
  },

  shareCancelImg: {
    position: "absolute",
    top: "0",
    right: "20px",
    cursor: "pointer",
    opacity: "0.7",
    color: "red",
  },
  shareVideo: {
    borderBottom: "1px solid black",
  },
}));

export default function Share({ addPost }) {
  const classes = useStyles();
  const { token, user } = useContext(AuthContext);

  const desc = useRef();
  const videoLink = useRef();
  const [file, setFile] = useState(null);
  const URL_API = process.env.REACT_APP_API_URL;
  const [progress, setProgress] = useState(false);

  const uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) resolve("");
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (err) => {
          console.log(err);
          reject();
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setProgress(true);
      const link = await uploadFiles(file);
      if (
        link === "" &&
        desc.current.value === "" &&
        videoLink.current.value === ""
      ) {
        return null;
      } else {
        if (
          videoLink.current.value === "" ||
          videoLink.current.value.includes("https://www.youtube.com/watch?v=")
        ) {
          const newPost = {
            userId: user._id,
            desc: desc.current.value,
            img: link,
            video: videoLink.current.value.replace(
              "https://www.youtube.com/watch?v=",
              "https://www.youtube.com/embed/"
            ),
            likes: [],
          };
          await axios.post(`${URL_API}/api/posts`, newPost, {
            headers: { "x-access-token": token },
          });
          addPost(newPost);
          desc.current.value = "";
          setFile(null);
          videoLink.current.value = "";
          setProgress(false);
        } else {
          alert("Link không hợp lệ vui lòng nhập lại");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container className={classes.share}>
      <div className={classes.shareWrapper}>
        <div className={classes.shareTop}>
          <Avatar alt="" src={user.profilePicture} className={classes.image} />

          <TextareaAutosize
            placeholder={"What's new, " + user.name + "?"}
            className={classes.shareInput}
            ref={desc}
          />
        </div>

        <Divider className={classes.divider} />

        {file && (
          <div className={classes.shareImgContainer}>
            <img
              className={classes.shareImg}
              src={URL.createObjectURL(file)}
              alt=""
            />
            <CloseIcon
              className={classes.shareCancelImg}
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className={classes.shareBottom} onSubmit={submitHandler}>
          <div className={classes.shareOptions}>
            <label htmlFor="file_img" className={classes.shareOption}>
              <PermMediaIcon htmlColor="green" className={classes.shareIcon} />
              <Typography variant="body1" className={classes.shareOptionText}>
                Image
              </Typography>
              <input
                type="file"
                id="file_img"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            <div className={classes.shareOption}>
              <input
                placeholder="Link video"
                type="text"
                className={classes.shareVideo}
                id="file_img"
                ref={videoLink}
              />
            </div>
          </div>

          <Button type="submit" className={classes.shareButton}>
            {progress ? <CircularProgress color="inherit" /> : "Đăng bài"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
