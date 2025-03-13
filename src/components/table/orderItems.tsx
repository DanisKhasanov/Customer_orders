import { formatPrice, style } from "@/helpers/index";
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
  const totalPrice = itemDetails.reduce(
    (sum: number, item: any) => sum + Number(item.total),
    0
  );

  return (
    <TableContainer
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid lightgray",
        width: "60vw",
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
                {formatPrice(Number(item.price))}
              </TableCell>
              <TableCell sx={style}>
                {formatPrice(Number(item.total))}
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: "#f4f4f4", fontWeight: "bold" }}>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Итого:</TableCell>
            <TableCell sx={style}>{totalQuantity}</TableCell>
            <TableCell sx={style}></TableCell>
            <TableCell sx={style}></TableCell>
            <TableCell sx={style}>{formatPrice(totalPrice)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
