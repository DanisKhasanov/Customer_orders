import { Dayjs } from "dayjs";

export interface FormValues {
  co_name: string[] ; // Номер заказа
  cp_name: string[]; // Контрагент (имя)
  cp_phone: string[]; // Телефон контрагента
  co_moment_begin: Dayjs | null; // Дата начала
  co_moment_end: Dayjs | null; // Дата окончания
  "Завел заявку": string[];
  "Заявка закреплена": string[];
  "Клиент закреплен": string[];
  order_status: string[];
  shipmentAddress: string[];
  "Новый клиент": string[];
  salesChannel_name: string[];
  closing_application: string[];
  [key: string]: string[] | Dayjs | null; 
}
