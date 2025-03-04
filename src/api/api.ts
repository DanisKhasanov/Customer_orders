import axios from "axios";

const URL_API = import.meta.env.VITE_DOMEN;

const api = axios.create({
  baseURL: URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const postData = async (formValues: any) => {
  try {
    console.log(formValues);
    const response = await api.post("/orders/", formValues);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const getAutoComplete = async (q: string, field: string) => {
  try {
    const response = await api.get("/autocomplete/", {
      params: {
        q,
        field,
      },
    });
    return Array.isArray(response.data) ? response.data.slice(0, 10) : [];
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};
