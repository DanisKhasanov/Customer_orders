import axios from "axios";

const URL_API = import.meta.env.VITE_DOMEN;

const api = axios.create({
  baseURL: URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const test = [
  {
    orderNumber: "59656",
    date: "25.02.2025",
    counterparty: "Абдурахимова Диана Шавкатовна",
    counterpartyPhone: "+7 999-456-79-90",
    paid: 5500,
    salesChannel: "WhatsApp",
    isNewClient: "Нет",
    createdRequest: "05. Евдакимова Ольга",
    requestAttached: "05. Евдакимова Ольга",
    clientAttached: "05. Евдакимова Ольга",
    deliveryMethodNew: "Сдэк",
    trackingNumber: "AB123456789",
    items: [
      {
        name: "K010-175X45X20:BA RED Коробка 175х45х20 мм (красный)",
        quantity: 5,
        unit: "шт",
        price: 41.83,
        total: 209.15,
      },
      {
        name: 'PR213-13x21:BI Пакет "Роза" 13х21 (кратно 50)',
        quantity: 50,
        unit: "шт",
        price: 2.65,
        total: 132.5,
      },
    ],
  },
  {
    orderNumber: "59657",
    date: "15.01.2025",
    counterparty: "Абдурахимова Диана Шавкатовна",
    counterpartyPhone: "+7 999-456-79-90",
    paid: 6500,
    salesChannel: "WhatsApp",
    isNewClient: "Нет",
    createdRequest: "05. Евдакимова Ольга",
    requestAttached: "05. Евдакимова Ольга",
    clientAttached: "05. Евдакимова Ольга",
    deliveryMethodNew: "Сдэк",
    trackingNumber: "AB123456789",
    items: [
      {
        name: "K010-175X45X20:BA RED Коробка 175х45х20 мм (красный)",
        quantity: 15,
        unit: "шт",
        price: 41.83,
        total: 209.15,
      },
      {
        name: 'PR213-13x21:BI Пакет "Роза" 13х21 (кратно 50)',
        quantity: 20,
        unit: "шт",
        price: 2.65,
        total: 132.5,
      },
    ],
  },
];

export const postData = async (formValues) => {
    console.log(formValues);
  try {
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(test);
      }, 2000);
    });
    return response;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};
