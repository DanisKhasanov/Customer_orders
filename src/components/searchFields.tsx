import { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import { Box, Autocomplete, Chip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { postData } from "@/api/api";
import {
  autoCompleteName,
  initialValues,
  russianLocale,
} from "@/helpers/index";
import { FormValues, SearchFieldsProps } from "@/props/index";
import { CustomButtons } from "./customButtons";
import useCustomSnackbar from "@/hooks/useCustomSnackbar";
import { CleanObject } from "@/helpers/cleanObject";

const SearchFields = ({ setTableData, setLoading }: SearchFieldsProps) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const { showSnackbar } = useCustomSnackbar();
  const [errors, setErrors] = useState(false);

  const handleDelete = () => {
    setFormValues(initialValues);
  };

  const handleChange = (key: keyof FormValues) => (_, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleArrayChange = (key: keyof FormValues) => (_, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: (newValue || []).map((item) => item.label),
    }));
  };

  const handleDateChange = (key: keyof FormValues) => (date) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: date,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      // Форматируем даты
      const formattedValues = {
        ...formValues,
        co_moment_begin: formValues.co_moment_begin
          ? formValues.co_moment_begin.format("YYYY-MM-DD HH:mm:ss")
          : null,
        co_moment_end: formValues.co_moment_end
          ? formValues.co_moment_end.format("YYYY-MM-DD HH:mm:ss")
          : null,
      };
      if (formattedValues.co_moment_end && !formattedValues.co_moment_begin) {
        showSnackbar("Сначала выберите дату начала", {
          variant: "error",
        });
        setErrors(true);
        return;
      }
      // Очищаем объект от пустых значений
      const cleanedValues = CleanObject(formattedValues);

      // Отправляем только заполненные данные
      const response = await postData(cleanedValues);
      setTableData(response);
    } catch {
      showSnackbar("Ошибка при получении данных для таблицы", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 2,
        borderBottom: 3,
        borderColor: "lightgrey",
      }}
    >
      <Grid
        container
        mb={2}
        spacing={{ xs: 2, md: 1 }}
        columns={{ xs: 4, md: 8 }}
      >
        {/* Номер заказа */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            options={[]}
            freeSolo
            multiple
            value={formValues.co_name}
            onChange={handleChange("co_name")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField label="Номер заказа" type="number" {...params} />
            )}
          />
        </Grid>

        {/* Период */}
        <Grid
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={russianLocale}
          >
            <DatePicker
              sx={{ width: "50%" }}
              label="Дата начала"
              value={formValues.co_moment_begin}
              onChange={handleDateChange("co_moment_begin")}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  error: errors,
                },
              }}
            />
            <DatePicker
              sx={{ width: "50%" }}
              label="Дата окончания"
              value={formValues.co_moment_end}
              onChange={handleDateChange("co_moment_end")}
              format="DD/MM/YYYY"
              minDate={formValues.co_moment_begin}
            />
          </LocalizationProvider>
        </Grid>

        {/* Контрагент */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            freeSolo
            options={[]}
            multiple
            value={formValues.cp_name}
            onChange={handleChange("cp_name")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Контрагент" fullWidth />
            )}
          />
        </Grid>

        {/* Телефон контрагента */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            freeSolo
            options={[]}
            multiple
            value={formValues.cp_phone}
            onChange={handleChange("cp_phone")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Телефон контрагента" fullWidth />
            )}
          />
        </Grid>

        {/* Завел заявку, Заявка закреплена, Клиент закреплен */}
        {["Завел заявку", "Заявка закреплена", "Клиент закреплен"].map(
          (field, index) => (
            <Grid
              key={field}
              size={{ xs: 12, sm: 6, md: index === 2 ? 2.6 : 2.7 }}
            >
              <Autocomplete
                disablePortal
                options={autoCompleteName}
                multiple
                noOptionsText="Сотрудник не найден"
                value={autoCompleteName.filter((option) =>
                  formValues[field as keyof FormValues]?.includes(
                    option.label || ""
                  )
                )}
                onChange={handleArrayChange(field as keyof FormValues)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.label} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label={field} fullWidth />
                )}
              />
            </Grid>
          )
        )}
      </Grid>

      <CustomButtons handleSearch={handleSearch} handleDelete={handleDelete} />
    </Box>
  );
};

export default SearchFields;
