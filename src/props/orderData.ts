export interface OrderData {
  co_sum: number; // Сумма заказа
  cp_name: string; // Контрагент (имя)
  cp_phone: string; // Телефон контрагента
  payedSum: number; // Оплаченная сумма
  co_moment: string; // Дата заказа
  co_created: string; // Дата создания
  salesChannel_name: string; // Канал продаж
  co_name: string; // Номер заказа
  state_name: string; //Статус заказа
  shipmentAddress: string // Адрес доставки
  co_attribures: {
    Сборщик?: string | null;
    Упаковщик?: string | null;
    "Завел заявку"?: string | null;
    "СПОСОБ ОПЛАТЫ"?: string | null;
    "Клиент закреплен"?: string | null;
    "Заявка закреплена"?: string | null;
    "Способ доставки NEW"?: string | null;
    "Ответственный менеджер"?: string | null;
    "Трек-номер"?: string | null;
    "Новый клиент"?: string | null;
    "Бесплатная доставка"?: string | null;
    "Причина закрытия заявки"?: string | null;
  }; // Дополнительные атрибуты
  co_positions: {
    code: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    uom: string;
  }[]; // Товары
}
