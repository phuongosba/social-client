import React, { useContext, useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, makeStyles } from "@material-ui/core";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
} from "@mui/material/";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import "../css/ProfileRight.css";
import CloseIcon from "@mui/icons-material/Close";
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
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MangeUser() {
  const classes = useStyles();
  const { token } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const editName = useRef();
  const addName = useRef();
  const addEmail = useRef();
  const addUserName = useRef();
  const addPassword = useRef();
  const addAuth = useRef();
  const addFac = useRef();
  const [value, setValue] = useState([]);
  const URL = process.env.REACT_APP_API_URL;
  //edit dialog
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const handleClickOpen = (string) => {
    setOpen(true);
    setChoice(string);
  };

  const handleClose = () => {
    setOpen(false);
    setValue([]);
  };
  //end edit dialog
  //end edit dialog
  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 1 },

    {
      field: "name",
      headerName: "Tên Khoa",
      sortable: false,
      width: 300,
      flex: 1,
    },
    {
      field: "username",
      headerName: "Tên tài khoản",
      sortable: false,
      width: 300,
      flex: 1,
    },
    {
      field: "authorize",
      headerName: "Chức vụ",

      sortable: false,
      width: 300,
      flex: 1,
    },
  ];
  const handleEditRow = async (e) => {
    e.preventDefault();
    let arr = [];
    const arrValue = value.find((val) => {
      const idObject = { _id: val._id };
      arr.push(idObject);
    });

    const newUser = {
      name: editName.current.value,
      categories: arr,
    };
    //call api here
    await axios.put(`${URL}/api/users/${editRow.id}`, newUser, {
      headers: { "x-access-token": token },
    });
    //
    const res = await axios.get(`${URL}/api/users`, {
      headers: { "x-access-token": token },
    });
    setRows(res.data.filter((d) => d.authorize === 2));
    setSuccess("Sửa Khoa thành công");
    handleClose();
  };

  const handleDeleteRow = async (e) => {
    e.preventDefault();

    const selectedIDs = new Set(selectionModel);
    //call api here

    var config = {
      method: "delete",
      url: `${URL}/api/users`,
      headers: {
        "x-access-token": token,
      },
      data: {
        ids: Array.from(selectedIDs),
      },
    };

    await axios(config)
      .then(function (res) {
        setRows(res.data.filter((d) => d.authorize === 2));
        handleClose();
        setSuccess("Xóa Khoa thành công");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const filter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  const handleAddRow = async (e) => {
    e.preventDefault();

    //call api
    try {
      if (addName.current.value === "") {
        setError("Điền tên Khoa");
      } else if (addEmail.current.value === "") {
        setError("Không đươc để trống email ");
      } else if (!filter.test(addEmail.current.value)) {
        setError("Email không hợp lệ");
      } else if (addUserName.current.value === "") {
        setError("Không đươc để trống tên tài khoản ");
      } else if (addPassword.current.value.length < 6) {
        setError("Độ dài mật khẩu phải lớn hơn 6 ");
      } else {
        const newUser = {
          name: addName.current.value,
          username: addUserName.current.value,
          email: addEmail.current.value,
          password: addPassword.current.value,
          authorize: "2",
        };
        await axios.post(`${URL}/api/users`, newUser, {
          headers: { "x-access-token": token },
        });
        //
        const res = await axios.get(`${URL}/api/users`, {
          headers: { "x-access-token": token },
        });
        setRows(res.data.filter((d) => d.authorize === 2));
        handleClose();

        setSuccess("Thêm Khoa thành công");
      }
    } catch (err) {
      setError("Tài khoản hoặc tên Khoa đã tồn tại");
    }
  };
  //get user
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${URL}/api/admin/faculties`);
      const data = res.data;
      setRows(data);
    } catch (err) {
      console.log("Requet cancel", err.message);
    }
  };

  const [categories, setCategories] = useState([]);
  const fetchCate = async () => {
    try {
      const res = await axios.get(`${URL}/api/admin/categories`);
      const data = res.data;
      setCategories(data);
    } catch (err) {
      console.log("Requet cancel");
    }
  };
  //call api
  useEffect(() => {
    fetchCate();

    fetchUser();
  }, []);

  //end call api
  //format data from api
  const rowData = rows.map((d) => {
    let author = "";
    if (d.authorize === 3) {
      author = "Sinh viên";
    } else if (d.authorize === 2) {
      author = "Quản lí";
    } else if (d.authorize === 1) {
      author = "Quản trị";
    }

    return {
      key: d._id,
      id: d._id,
      name: d.name,
      username: d.username,
      authorize: author,

      categories: d.categories,
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
          Thêm Phòng/Khoa
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          className={classes.delete_btn}
          onClick={(e) => handleClickOpen("Delete")}
        >
          Xóa Khoa
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
              window.alert("Vui lòng chọn 1 hàng");
            } else {
              const result = rowData.find(({ id }) => id === selectedIDs[0]);
              // suawr
              if (result.categories.length !== 0) {
                let arr = [];
                const array_1 = result.categories.find((obj) => {
                  const array_2 = categories.find((cate) => {
                    if (cate._id === obj._id) {
                      arr.push(cate);
                    }
                  });
                });
                setValue(arr);
                //
              }
              setEditRow(result);
              handleClickOpen("Edit");
            }
          }}
        >
          Thêm chuyên mục
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
        //sua nguoi dung
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Thêm danh mục</DialogTitle>
          <DialogContent>
            <form className="form_update_info">
              <div className="form_update_info-item">
                <label htmlFor="fname" className="form_update_info-label">
                  Tên Khoa
                </label>
                <input
                  aria-label=""
                  className="form_update_info-input"
                  type="text"
                  ref={editName}
                  defaultValue={editRow.name}
                />
              </div>
              <div>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  disableCloseOnSelect
                  value={value}
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) =>
                    value._id === option._id
                  }
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Danh muc"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </React.Fragment>
                  )}
                  onChange={(_, selectedOptions) => setValue(selectedOptions)}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className={classes.btn_cancel}>
              Hủy
            </Button>
            <Button onClick={handleEditRow} className={classes.btn_edit}>
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      ) : //end sua nguoi dung
      choice === "Delete" ? (
        //delete
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Xóa Khoa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Không thể khôi phục, xác nhận xóa các Khoa này?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} className={classes.btn_cancel}>
              Hủy
            </Button>
            <Button onClick={handleDeleteRow} className={classes.btn_edit}>
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        //end delete
        //add
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Thêm Khoa</DialogTitle>

          <DialogContent>
            {error && <span className="error">{error}</span>}
            <form className="form_update_info">
              <div className="form_update_info-item">
                <label htmlFor="fname" className="form_update_info-label">
                  Tên Khoa:
                </label>
                <input
                  aria-label=""
                  className="form_update_info-input"
                  type="text"
                  ref={addName}
                  required
                  onClick={(e) => setError("")}
                />
              </div>
              <div className="form_update_info-item">
                <label htmlFor="fname" className="form_update_info-label">
                  Email:
                </label>
                <input
                  aria-label=""
                  className="form_update_info-input"
                  type="email"
                  ref={addEmail}
                  required
                  onClick={(e) => setError("")}
                />
              </div>
              <div className="form_update_info-item">
                <label htmlFor="fname" className="form_update_info-label">
                  Tên tài khoản:
                </label>
                <input
                  aria-label=""
                  className="form_update_info-input"
                  type="text"
                  ref={addUserName}
                  required
                  onClick={(e) => setError("")}
                />
              </div>
              <div className="form_update_info-item">
                <label htmlFor="fname" className="form_update_info-label">
                  Mật khẩu:
                </label>
                <input
                  aria-label=""
                  className="form_update_info-input"
                  type="password"
                  ref={addPassword}
                  minLength="6"
                  required
                  onClick={(e) => setError("")}
                />
              </div>
            </form>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} className={classes.btn_cancel}>
              Hủy
            </Button>
            <Button onClick={handleAddRow} className={classes.btn_edit}>
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>

        ///end add
      )}
    </div>
  );
}
