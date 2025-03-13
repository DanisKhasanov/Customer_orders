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
import { StatusColor, formatPrice } from "@/helpers/index";
import { Box } from "@mui/material";

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
        size: 70,
        Footer: () => <>Всего: {totalOrders}</>,
      },

      {
        accessorKey: "co_moment",
        header: "Дата",
        Cell: ({ cell }) =>
          dayjs(cell.getValue() as string).format("DD.MM.YYYY HH:mm"),
        size: 100,
      },
      {
        accessorKey: "cp_name",
        header: "Контрагент",
        size: 210,
      },
      {
        accessorKey: "cp_phone",
        header: "Телефон",
        size: 100,
      },
      {
        accessorKey: "payedSum",
        header: "Оплачено",
        Cell: ({ cell }) => formatPrice((cell.getValue() as number) / 100),
        size: 100,
        Footer: () => <>{formatPrice(totalPaid / 100)}</>,
      },
      {
        accessorKey: "state_name",
        header: "Статус",
        size: 200,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const backgroundColor = StatusColor[status];
          return (
            <Box
              component="span"
              sx={{
                backgroundColor,
                borderRadius: "0.25rem",
                color: "#fff",
                p: "1px 5px 1px 5px",
              }}
            >
              {status}
            </Box>
          );
        },
      },

      {
        accessorKey: "salesChannel_name",
        header: "Канал продаж",
        size: 130,
      },

      {
        accessorKey: "co_attribures.Новый клиент",
        header: "Новый клиент",
        size: 40,
      },
      {
        accessorKey: "co_attribures.Завел заявку",
        header: "Завел заявку",
        size: 140,
      },
      {
        accessorKey: "co_attribures.Заявка закреплена",
        header: "Заявка закреплена",
        size: 160,
      },
      {
        accessorKey: "co_attribures.Клиент закреплен",
        header: "Клиент закреплен",
        size: 160,
      },
      {
        accessorKey: "co_attribures.Способ доставки NEW",
        header: "Способ доставки",
        size: 150,
      },
      {
        accessorKey: "co_attribures.Трек-номер",
        header: "Трек-номер",
        size: 110,
      },
      {
        accessorKey: "co_attribures.Причина закрытия заявки",
        header: "Причина закрытия заявки",
        size: 210,
      },
      {
        accessorKey: "shipmentAddress",
        header: "Адрес доставки",
        size: 200,
      },
      {
        accessorKey: "co_attribures.Бесплатная доставка",
        header: "Бесплатная доставка",
        size: 180,
      },
    ],
    [totalOrders, totalPaid]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    initialState: {
      pagination: { pageSize: 15, pageIndex: 0 },
      density: "compact",
      sorting: [
        {
          id: "co_name",
          desc: true,
        },
      ],
    },
    state: { isLoading: loading },

    enableFullScreenToggle: false,
    enableColumnResizing: true,
    layoutMode: "grid",
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    // enableTopToolbar: false,
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
