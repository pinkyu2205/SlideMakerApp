import axios from "axios";

const API_BASE = "https://localhost:7259/api/generation";

export const generateStandardSlides = async (payload) => {
  return axios.post(`${API_BASE}/generate-pptx`, payload, {
    responseType: "blob", // IMPORTANT: receive file
  });
};

export const generateFromPptxTemplate = async (payload) => {
  return axios.post(`${API_BASE}/generate-from-pptx-template`, payload, {
    responseType: "blob",
  });
};
