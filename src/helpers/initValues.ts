import { FormValues } from "@/props";

export const initialValues: FormValues = {
  co_name: [], // Номер заказа
  cp_name: [], // Контрагент (имя)
  cp_phone: [], // Телефон контрагента
  co_moment_begin: null, // Дата начала
  co_moment_end: null, // Дата окончания
  "Завел заявку": [],
  "Заявка закреплена": [],
  "Клиент закреплен": [],
  order_status: [], // Статус заказа
  shipmentAddress: [], // Адрес доставки
  "Новый клиент": [], // Новый клиент
  salesChannel_name: [], // Канал продаж
  closing_application: [], // Причины закрытия заявки
  assortment: [],
};