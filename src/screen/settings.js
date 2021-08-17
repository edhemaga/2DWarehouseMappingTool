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
import { data } from '../data/data';

import { useDispatch } from "react-redux";
import saveConfig from "../redux/actions/saveConfig";

function Settings() {
  const [mapConfig, setMapConfig] = useState({
    name: "",
    gridWidth: 0,
    gridHeigth: 0,
    fieldsToSelect: [],
    leftWall: false,
    rightWall: false,
    upWall: false,
    downWall: false,
    entrance: false,
  });

  const [toggleOptions, setToggleOption] = React.useState();

  const handleCheckboxChange = (event) => {
    setMapConfig({ ...mapConfig, [event.target.name]: event.target.checked });
  };

  var grouppedData = new Map();

  const groupData = (data) => {
    let regal = [];
    for (let i = 0; i < data.length; i++) {
      if (i != 0 && (data[i].regal != data[i - 1].regal)) {
        grouppedData.set(data[i - 1].regal, regal);
        regal = [];
      }
      regal.push(data[i]);
    }

    generateMapData(grouppedData)
  }

  const generateMapData = (grouppedData) => {

    let fields = [];
    var temp = [];

    for (let [key, value] of grouppedData) {
      for (let i = 0; i < value.length - 1; i++) {
        if ((value[i].pozicija === value[i + 1].pozicija)) {
          temp.push(value[i]);
        } else {
          temp.push(value[i]);
          fields.push({ x: value[i].regal_redni_broj, y: value[i].pozicija_redni_broj, storageBins: temp });
          temp = [];
        }
      }
      temp = [];
    }

    let gridConfig = {
      gridHeight: Number(grouppedData.size) + 2,
      gridWidth: Number(data.reduce((a, b) => Number(a.pozicija_redni_broj) > Number(b.pozicija_redni_broj) ? a : b).pozicija_redni_broj) + 2,
      fields: fields
    }

    setMapConfig({ ...mapConfig, gridHeigth: gridConfig.gridHeight, gridWidth: gridConfig.gridWidth, name: 'Konfiguracija 1', fieldsToSelect: gridConfig.fields })

    return gridConfig;
  }

  const [storageBins, setStorageBins] = React.useState();

  const dispatch = useDispatch();

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <span style={{ margin: 'auto' }}>
          <Button variant="contained"
            color="primary" style={{ margin: 20 }} onClick={() => setToggleOption('existing')}>Učitajte postojeću konfiguraciju</Button>
          <Button variant="contained"
            color="primary" style={{ margin: 20 }} onClick={() => setToggleOption('new')}>Kreirajte novu konfiguraciju</Button>
        </span>
      </div>

      {toggleOptions === 'new' ?
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
                  setMapConfig({ ...mapConfig, gridWidth: e.target.value });
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
                to="/map"
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
        : null}

      {toggleOptions === 'existing' ? <Grid container>
        <form
          className="wrapper"
          autoComplete="off"
        >
          <Grid item>
            <InputLabel htmlFor="label">
              Unesite kolone koje želite označiti
            </InputLabel>
            <Select
              className="inputFields"
              onChange={() =>
                groupData(data)
              }
            >
              {[...Array(Number(1))].map((_, i) => {
                return (
                  <MenuItem key={i} value={i}>
                    Konfiguracija 1
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Link
            config={mapConfig}
            style={{ textDecoration: "none", color: "white" }}
            to="/map"
          >
            <Button variant="contained"
              color="primary" onClick={() => { dispatch(saveConfig(mapConfig)) }}>Učitaj</Button>
          </Link>
        </form>
      </Grid> : null
      }
    </div >

  );
}

export default Settings;
