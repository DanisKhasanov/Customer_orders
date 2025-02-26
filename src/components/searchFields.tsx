import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { russianLocale } from "@/helpers/russianLocale";
import { postData } from "@/api/api";

const SearchFields = ({ setTableData, setLoading }) => {
  const [formValues, setFormValues] = useState({});

  const handleDelete = () => {
    setFormValues({
      orderNumber: "",
      periodStart: "",
      periodEnd: "",
      contractor: "",
      contractorPhone: "",
      createdBy: "",
      assingedTo: "",
      clientAssignedTo: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await postData(formValues);
      setTableData(response);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 2,
        borderBottom: 4,
        borderColor: "lightblue",
      }}
    >
      <Grid
        container
        mb={2}
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 4, sm: 8, md: 8 }}
      >
        {/*  Номер заказа и Период */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Номер заказа"
            name="orderNumber"
            // value={formValues.orderNumber}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="ru"
            localeText={russianLocale}
          >
            <DatePicker sx={{ width: "30vw" }} label="Дата начала" />
            <DatePicker sx={{ width: "30vw" }} label="Дата окончания" />
          </LocalizationProvider>
        </Grid>

        {/* Контрагент и Телефон контрагента */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Контрагент"
            name="contractor"
            // value={formValues.contractor}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Телефон контрагента"
            name="contractorPhone"
            // value={formValues.contractorPhone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Данные о заявке */}
        <Grid size={{ xs: 12, sm: 6, md: 2.7 }}>
          <TextField
            label="Завел заявку"
            name="createdBy"
            // value={formValues.createdBy}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.7 }}>
          <TextField
            label="Заявка закреплена"
            name="assingedTo"
            // value={formValues.assingedTo}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.6 }}>
          <TextField
            label="Клиент закреплен"
            name="clientAssignedTo"
            // value={formValues.clientAssignedTo}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          mt: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ textTransform: "none", flex: 1 }}
          >
            Поиск
          </Button>

          <Button
            variant="outlined"
            onClick={handleDelete}
            sx={{ textTransform: "none", flex: 1 }}
          >
            Сбросить
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchFields;
