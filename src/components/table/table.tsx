import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { OrderItems } from "./orderItems";
import { OrderData, TableProps } from "@/props/index";
import dayjs from "dayjs";

const Table = ({ tableData, loading }: TableProps) => {
  const totalOrders = tableData.length;
  const totalPaid = useMemo(() => {
    return tableData.reduce((sum, row) => sum + (row.payedSum || 0), 0);
  }, [tableData]);

  const columns = useMemo<MRT_ColumnDef<OrderData>[]>(
    () => [
      {
        accessorKey: "co_name",
        header: "Номер",
        size: 50,
        Footer: () => <>Всего: {totalOrders}</>,
      },
      {
        accessorKey: "co_moment",
        header: "Дата",
        Cell: ({ cell }) =>
          dayjs(cell.getValue() as string).format("DD.MM.YYYY HH:mm"),
        size: 80,
      },
      {
        accessorKey: "cp_name",
        header: "Контрагент",
        size: 150,
      },
      {
        accessorKey: "cp_phone",
        header: "Телефон",
        size: 100,
      },
      {
        accessorKey: "payedSum",
        header: "Оплачено",
        Cell: ({ cell }) => {
          const value = cell.getValue() as number;
          return `${(value / 100).toFixed(2)} р.`;
        },
        size: 50,
        Footer: () => <>{`${(totalPaid / 100).toFixed(2)} р.`}</>,
      },
      {
        accessorKey: "salesChannel_name",
        header: "Канал продаж",
        size: 50,
      },
      {
        accessorKey: "co_attribures.Новый клиент",
        header: "Новый клиент",
        size: 50,
      },
      {
        accessorKey: "co_attribures.Завел заявку",
        header: "Завел заявку",
        size: 120,
      },
      {
        accessorKey: "co_attribures.Заявка закреплена",
        header: "Заявка закреплена",
        size: 120,
      },
      {
        accessorKey: "co_attribures.Клиент закреплен",
        header: "Клиент закреплен",
        size: 120,
      },
      {
        accessorKey: "co_attribures.Способ доставки NEW",
        header: "Способ доставки NEW",
        size: 50,
      },
      {
        accessorKey: "co_attribures.Трек-номер",
        header: "Трек-номер",
        size: 50,
      },
    ],
    [totalOrders, totalPaid] // Зависимости для пересчета footer при изменении данных
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    initialState: {
      pagination: { pageSize: 19, pageIndex: 0 },
      density: "compact",
    },
    state: { isLoading: loading },
    enableColumnActions: false,
    enableTopToolbar: false,
    localization: MRT_Localization_RU,
    paginationDisplayMode: "pages",
    muiTableHeadCellProps: {
      sx: {
        fontSize: "14px",
        backgroundColor: "#f4f4f4",
      },
    },
    muiTableFooterCellProps: {
      sx: {
        fontWeight: "bold",
        fontSize: "14px",
        color: "black",
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

    renderDetailPanel: ({ row }) => {
      const itemDetails = row.original.co_positions.map((item) => ({
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        unit: item.uom,
        price: item.price.toFixed(2),
        total: (item.price * item.quantity).toFixed(2),
      }));
      return <OrderItems itemDetails={itemDetails} />;
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Table;
