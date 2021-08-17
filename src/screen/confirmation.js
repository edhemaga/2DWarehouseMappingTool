import React, { useState } from "react";
import { useSelector } from "react-redux";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import { useHistory } from "react-router-dom";

function Confirmation() {
  let history = useHistory();

  const [fieldConfig, setFieldConfig] = React.useState(
    useSelector((state) => state)
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState({
    regal: null, //eng
    position: null,
    floor: null,
    stBinHeight: 0,
    stBinLength: 0,
    stBinWidth: 0,
    sector: null,
    pick: false,
    inUse: false,
    inventura: false, //eng
    sakupljanje: false, //eng
    stock: false,
  });
  let handleCheckboxChange = (event) => {
    setEdit({ ...edit, [event.target.name]: event.target.checked });
  };

  const removeStBin = (rect) => {
    var configTemp = [...fieldConfig.stBinConfig];
    for (var cnt = 0; cnt < configTemp.length; cnt++) {
      if (configTemp[cnt].id === rect.id) {
        configTemp.splice(cnt, 1);
        break;
      }
    }
    setFieldConfig({ stBinConfig: configTemp });
  };
  const closeModal = () => {
    if (open) {
      setOpen(false);
    }
  };
  const submitStBinConfig = () => {
    var configTemp = [...fieldConfig.stBinConfig];
    for (var cnt = 0; cnt < configTemp.length; cnt++) {
      if (configTemp[cnt].id === edit.id) {
        configTemp[cnt] = edit;
        break;
      }
    }
    setFieldConfig({ stBinConfig: configTemp });
    setOpen(false);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {fieldConfig.stBinConfig != undefined ? (
        <div style={{ height: "100vh", display: "flex" }}>
          <TableContainer style={{ margin: "10px auto", width: "98%" }}>
            <Table aria-label="Storage bins">
              <TableHead
                style={{
                  backgroundColor: "rgb(63, 81, 181)",
                }}
              >
                <TableRow>
                  <TableCell style={{ color: "white" }} align="center">
                    ID
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Sprat
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Pozicija
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Sektor
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Visina mjesta
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Dužina mjesta
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Širina mjesta
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    U upotrebi
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Inventura
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Pick
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Stock
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Uredi
                  </TableCell>
                  <TableCell style={{ color: "white" }} align="center">
                    Izbriši
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fieldConfig.stBinConfig
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.name}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.floor}</TableCell>
                      <TableCell align="center">{row.position}</TableCell>
                      <TableCell align="center">{row.sector}</TableCell>
                      <TableCell align="center">{row.stBinHeight}</TableCell>
                      <TableCell align="center">{row.stBinLength}</TableCell>
                      <TableCell align="center">{row.stBinWidth}</TableCell>
                      <TableCell align="center">
                        {row.inUse ? "Da" : "Ne"}
                      </TableCell>
                      <TableCell align="center">
                        {row.inventura ? "Da" : "Ne"}
                      </TableCell>
                      <TableCell align="center">
                        {row.pick ? "Da" : "Ne"}
                      </TableCell>
                      <TableCell align="center">
                        {row.stock ? "Da" : "Ne"}
                      </TableCell>
                      <TableCell align="center">
                        <EditIcon
                          style={{ color: "yellow" }}
                          onClick={() => {
                            setOpen(true);
                            setEdit(row);
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <RemoveCircleIcon
                          style={{ color: "red" }}
                          onClick={() => removeStBin(row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter
                style={{
                  backgroundColor: "rgb(63, 81, 181)",
                  // position: "fixed",
                  // bottom: 0,
                  // right: 0,
                  width: "100%",
                }}
              >
                <TableRow>
                  <TablePagination
                    style={{ color: "white" }}
                    rowsPerPageOptions={[]}
                    // colSpan={3}
                    count={fieldConfig.stBinConfig.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Modal
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
            }}
            open={open}
            onClose={closeModal}
          >
            <div
              style={{
                margin: "auto",
                background: "white",
                padding: 50,
              }}
            >
              <Grid item>
                <TextField
                  className="inputFields"
                  id="outlined-basic"
                  name="regal"
                  label="Unesite naziv regala"
                  variant="outlined"
                  onChange={(e) => setEdit({ ...edit, regal: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  className="inputFields"
                  id="outlined-basic"
                  name="name"
                  label="Unesite poziciju"
                  variant="outlined"
                  onChange={(e) =>
                    setEdit({ ...edit, position: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  className="inputFields"
                  id="outlined-basic"
                  name="name"
                  type="number"
                  label="Unesite broj spratova"
                  variant="outlined"
                  onChange={(e) => setEdit({ ...edit, floor: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  className="inputFields"
                  id="outlined-basic"
                  name="name"
                  type="number"
                  label="Unesite visinu skladišnog mjesta"
                  variant="outlined"
                  onChange={(e) =>
                    setEdit({ ...edit, stBinHeight: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  className="inputFields"
                  id="outlined-basic"
                  name="name"
                  type="number"
                  label="Unesite dužinu skladišnog mjesta"
                  variant="outlined"
                  onChange={(e) =>
                    setEdit({ ...edit, stBinLength: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  className="inputFields"
                  id="outlined-basic"
                  name="name"
                  type="number"
                  label="Unesite širinu skladišnog mjesta"
                  variant="outlined"
                  onChange={(e) =>
                    setEdit({ ...edit, stBinWidth: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <InputLabel htmlFor="label">Izaberite sektor</InputLabel>
                <Select
                  className="inputFields"
                  value={edit.sector}
                  onChange={(e) => setEdit({ ...edit, sector: e.target.value })}
                >
                  {[...Array(Number(5))].map((_, i) => {
                    return (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={edit.pick}
                      onChange={handleCheckboxChange}
                      name="pick"
                      color="primary"
                    />
                  }
                  label="Ručno sakupljanje"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={edit.inUse}
                      onChange={handleCheckboxChange}
                      name="inUse"
                      color="primary"
                    />
                  }
                  label="U upotrebi"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={edit.inventura}
                      onChange={handleCheckboxChange}
                      name="inventura"
                      color="primary"
                    />
                  }
                  label="Inventura"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={edit.sakupljanje}
                      onChange={handleCheckboxChange}
                      name="sakupljanje"
                      color="primary"
                    />
                  }
                  label="Sakupljanje"
                />
              </Grid>
              <Button
                variant="contained"
                id="btn"
                onClick={() => submitStBinConfig()}
              >
                Sačuvaj konfiguraciju polja
              </Button>
            </div>
          </Modal>
        </div>
      ) : // history.push("/")
      null}
    </div>
  );
}

export default Confirmation;
