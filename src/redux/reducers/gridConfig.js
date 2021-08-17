const gridConfig = (state, action) => {
  switch (action.type) {
    case "SAVE_CONFIG":
      return action.payload;
    case "DELETE_CONFIG":
      return state;
    default:
      if (state == undefined)
        return { name: "Nema konfiguracije!", gridWidth: 0, gridHeigth: 0 };
      else return state;
  }
};

export default gridConfig;
