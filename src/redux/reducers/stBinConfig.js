const stBinConfig = (state, action) => {
    switch (action.type) {
      case "SUBMIT_MAP":
        return action.payload;
      default:
        return [];
    }
  };
  
  export default stBinConfig;
  