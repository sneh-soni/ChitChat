import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + `/api/v1/admin/admin-login`,
      { secretKey },
      config
    );

    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + `/api/v1/admin/`,
      { withCredentials: true }
    );

    return data.admin;
  } catch (error) {
    throw error.response.data.message;
  }
});

const adminLogout = createAsyncThunk("admin/logout", async () => {
  try {
    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + `/api/v1/admin/admin-logout`,
      { withCredentials: true }
    );

    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

export { adminLogin, getAdmin, adminLogout };
