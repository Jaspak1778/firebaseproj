//App.jsx
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBooks from "./Addbooks";
import "./App.css";

ModuleRegistry.registerModules([AllCommunityModule]);
function App() {
  const [books, setBooks] = useState([]);
  const colDefs = [
    { field: "title", sortable: true, filter: true },
    { field: "author", sortable: true, filter: true },
    { field: "year", sortable: true, filter: true },
    { field: "isbn", sortable: true, filter: true },
    { field: "price", sortable: true, filter: true },
    {
      headerName: "",
      field: "id",
      width: 90,
      cellRenderer: (params) => (
        <IconButton
          onClick={() => deleteBook(params.value)}
          size="small"
          color="error"
        >
          {" "}
          <DeleteIcon />{" "}
        </IconButton>
      ),
    },
  ];
  useEffect(() => {
    fetchItems();
  }, []);
  const fetchItems = () => {
    fetch(
      "https://viope-b5b40-default-rtdb.europe-west1.firebasedatabase.app/books.json"
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          setBooks([]);
          return;
        }
        const books = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));
        setBooks(books);
      })
      .catch((err) => console.error(err));
  };
  const addBook = (newBook) => {
    fetch(
      "https://viope-b5b40-default-rtdb.europe-west1.firebasedatabase.app/books.json",
      { method: "POST", body: JSON.stringify(newBook) }
    )
      .then(() => fetchItems())
      .catch((err) => console.error(err));
  };
  const deleteBook = (id) => {
    fetch(
      `https://viope-b5b40-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      { method: "DELETE" }
    )
      .then(() => fetchItems())
      .catch((err) => console.error(err));
  };
  return (
    <>
      {" "}
      <AppBar position="static">
        {" "}
        <Toolbar>
          {" "}
          <Typography sx={{ ml: 50 }} variant="h5">
            {" "}
            BOOKSTORE{" "}
          </Typography>{" "}
        </Toolbar>{" "}
      </AppBar>{" "}
      <AddBooks addBook={addBook} />{" "}
      <div style={{ height: 500, width: 1100 }}>
        {" "}
        <AgGridReact rowData={books} columnDefs={colDefs} />{" "}
      </div>{" "}
    </>
  );
}
export default App;
