import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const style = {
  fontSize: "12px",
};

export const OrderItems = ({ itemDetails }) => {
  return (
    <TableContainer sx={{ width: "93vw" }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
            <TableCell sx={style}>Наименование</TableCell>
            <TableCell sx={style}>Кол-во</TableCell>
            <TableCell sx={style}>Ед.изм.</TableCell>
            <TableCell sx={style}>Цена</TableCell>
            <TableCell sx={style}>Сумма</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemDetails.map((item, index) => (
            <TableRow key={index}>
              <TableCell sx={style}>{item.name}</TableCell>
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
