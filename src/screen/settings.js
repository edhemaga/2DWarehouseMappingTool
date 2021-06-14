import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import "../screen/css/settings.css";

import { useDispatch } from "react-redux";
import saveConfig from "../redux/actions/saveConfig";

function Settings(props) {
  const [mapConfig, setMapConfig] = useState({
    name: "",
    gridWidth: 0,
    gridHeigth: 0,
    columnToSelect: "",
    leftWall: false,
    rightWall: false,
    upWall: false,
    downWall: false,
    entrance: false,
  });

  const handleCheckboxChange = (event) => {
    setMapConfig({ ...mapConfig, [event.target.name]: event.target.checked });
  };

  const dispatch = useDispatch();

  return (
    <Grid container>
      <form
        className="wrapper"
        autoComplete="off"
        // onSubmit={(e) => submitConfiguration(e)}
      >
        <h1>Unesite konfiguraciju skladišta</h1>
        <Grid item>
          <TextField
            className="inputFields"
            id="outlined-basic"
            name="name"
            label="Unesite naziv skladišta"
            variant="outlined"
            onChange={(e) => {
              setMapConfig({ ...mapConfig, name: e.target.value });
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            className="inputFields"
            id="outlined-basic"
            name="gridWidth"
            label="Unesite širinu mape"
            variant="outlined"
            type="number"
            onChange={(e) => {
              {
                setMapConfig({ ...mapConfig, gridWidth: e.target.value });
              }
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            className="inputFields"
            id="outlined-basic"
            name="gridHeight"
            label="Unesite dužinu mape"
            variant="outlined"
            type="number"
            onChange={(e) =>
              setMapConfig({ ...mapConfig, gridHeigth: e.target.value })
            }
          />
        </Grid>
        <Grid item>
          <InputLabel htmlFor="label">
            Unesite kolone koje želite označiti
          </InputLabel>
          <Select
            className="inputFields"
            value={mapConfig.columnToSelect}
            disabled={mapConfig.gridWidth === 0}
            onChange={(e) =>
              setMapConfig({ ...mapConfig, columnToSelect: e.target.value })
            }
          >
            {[...Array(Number(mapConfig.gridWidth))].map((_, i) => {
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
                checked={mapConfig.leftWall}
                onChange={handleCheckboxChange}
                name="leftWall"
                color="primary"
              />
            }
            label="Lijevi zid"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mapConfig.rightWall}
                onChange={handleCheckboxChange}
                name="rightWall"
                color="primary"
              />
            }
            label="Desni zid"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mapConfig.upWall}
                onChange={handleCheckboxChange}
                name="upWall"
                color="primary"
              />
            }
            label="Gornji zid"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mapConfig.downWall}
                onChange={handleCheckboxChange}
                name="downWall"
                color="primary"
              />
            }
            label="Donji zid"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mapConfig.entrance}
                onChange={handleCheckboxChange}
                name="entrance"
                color="primary"
              />
            }
            label="Ulaz/prostor za prijem robe"
          />
        </Grid>

        <Grid item>
          <Link
            config={mapConfig}
            style={{ textDecoration: "none", color: "white" }}
            to="/grid"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(saveConfig(mapConfig))}
            >
              Kreiraj
            </Button>
          </Link>
        </Grid>
      </form>
    </Grid>
  );
}

export default Settings;
