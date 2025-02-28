export interface FormValues {
  co_name: string[]; // Номер заказа
  cp_name: string[]; // Контрагент (имя)
  cp_phone: string[]; // Телефон контрагента
  co_moment_begin: any; // Дата начала
  co_moment_end: any; // Дата окончания
  "Завел заявку": string[];
  "Заявка закреплена": string[];
  "Клиент закреплен": string[];
}
