import api from "./httpaxios";

const SettingService = {
  get: async () => {
    return api.get("/setting");
  },

  update: async (data) => {
    return api.put("/setting", data);
  },
};

export default SettingService;
