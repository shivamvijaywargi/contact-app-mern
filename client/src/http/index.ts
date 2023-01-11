import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 2000,
});

let refresh = false;

axiosClient.interceptors.response.use(
  (resp) => resp,
  async (err) => {
    if (err.response.status === 401 && !refresh) {
      refresh = true;

      const resp = await axiosClient.post("/auth/refresh");

      if (resp.status === 200) {
        axios.defaults.headers.common[
          "authorization"
        ] = `Bearer ${resp.data.accessToken}`;

        return axios(err.config);
      }
    }

    refresh = false;

    return err;
  }
);

export const fetchAllContacts = async () => await axiosClient.get("/contacts");

export default axiosClient;
