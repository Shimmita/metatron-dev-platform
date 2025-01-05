import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React from "react";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";

const columns = [
  { id: "type", label: "Type" },
  {
    id: "date",
    label: "Date",
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "amount",
    label: `Amount ${CustomDeviceIsSmall() ? "" : "(USD)"}`,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(type, date, amount) {
  return { type, date, amount };
}

const rows = [
  createData("A/C-Withdraw -", "02/01/2025", 500),
  createData("Course-Credit +", "27/12/2024", 100),
  createData("Course-Credit +", "27/12/2024", 50),
  createData("A/C-Deposit +", "26/12/2024", 20),
  createData("Course-Enroll -", "25/12/2024", 40),
  createData("A/C-Withdraw -", "25/12/2024", 100),
  createData("Course-Credit +", "22/12/2024", 50),
  createData("Course-Credit +", "24/12/2024", 30),
];

export default function TableTransactions() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const paginationOptions = [5, 10, 25, 50, 100];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={0}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          size={CustomDeviceIsSmall() ? "small" : undefined}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <React.Fragment>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ width: 100 }}
                          >
                            {column.format && typeof value === "number"
                              ? `$${column.format(value)}`
                              : value}
                          </TableCell>
                        );
                      })}
                    </React.Fragment>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={paginationOptions}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
