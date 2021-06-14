const saveConfig = (config) => {
  return {
    type: "SAVE_CONFIG",
    payload: config,
  };
};

export default saveConfig;
