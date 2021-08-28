import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Stage, Layer, Rect, Label } from "react-konva";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import PhotoSizeSelectSmallRoundedIcon from '@material-ui/icons/PhotoSizeSelectSmallRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import AssignmentTurnedInRoundedIcon from '@material-ui/icons/AssignmentTurnedInRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import saveStBinConfig from "../redux/actions/saveStBinConfig";

function Map() {
  let history = useHistory();
  const config = useSelector((state) => state);
  const layerRef = React.useRef();
  const stageRef = React.useRef();
  const scrollContainer = React.useRef();
  const selectionRectRef = React.useRef();
  const selection = React.useRef({
    active: false,
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
  });
  const [useSelection, setUseSelection] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openStBinDets, setOpenStBinDets] = React.useState(false);
  const [tabContent, setTabContent] = React.useState();
  const [stBinDets, setStBinDets] = React.useState();
  const [stagePosition, setStagePosition] = React.useState({ x: 0, y: 0 });
  const [detailsTool, setDetailsTool] = React.useState(false);
  const [edit, setEdit] = React.useState({
    regal: null, //eng
    position: null,
    floor: null,
    stBinHeight: 0,
    stBinWidth: 0,
    stBinLength: 0,
    sector: null,
    prolaz: false,
    pick: false,
    inUse: false,
    inventura: false, //eng
    sakupljanje: false, //eng
  });

  const dispatch = useDispatch();

  let handleCheckboxChange = (event) => {
    setEdit({ ...edit, [event.target.name]: event.target.checked });
  };

  let handleCheckboxChangeStBinDets = (event) => {
    setStBinDets({ ...stBinDets, [event.target.name]: event.target.checked });
  };

  const closeModal = () => {
    setTabContent(undefined);
    if (openStBinDets) {
      saveConfig();
      setOpenStBinDets(false);
    }
    if (open) {
      setOpen(false);
    }
  };

  const setAttributes = (i, j, selectedTemp, floors) => {
    return {
      id: i.toString() + j.toString(),
      x: j * 35,
      y: i * 35,
      selected: selectedTemp,
      floors: floors
    };
  };

  const checkColumn = (i, j) => {
    if (
      (j % config.gridConfig.columnToSelect === 0 && j >= 1) ||
      (config.gridConfig.upWall === true && i === 0) ||
      (config.gridConfig.downWall === true &&
        i === config.gridConfig.gridHeigth - 1) ||
      (config.gridConfig.leftWall === true && j === 0) ||
      (config.gridConfig.rightWall === true &&
        j === config.gridConfig.gridWidth - 1)
    )
      return true;
    else return false;
  };
  const checkRectPosition = (xPos, yPos) => {
    return xPos >=
      (Math.min(selection.current.xStart, selection.current.xEnd) - 40) &&
      xPos <= (Math.max(selection.current.xStart, selection.current.xEnd)) &&
      yPos >= (Math.min(selection.current.yStart, selection.current.yEnd) - 40) &&
      yPos <= (Math.max(selection.current.yStart, selection.current.yEnd))

      ? true
      : false;
  };

  const resetSelectionArea = () => {
    selectionRectRef.current.attrs.width = 0;
    selectionRectRef.current.attrs.height = 0;
    selection.current.xStart = 0;
    selection.current.yStart = 0;
    selection.current.xEnd = 0;
    selection.current.yEnd = 0;
    layerRef.current.batchDraw();
  };

  const setSelectionArea = (x, y, isActive, type) => {
    if (type === "start") {
      selection.current.xStart = x;
      selection.current.yStart = y;
      selection.current.active = isActive;
    }
    if (type === "end") {
      selection.current.xEnd = x;
      selection.current.yEnd = y;
      selection.current.active = false;
    }
  };

  const setNodeAttributes = (node) => {
    node.setAttrs({
      visible: selection.current.active,
      x: selection.current.xStart,
      y: selection.current.yStart,
      width: selectionRectRef.current.xEnd - selection.current.xStart,
      height: selectionRectRef.current.yEnd - selection.current.yStart,
      fill: "rgba(0, 161, 255, 0.3)",
    });
    stageRef.current.batchDraw();
  }; //deconstruct object

  const generateShapes = (config) => {
    let mapConfig = [];
    if (config === undefined) {
      history.push("/");
    } else {
      for (let i = 0; i < config.gridConfig.gridWidth; i++) {
        for (let j = 0; j < config.gridConfig.gridHeigth; j++) {
          if (checkColumn(i, j)) {
            mapConfig.push(setAttributes(i, j, true, []));
          } else {
            mapConfig.push(setAttributes(i, j, false, []));
          }
        }
      }
      for (let i = 0; i < mapConfig.length; i++) {
        for (let j = 0; j < config.gridConfig.fieldsToSelect.length; j++) {
          if (mapConfig[i].x === config.gridConfig.fieldsToSelect[j].x * 70 && mapConfig[i].y === config.gridConfig.fieldsToSelect[j].y * 35) {
            mapConfig[i].selected = true;
            mapConfig[i].floors = config.gridConfig.fieldsToSelect[j].storageBins
          }
        }
      }
    }

    return mapConfig;
  };

  const startSelect = (e) => {
    if (useSelection) {
      setSelectionArea(e.evt.layerX, e.evt.layerY, true, "start");
    }
  };

  const endSelect = (e) => {
    if (useSelection) {
      const configTemp = [...rects];
      var rectsTemp = [];
      setSelectionArea(e.evt.layerX, e.evt.layerY, false, "end");
      for (let i = 0; i < layerRef.current.children.length; i++) {
        let rect = layerRef.current.children[i].attrs;
        if (checkRectPosition(rect.x, rect.y) && rect.id !== "selection") {
          rect.selected = true;
          rect.regal = edit.regal;
          rect.position = edit.position;
          rect.floor = edit.floor;
          rect.stBinHeight = edit.stBinHeight;
          rect.stBinWidth = edit.stBinWidth;
          rect.stBinLength = edit.stBinLength;
          rect.sector = edit.sector;
          rect.pick = edit.pick;
          rect.stock = edit.stock;
          rect.inUse = edit.inUse;
          rect.inventura = edit.inventura;
          rect.sakupljanje = edit.sakupljanje;
          rectsTemp.push(rect);
        }
      }
      for (var i = 0; i < rectsTemp.length; i++) {
        for (var j = 0; j < configTemp.length; j++) {
          if (
            rectsTemp[i].x == configTemp[j].x &&
            rectsTemp[i].y == configTemp[j].y
          ) {
            configTemp[j] = rectsTemp[i];
          }
        }
      }
      setRects(configTemp);
      resetSelectionArea();
    }
  };

  const updateLayer = (e) => {
    if (selection && useSelection) {
      selectionRectRef.current.xEnd = e.evt.layerX;
      selectionRectRef.current.yEnd = e.evt.layerY;
      setNodeAttributes(selectionRectRef.current);
    }
  };

  const setGeneralConfig = () => {
    setOpen(true);
  };

  const removeRect = (node) => {
    var configTemp = [...rects];
    for (var i = 0; i < configTemp.length; i++) {
      if (configTemp[i].x === node.x && configTemp[i].y === node.y) {
        configTemp[i].selected = false;
      }
    }
    setRects(configTemp);
    setOpenStBinDets(false);
  };

  const toggleSelection = () => {
    if (useSelection) {
      setUseSelection(false);
    } else {
      setUseSelection(true);
    }
  };

  const moveStage = () => {
    var dx = scrollContainer.current.scrollLeft;
    var dy = scrollContainer.current.scrollTop;
    stageRef.current.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    setStagePosition({ x: -dx, y: -dy })
  }

  const hoverInOptions = (e) => {
    e.target.style.width = "130px";
  }

  const hoverOutOptions = (e) => {
    e.target.style.width = "80px";
  }

  const useDetailsTool = () => {
    if (detailsTool) { setDetailsTool(false) } else { setDetailsTool(true) }
  }

  const addNewFloor = () => {
    var position = stBinDets;
    stBinDets.floors.push({
      etiketa: null,
      id: null,
      inventura: null,
      organizacija: null,
      pik: null,
      pozicija: null,
      pozicija_redni_broj: null,
      prolaz: null,
      prostorija: stBinDets.floors[stBinDets.floors.length - 1].prostorija,
      regal: stBinDets.floors[stBinDets.floors.length - 1].regal,
      regal_redni_broj: stBinDets.floors[stBinDets.floors.length - 1].regal_redni_broj,
      sektor: stBinDets.floors[stBinDets.floors.length - 1].sektor,
      skupljanje: null,
      sprat: stBinDets.floors.length + 1,
      status_kod_inventure: null,
      upotreba: null,
    });
    setStBinDets(position);
  }

  const [rects, setRects] = React.useState(() => generateShapes(config));

  const saveConfig = () => {
    if (rects.length !== 0) {
      var configTemp = [...rects];
      for (let i = 0; i < configTemp.length; i++) {
        if (
          stBinDets.x === configTemp[i].x &&
          stBinDets.y === configTemp[i].y
        ) {
          configTemp[i] = stBinDets;
          break;
        }
      }
      setRects(configTemp);
    }
  };

  const toggleTabs = (floor) => {
    setTabContent(floor);
  }

  if (config.gridConfig == undefined) {
    history.push("/");
  }
  const useStyles = makeStyles({
    flexGrow: {
      flex: "1",
    },
    button: {
      margin: 5,
      backgroundColor: "rgb(63, 81, 181)",
      color: "white",
      // borderBottom: "3px solid white",
      borderRadius: 0,
      color: "#fff",
      "&:hover": {
        backgroundColor: "#fff",
        color: "rgb(63, 81, 181)",
        // borderBottom: "3px solid #dbdbdb",
      },
    },
  });

  const classes = useStyles();

  return (
    <div>
      {config.gridConfig != undefined ? (
        <div>
          <div
            style={{
              padding: "10px 50px",
              background: "#3f51b5",
              marginBottom: 20,
            }}
          >
          </div>
          <div>
            {/* <div>
              {config != undefined
                ? [...Array(Number(config.gridConfig.gridHeigth))].map(
                  (_, i) => (
                    <div
                      style={{
                        width: 10,
                        height: 50,
                        paddingRight: 15,
                        paddingLeft: 25,
                        paddingBottom: 10,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {i}
                    </div>
                  )
                )
                : history.push("/")}
            </div> */}
            <div ref={scrollContainer} style={{ width: "100vw", height: "calc(100vh - 200px)", display: 'grid', gridTemplateColumns: '2fr 7fr 1fr', margin: 'auto 0 auto auto' }} onScroll={() => moveStage()}>
              <div>
                <div
                  style={{
                    width: "100%",
                    margin: "auto",
                    background: "white",
                  }}
                >
                  <Grid item>
                    {stBinDets != undefined ? (
                      <div
                        style={{
                          margin: "auto",
                          background: "white",
                          height: 'auto',
                          padding: 50,
                        }}
                      >
                        <h2>Informacije o označenoj poziciji:</h2>
                        <div style={{
                          marginBottom: 20, overflowX: 'auto', overflowY: 'hidden', width: '200px',
                        }}>
                          {stBinDets.floors.map((floor, indx) => (
                            <span>
                              <span onClick={() => toggleTabs(floor)} style={{ padding: 10, borderBottom: '1px solid rgb(63, 81, 181)', marginRight: 5 }}>{indx}</span>
                            </span>
                          ))}
                          <span onClick={() => addNewFloor()} style={{ paddingTop: 10, marginRight: 5 }}><AddCircleIcon /></span>
                        </div>
                        {tabContent != undefined ? <div>
                          <div><h4>ID: {tabContent.id}</h4></div>
                          <div><b>Regal: {tabContent.regal}</b></div>
                          <div><b>Redni broj u regalu: {tabContent.regal_redni_broj}</b></div>
                          <div><b>Sprat: {tabContent.sprat}</b></div>
                          <div><b>Etiketa: {tabContent.etiketa}</b></div>
                          <Grid>
                            <Button
                              onClick={() => {
                                console.log(tabContent);
                              }}
                              style={{
                                background: "#f44336",
                                color: "white",
                                padding: "10px 20px",
                                margin: "5px 0",
                              }}
                            >
                              Ukloni sprat
                            </Button>
                          </Grid> 
                        </div> : null}
                        {/* <Grid item>
                        <TextField
                          className="inputFields"
                          id="outlined-basic"
                          name="name"
                          value={stBinDets.position}
                          label="Unesite poziciju"
                          variant="outlined"
                          onChange={(e) =>
                            setStBinDets({
                              ...stBinDets,
                              position: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className="inputFields"
                          id="outlined-basic"
                          name="name"
                          type="number"
                          value={stBinDets.floor}
                          label="Unesite broj spratova"
                          variant="outlined"
                          onChange={(e) =>
                            setStBinDets({
                              ...stBinDets,
                              floor: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      {edit.floor != (undefined || 0) ? (
                        <Grid item>
                          <TextField
                            className="inputFields"
                            id="outlined-basic"
                            name="name"
                            type="number"
                            value={stBinDets.prolaz}
                            label="Unesite broj spratova prolaza"
                            variant="outlined"
                            onChange={(e) =>
                              setStBinDets({
                                ...stBinDets,
                                prolaz: e.target.value,
                              })
                            }
                          />
                        </Grid>
                      ) : null}
                      <Grid item>
                        <TextField
                          className="inputFields"
                          id="outlined-basic"
                          name="name"
                          value={stBinDets.stBinHeight}
                          type="number"
                          label="Unesite visinu skladišnog mjesta"
                          variant="outlined"
                          onChange={(e) =>
                            setStBinDets({
                              ...stBinDets,
                              stBinHeight: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className="inputFields"
                          id="outlined-basic"
                          name="name"
                          value={stBinDets.stBinLength}
                          type="number"
                          label="Unesite dužinu skladišnog mjesta"
                          variant="outlined"
                          onChange={(e) =>
                            setStBinDets({
                              ...stBinDets,
                              stBinLength: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className="inputFields"
                          id="outlined-basic"
                          name="name"
                          value={stBinDets.stBinWidth}
                          type="number"
                          label="Unesite širinu skladišnog mjesta"
                          variant="outlined"
                          onChange={(e) =>
                            setStBinDets({
                              ...stBinDets,
                              stBinWidth: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item>
                        <InputLabel htmlFor="label">
                          Izaberite sektor
                        </InputLabel>
                        <Select
                          className="inputFields"
                          value={stBinDets.sector}
                          onChange={(e) =>
                            setStBinDets({
                              ...stBinDets,
                              sector: e.target.value,
                            })
                          }
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
                              checked={stBinDets.pick}
                              onChange={handleCheckboxChangeStBinDets}
                              name="pick"
                              color="primary"
                            />
                          }
                          label="Ručno sakupljanje"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={stBinDets.inUse}
                              onChange={handleCheckboxChangeStBinDets}
                              name="inUse"
                              color="primary"
                            />
                          }
                          label="U upotrebi"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={stBinDets.inventura}
                              onChange={handleCheckboxChangeStBinDets}
                              name="inventura"
                              color="primary"
                            />
                          }
                          label="Inventura"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={stBinDets.sakupljanje}
                              onChange={handleCheckboxChangeStBinDets}
                              name="sakupljanje"
                              color="primary"
                            />
                          }
                          label="Sakupljanje"
                        />
                      </Grid>
                      <Grid>
                        <Button
                          onClick={() => {
                            removeRect(stBinDets);
                          }}
                          style={{
                            background: "#f44336",
                            color: "white",
                            padding: "10px 20px",
                            margin: "5px 0",
                          }}
                        >
                          Ukloni polje
                        </Button>
                      </Grid> */}
                      </div>
                    ) : null}
                  </Grid>
                </div>
              </div>
              <div style={{ width: 'fit', height: 'auto', overflow: 'auto', }}>
                <Stage
                  x={stagePosition.x}
                  y={stagePosition.y}
                  ref={stageRef}
                  //width i heigth ispraviti u settingsu
                  width={config.gridConfig.gridHeigth * 35}
                  height={config.gridConfig.gridWidth * 35}
                  onMouseDown={(e) => startSelect(e)}
                  onMouseUp={(e) => endSelect(e)}
                  onMouseMove={(e) => updateLayer(e)}
                >
                  <Layer
                    ref={layerRef}>
                    {rects.map((rect) => (
                      <Rect
                        // key={rect.id}
                        id={rect.id}
                        x={rect.x}
                        y={rect.y}
                        width={30}
                        height={30}
                        floors={rect.floors}
                        fill={rect.selected ? "#3f51b5" : "#e8eaf6"}
                        selected={rect.selected}
                        onClick={(node) => {
                          if (node.target.attrs.selected && detailsTool) {
                            setStBinDets(node.target.attrs);
                          }
                        }}
                      />
                    ))}
                  </Layer>
                  <Layer>
                    <Rect ref={selectionRectRef} id="selection" />
                  </Layer>
                </Stage>
              </div>
              <div style={{ width: '50%', marginLeft: '50%' }}>
                <div onClick={toggleSelection} onMouseEnter={hoverInOptions} onMouseLeave={hoverOutOptions} style={{ width: 80, height: 60, background: '#c9d1ff', display: 'flex', marginTop: 5, marginLeft: 2, float: 'right', transition: 'width 0.5s' }}><PhotoSizeSelectSmallRoundedIcon style={{ margin: 'auto' }} /></div>
                <div onClick={setGeneralConfig} onMouseEnter={hoverInOptions} onMouseLeave={hoverOutOptions} style={{ width: 80, height: 60, background: '#c9d1ff', display: 'flex', marginTop: 5, marginLeft: 2, float: 'right', transition: 'width 0.5s' }}><SettingsRoundedIcon style={{ margin: 'auto' }} /></div>
                <Link
                  style={{ textDecoration: "none", color: 'black' }}
                  to="/confirmation"
                >
                  <div onClick={() =>
                    dispatch(
                      saveStBinConfig(rects.filter((rect) => rect.selected))
                    )
                  } onMouseEnter={hoverInOptions} onMouseLeave={hoverOutOptions} style={{ width: 80, height: 60, background: '#c9d1ff', display: 'flex', marginTop: 5, marginLeft: 2, float: 'right', transition: 'width 0.5s' }}><AssignmentTurnedInRoundedIcon style={{ margin: 'auto' }} /></div>

                </Link>
                <div onClick={useDetailsTool} onMouseEnter={hoverInOptions} onMouseLeave={hoverOutOptions} style={{ width: 80, height: 60, background: '#c9d1ff', display: 'flex', marginTop: 5, marginLeft: 2, float: 'right', transition: 'width 0.5s' }}><EditRoundedIcon style={{ margin: 'auto' }} /></div>
              </div>
            </div>
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
                    onChange={(e) =>
                      setEdit({ ...edit, regal: e.target.value })
                    }
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
                    onChange={(e) =>
                      setEdit({ ...edit, floor: e.target.value })
                    }
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
                      setEdit({ ...edit, height: e.target.value })
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
                      setEdit({ ...edit, length: e.target.value })
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
                      setEdit({ ...edit, width: e.target.value })
                    }
                  />
                </Grid>
                <Grid item>
                  <InputLabel htmlFor="label">Izaberite sektor</InputLabel>
                  <Select
                    className="inputFields"
                    onChange={(e) =>
                      setEdit({ ...edit, sector: e.target.value })
                    }
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
              </div>
            </Modal>
            <Modal
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
              open={openStBinDets}
              onClose={closeModal}
            >
            </Modal>
          </div>
        </div >
      ) : (
        ((<div>Molimo unesite konfiguraciju skladišta!</div>),
          setTimeout(() => {
            history.push("/");
          }, 2000))
      )
      }
    </div >
  );
}

export default Map;
