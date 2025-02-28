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
  return (
    <TableContainer
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Table size="small" sx={{ width: "90vw" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>
              Наименование
            </TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Колличество</TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Ед.изм.</TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Цена</TableCell>
            <TableCell sx={{ ...style, fontWeight: "bold" }}>Сумма</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemDetails.map((item, index) => (
            <TableRow key={index}>
              <TableCell sx={style}>{`${item.code} ${item.name}`}</TableCell>
              <TableCell sx={style}> {item.quantity}</TableCell>
              <TableCell sx={style}>{item.unit}</TableCell>
              <TableCell sx={style}>{item.price} руб.</TableCell>
              <TableCell sx={style}>{item.total} руб.</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
