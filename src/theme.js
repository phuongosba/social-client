import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/system";

export const theme = createTheme({
  palette: {
    primary: {
      main: grey[50],
    },
  },
  myButton: {
    backgroundColor: "red",
    color: "white",
    border: "1px solid black",
  },
});
