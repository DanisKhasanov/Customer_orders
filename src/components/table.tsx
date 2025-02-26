import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { OrderItems } from "./orderItems";

interface TableProps {
  tableData: OrderData[];
  loading: boolean;
}

interface OrderData {
  orderNumber: string; // Номер заказа
  date: string; // Дата
  counterparty: string; // Контрагент
  counterpartyPhone: string; // Тел. контрагента
  paid: number; // Оплачено
  salesChannel: string; // Канал продаж
  isNewClient: string; // Новый клиент
  createdRequest: string; // Завел заявку
  requestAttached: string; // Заявка закреплена
  clientAttached: string; // Клиент закреплен
  deliveryMethodNew: string; // Способ доставки NEW
  trackingNumber: string; // Трек-номер
  items: {
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }[]; // Товары
}

const Table = ({ tableData, loading }: TableProps) => {
  const columns = useMemo<MRT_ColumnDef<OrderData>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Номер заказа",
        size: 70,
      },
      {
        accessorKey: "date",
        header: "Дата",
        size: 50,
      },
      {
        accessorKey: "counterparty",
        header: "Контрагент",
        size: 150,
      },
      {
        accessorKey: "counterpartyPhone",
        header: "Тел. контрагента",
        size: 80,
      },
      {
        accessorKey: "paid",
        header: "Оплачено",
        size: 60,
      },
      {
        accessorKey: "salesChannel",
        header: "Канал продаж",
        size: 75,
      },
      {
        accessorKey: "isNewClient",
        header: "Новый клиент",
        size: 80,
      },
      {
        accessorKey: "createdRequest",
        header: "Завел заявку",
        size: 100,
      },
      {
        accessorKey: "requestAttached",
        header: "Заявка закреплена",
        size: 100,
      },
      {
        accessorKey: "clientAttached",
        header: "Клиент закреплен",
        size: 100,
      },
      {
        accessorKey: "deliveryMethodNew",
        header: "Способ доставки NEW",
        size: 70,
      },
      {
        accessorKey: "trackingNumber",
        header: "Трек-номер",
        size: 60,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state: { isLoading: loading },
    layoutMode: "grid",
    enableColumnActions: false,
    enableTopToolbar: false,
    localization: MRT_Localization_RU,
    paginationDisplayMode: "pages",
    muiTableHeadCellProps: {
      sx: {
        fontSize: "12px",
      },
    },

    muiPaginationProps: {
      color: "primary",
      showRowsPerPage: false,
      variant: "outlined",
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "12px",
        borderBottom: "1px solid lightgray",
      },
    },
    muiTableContainerProps: {
      sx: {
        height: "53vh",
      },
    },
    renderDetailPanel: ({ row }) => {
      const itemDetails = row.original.items;
      return <OrderItems itemDetails={itemDetails} />;
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Table;
