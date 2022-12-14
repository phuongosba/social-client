import React, { useRef, useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material/";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import "../css/ProfileRight.css";
const useStyles = makeStyles((theme) => ({
  dataTable: {
    marginTop: "30px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  },
  btn_cancel: {
    color: "red !important",
  },
  btn_edit: {
    color: "#03a9f4",
  },
  add_btn: {
    border: "1px solid #18478b!important",
    color: "black !important",
    margin: "10px !important",
    "&:hover": {
      backgroundColor: "#18478b!important",
      color: "white !important",
    },
  },
  edit_btn: {
    border: "1px solid #2196f3!important",
    color: "#2196f3!important",
    margin: "10px !important",
    "&:hover": {
      backgroundColor: "#2196f3!important",
      color: "white !important",
    },
  },
  delete_btn: {
    border: "1px solid red !important",
    color: "red !important",
    margin: "10px !important",
    "&:hover": {
      backgroundColor: "red!important",
      color: "white !important",
    },
  },
}));

export default function ManageCate() {
  const classes = useStyles();
  const { token } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [success, setSuccess] = useState("");
  const editName = useRef();
  const addName = useRef();
  //edit dialog
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const handleClickOpen = (string) => {
    setOpen(true);
    setChoice(string);
  };
  const URL = process.env.REACT_APP_API_URL;
  const handleClose = () => {
    setOpen(false);
  };
  //end edit dialog
  //end edit dialog
  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.3 },

    {
      field: "name",
      headerName: "T??n danh m???c",
      sortable: false,
      width: 300,
      flex: 1,
    },
  ];
  const handleEditRow = async (e) => {
    e.preventDefault();

    const newCate = {
      name: editName.current.value,
    };
    //call api here
    await axios.put(`${URL}/api/admin/categories/${editRow.id}`, newCate, {
      headers: { Authorization: "Bearer " + token },
    });
    //
    const res = await axios.get(`${URL}/api/admin/categories`);
    setRows(res.data);
    setSuccess("S???a danh m???c th??nh c??ng");
    handleClose();
  };

  const handleDeleteRow = async (e) => {
    e.preventDefault();

    const selectedIDs = new Set(selectionModel);
    //call api here

    var config = {
      method: "delete",
      url: `${URL}/api/admin/categories/delete`,
      headers: { Authorization: "Bearer " + token },
      data: {
        ids: Array.from(selectedIDs),
      },
    };

    await axios(config)
      .then(function (res) {
        setRows(res.data);
        handleClose();
        setSuccess("X??a danh m???c th??nh c??ng");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    //call api
    try {
      if (addName.current.value === "") {
        setError("??i???n t??n danh m???c");
      } else {
        const newCate = {
          name: addName.current.value,
        };
        await axios.post(`${URL}/api/admin/categories/add`, newCate, {
          headers: { Authorization: "Bearer " + token },
        });
        //
        const res = await axios.get(`${URL}/api/admin/categories`);
        setRows(res.data);
        handleClose();
        setSuccess("Th??m danh m???c th??nh c??ng");
      }
    } catch {
      setError("T??n danh m???c ???? t???n t???i");
    }
    //
  };

  //call api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${URL}/api/admin/categories`);
        const data = res.data;
        setRows(data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Requet cancel", err.message);
        }

        if (err.response.status === 401) {
          localStorage.removeItem("user");

          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    };
    fetchData();
  }, []);

  //end call api

  const rowData = rows.map((d) => {
    return {
      id: d._id,
      name: d.name,
    };
  });
  return (
    <div style={{ height: 400, width: "100%" }}>
      {success && (
        <div className="successNotification">
          <span>{success}</span>
          <IconButton
            color="success"
            aria-label="upload picture"
            component="span"
            onClick={(e) => setSuccess("")}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}

      <div>
        <Button
          startIcon={<AddIcon />}
          className={classes.add_btn}
          onClick={(e) => handleClickOpen("Add")}
        >
          Th??m danh m???c
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          className={classes.delete_btn}
          onClick={(e) => handleClickOpen("Delete")}
        >
          X??a Danh m???c
        </Button>
        <Button
          startIcon={<EditIcon />}
          className={classes.edit_btn}
          onClick={() => {
            const selectedIDs = selectionModel;
            // you can call an API to delete the selected IDs
            // and get the latest results after the deletion
            // then call setRows() to update the data locally here
            if (selectionModel.length !== 1) {
              window.alert("Vui l??ng ch???n 1 h??ng");
            } else {
              const result = rowData.find(({ id }) => id === selectedIDs[0]);
              setEditRow(result);

              handleClickOpen("Edit");
            }
          }}
        >
          S???a danh m???c
        </Button>
      </div>

      <DataGrid
        rows={rowData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        onSelectionModelChange={(ids) => {
          setSelectionModel(ids);
        }}
        className={classes.dataTable}
      />
      {choice === "Edit" ? (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>S???a danh m???c</DialogTitle>
          <DialogContent>
            <label htmlFor="fname" className="form_update_info-label">
              T??n danh m???c
            </label>
            <input
              aria-label=""
              className="form_update_info-input"
              type="text"
              ref={editName}
              defaultValue={editRow.name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className={classes.btn_cancel}>
              H???y
            </Button>
            <Button onClick={handleEditRow} className={classes.btn_edit}>
              ?????ng ??
            </Button>
          </DialogActions>
        </Dialog>
      ) : choice === "Delete" ? (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>X??a danh m???c</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Kh??ng th??? kh??i ph???c, x??c nh???n x??a c??c danh m???c n??y?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} className={classes.btn_cancel}>
              H???y
            </Button>
            <Button onClick={handleDeleteRow} className={classes.btn_edit}>
              ?????ng ??
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Th??m danh m???c</DialogTitle>

          <DialogContent>
            {error && <span className="error">{error}</span>}
            <form className="form_update_info">
              <div className="form_update_info-item">
                <label htmlFor="fname" className="form_update_info-label">
                  T??n danh m???c
                </label>
                <input
                  aria-label=""
                  className="form_update_info-input"
                  type="text"
                  ref={addName}
                  onClick={(e) => setError("")}
                />
              </div>
            </form>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} className={classes.btn_cancel}>
              H???y
            </Button>
            <Button onClick={handleAddRow} className={classes.btn_edit}>
              ?????ng ??
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
