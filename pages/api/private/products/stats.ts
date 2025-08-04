import apiRoute from "../../../../api/api/apiRoute";

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return { result: "" };
      },
    },
  },
});
