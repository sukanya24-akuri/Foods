import axios from "axios";
import { data } from "react-router-dom";

const API_URl = "http://localhost:8081/api";
export const regisetredUser = async (data) => {
  try {
    const response = await axios.post(API_URl + "/register", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const loggedUser = async (data) => {
  try {
    const response = await axios.post(API_URl + "/login", data);
    return response;
  } catch (error) {
    throw error;
  }
};
