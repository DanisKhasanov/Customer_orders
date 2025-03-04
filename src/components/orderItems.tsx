import { style } from "@/helpers/styleFontSize";
import { OrderItemsProps } from "@/props/orderItemsProps";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const OrderItems = ({ itemDetails }: OrderItemsProps) => {
  const totalQuantity = itemDetails.reduce(
    (sum: number, item: any) => sum + Number(item.quantity),
    0
  );
  const totalPrice = itemDetails
    .reduce((sum: number, item: any) => sum + Number(item.total), 0)
    .toFixed(2);

  return (
    <TableContainer
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid lightgray",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f4f4f4",
              color: "black",
            }}
          >
            <TableCell sx={{ ...style, fontWeight: "bold" }}>
              Наименование
            </TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>
              Количество
            </TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Ед.изм.</TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Цена</TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Сумма</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemDetails.map((item: any, index: number) => (
            <TableRow key={index}>
              <TableCell sx={style}>{`${item.code} ${item.name}`}</TableCell>
              <TableCell sx={style}>{item.quantity}</TableCell>
              <TableCell sx={style}>{item.unit}</TableCell>
              <TableCell sx={style}>
                {Number(item.price).toFixed(2)} руб.
              </TableCell>
              <TableCell sx={style}>
                {Number(item.total).toFixed(2)} руб.
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: "#f4f4f4", fontWeight: "bold" }}>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Итого:</TableCell>
            <TableCell sx={style}>{totalQuantity}</TableCell>
            <TableCell sx={style}></TableCell>
            <TableCell sx={style}></TableCell>
            <TableCell sx={style}>{totalPrice} руб.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
