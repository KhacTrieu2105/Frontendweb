import httpAxios from "./httpaxios";

const StockinService = {
  getList: (params) => {
    return httpAxios.get("/stockin", { params });
  },

  create: (data) => {
    return httpAxios.post("/stockin", data);
  },
};

export default StockinService;
