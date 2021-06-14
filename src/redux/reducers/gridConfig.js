const gridConfig = (state, action) => {
  switch (action.type) {
    case "SAVE_CONFIG":
      return action.payload;
    case "DELETE_CONFIG":
      return { name: "", gridWidth: 0, gridHeigth: 0 };
    default:
      return { name: "", gridWidth: 0, gridHeigth: 0 };
  }
};

export default gridConfig;
