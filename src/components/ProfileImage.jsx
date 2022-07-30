import React, { useState, useContext } from "react";
import { Avatar, Button, makeStyles, Typography } from "@material-ui/core";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import { AuthContext } from "../Context/AuthContext";
import { CircularProgress } from "@mui/material";
const useStyles = makeStyles((theme) => ({
  profileCover: {
    height: "400px",
    position: "relative",
  },

  profileCoverImg: {
    width: " 100%",
    height: "350px",
    objectFit: "cover",
    borderRadius: "0 0 10px 10px",
  },

  profileUserImg: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    position: "absolute",
    left: "0",
    right: "0",
    margin: "auto",
    top: "250px",
    border: "3px solid white",
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfoName: {
    fontSize: "2rem",
  },
  btn_Cover: {
    position: "absolute",
    right: " 0",
    margin: "auto",
    top: "300px",
    backgroundColor: "#e0e0e0",
    "&:hover": {
      backgroundColor: "#bdbdbd",
    },
  },
  btn_Avatar: {
    position: "absolute",
    left: "0",
    right: "0",
    margin: "auto",
    top: "360px",
    borderRadius: "50px",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#bdbdbd",
    },
  },
  shareImgContainer: {
    padding: "0 20px 10px 20px",
    position: "relative",
  },

  shareImg: {
    width: "100%",
    objectFit: "cover",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
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
  shareOption: {
    display: "flex",
    alignItems: "center",
    marginRight: "1rem",
    cursor: "pointer",
  },
  btn_Cancel: {
    color: "red",
  },
  btn_edit: {
    color: "#03a9f4",
  },
  shareOptionText: {
    borderRadius: "10px",
    backgroundColor: "#e0e0e0",
    "&:hover": {
      backgroundColor: "#bdbdbd",
    },
    padding: "5px",
  },
  shareImgCover: {
    width: "100%",
    objectFit: "cover",
    width: " 100%",
    height: "350px",
    objectFit: "cover",
  },
}));
export default function ProfileImage({ user, changeUser }) {
  const classes = useStyles();
  const URL_API = process.env.REACT_APP_API_URL;
  const { token, user: currentUser, dispatch } = useContext(AuthContext);
  // firebase
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
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
          setProgress(prog);
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
  //end firebase
  //modal avatar
  const [openAvt, setOpenAvt] = useState(false);
  const [fileAvt, setFileAvt] = useState(null);
  const handleOpenAvt = () => {
    setOpenAvt(true);
  };

  const handleCloseAvt = () => {
    setOpenAvt(false);
  };
  const submitAvt = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const link = await uploadFiles(fileAvt);
      const newAvt = {
        userId: currentUser._id,
        profilePicture: link,
      };
      await axios.put(`${URL_API}/api/users/${currentUser._id}`, newAvt, {
        headers: { "x-access-token": token },
      });
      await dispatch({ type: "EDIT_AVT", payload: newAvt });
      const res = await axios.get(`${URL_API}/api/users/${currentUser._id}`, {
        headers: { "x-access-token": token },
      });
      changeUser(res.data);
      setLoading(false);

      handleCloseAvt();
    } catch (err) {
      console.log(err);
    }
  };
  //end modal avatar
  //modal cover
  const [openCover, setOpenCover] = useState(false);
  const [fileCover, setFileCover] = useState(null);
  const handleOpenCover = () => {
    setOpenCover(true);
  };

  const handleCloseCover = () => {
    setOpenCover(false);
  };
  const submitCover = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const link = await uploadFiles(fileCover);
      const newCover = {
        userId: currentUser._id,
        coverPicture: link,
      };
      await axios.put(`${URL_API}/api/users/${currentUser._id}`, newCover, {
        headers: { "x-access-token": token },
      });
      const res = await axios.get(`${URL_API}/api/users/${currentUser._id}`, {
        headers: { "x-access-token": token },
      });
      changeUser(res.data);
      setLoading(false);
      handleCloseCover();
    } catch (err) {
      console.log(err);
    }
  };
  //end modal cover
  return (
    <div className={classes.container}>
      <div className={classes.profileCover}>
        <img
          className={classes.profileCoverImg}
          src={
            user.coverPicture
              ? user.coverPicture
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Grey_background.jpg/1200px-Grey_background.jpg"
          }
          alt=""
        />
        {currentUser._id === user._id && (
          <Button className={classes.btn_Cover} onClick={handleOpenCover}>
            Sửa Ảnh bìa
          </Button>
        )}

        <Avatar
          className={classes.profileUserImg}
          alt=""
          src={user.profilePicture ? user.profilePicture : user.profilePicture}
        />
        {currentUser._id === user._id && (
          <Button className={classes.btn_Avatar} onClick={handleOpenAvt}>
            <PhotoCameraIcon />
          </Button>
        )}
      </div>
      <div className={classes.profileInfo}>
        <h4 className={classes.profileInfoName}>{user.name}</h4>
      </div>

      {/* modalAvt */}
      <Dialog open={openAvt} onClose={handleCloseAvt}>
        <DialogTitle>Đổi ảnh đại diện</DialogTitle>
        <DialogContent>
          <form>
            <label htmlFor="file_avt" className={classes.shareOption}>
              <Typography variant="body1" className={classes.shareOptionText}>
                Chọn ảnh
              </Typography>
              <input
                type="file"
                id="file_avt"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFileAvt(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            {fileAvt && (
              <div className={classes.shareImgContainer}>
                <img
                  className={classes.shareImg}
                  src={URL.createObjectURL(fileAvt)}
                  alt=""
                />
                <CloseIcon
                  className={classes.shareCancelImg}
                  onClick={() => setFileAvt(null)}
                />
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvt} className={classes.btn_Cancel}>
            Hủy
          </Button>
          <Button onClick={(e) => submitAvt(e)} className={classes.btn_edit}>
            {loading ? <CircularProgress color="inherit" /> : "Đồng ý"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* end modalAvt */}

      {/* modalCover */}
      <Dialog open={openCover} onClose={handleCloseCover}>
        <DialogTitle>Đổi ảnh Bìa</DialogTitle>
        <DialogContent>
          <form>
            <label htmlFor="file_cover" className={classes.shareOption}>
              <Typography variant="body1" className={classes.shareOptionText}>
                Chọn ảnh
              </Typography>
              <input
                type="file"
                id="file_cover"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFileCover(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            {fileCover && (
              <div className={classes.shareImgContainer}>
                <img
                  className={classes.shareImgCover}
                  src={URL.createObjectURL(fileCover)}
                  alt=""
                />
                <CloseIcon
                  className={classes.shareCancelImg}
                  onClick={() => setFileCover(null)}
                />
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCover} className={classes.btn_Cancel}>
            Hủy
          </Button>
          <Button onClick={(e) => submitCover(e)} className={classes.btn_edit}>
            {loading ? <CircularProgress color="inherit" /> : "Đồng ý"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* end modal cover */}
    </div>
  );
}
