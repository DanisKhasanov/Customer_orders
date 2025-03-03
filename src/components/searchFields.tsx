import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import { Box, Autocomplete, Chip, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getAutoComplete, postData } from "@/api/api";
import {
  autoCompleteName,
  initialValues,
  russianLocale,
} from "@/helpers/index";
import { FormValues, SearchFieldsProps } from "@/props/index";
import { CustomButtons } from "./customButtons";
import useCustomSnackbar from "@/hooks/useCustomSnackbar";
import { CleanObject } from "@/helpers/cleanObject";
import { getToday } from "@/helpers/getToday";

const SearchFields = ({ setTableData, setLoading }: SearchFieldsProps) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const { showSnackbar } = useCustomSnackbar();
  const [errors, setErrors] = useState(false);
  const [cpOptions, setCpOptions] = useState<{ name: string; phone: string }[]>(
    []
  );
  const [cpLoading, setCpLoading] = useState(false);
  const [noOptionsMessage, setNoOptionsMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const formValues = {
        co_moment_begin: getToday(),
      };
      try {
        const response = await postData(formValues);

        setTableData(response);
        showSnackbar("Сегодняшняя заказы успешно получены 😊", {
          variant: "success",
        });
      } catch {
        showSnackbar("Ошибка при получении данных для таблицы 😞", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAutoComplete = async (query: string) => {
    if (query.length < 3) return;
    setCpLoading(true);
    setNoOptionsMessage("");
    try {
      const response = await getAutoComplete(query, "cp_name");
      if (response.length === 0) {
        setCpOptions([]);
        setNoOptionsMessage("Контрагенты не найдены");
        return;
      }

      setCpOptions(
        response.map(([name, phone]: [string, string]) => ({ name, phone }))
      );
    } catch {
      showSnackbar("Ошибка при загрузке контрагентов", { variant: "error" });
    } finally {
      setCpLoading(false);
    }
  };

  const fetchPhoneAutoComplete = async (query: string) => {
    if (query.length < 3) return;
    setCpLoading(true);
    setNoOptionsMessage("");
    try {
      const response = await getAutoComplete(query, "cp_phone"); // Запрос по телефону
      if (response.length === 0) {
        setCpOptions([]);
        setNoOptionsMessage("Контрагенты не найдены");
        return;
      }

      setCpOptions(
        response.map(([phone, name]: [string, string]) => ({ phone, name }))
      );
    } catch {
      showSnackbar("Ошибка при загрузке контрагентов", { variant: "error" });
    } finally {
      setCpLoading(false);
    }
  };

  const handleDelete = () => {
    setFormValues(initialValues);
  };

  const handleArrayChange = (key: keyof FormValues) => (_, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleCpChange = (_, newValue) => {
    setFormValues((prev) => {
      // Получаем новые имена и их соответствующие телефоны
      const newNames = newValue.map((item) => item.name);
      const newPhones = newNames.map(
        (name) => cpOptions.find((opt) => opt.name === name)?.phone || ""
      );

      // Объединяем старые телефоны с новыми (если они еще не добавлены)
      const updatedPhones = [...prev.cp_phone];
      newNames.forEach((name, index) => {
        const existingIndex = prev.cp_name.indexOf(name);
        if (existingIndex === -1) {
          updatedPhones.push(newPhones[index]);
        }
      });

      return {
        ...prev,
        cp_name: newNames,
        cp_phone: updatedPhones.slice(0, newNames.length), // Синхронизируем длину массивов
      };
    });
  };
  const handleCpPhoneChange = (_, newValue) => {
    setFormValues((prev) => {
      // Получаем новые имена и их соответствующие телефоны
      const newPhones = newValue.map((item) => item.phone);
      const newNames = newPhones.map(
        (phone) => cpOptions.find((opt) => opt.phone === phone)?.name || ""
      );

      // Объединяем старые телефоны с новыми (если они еще не добавлены)
      const updatedPhones = [...prev.cp_name];
      newPhones.forEach((name, index) => {
        const existingIndex = prev.cp_phone.indexOf(name);
        if (existingIndex === -1) {
          updatedPhones.push(newNames[index]);
        }
      });

      return {
        ...prev,
        cp_phone: newPhones,
        cp_name: newNames.slice(0, newPhones.length),
      };
    });
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
        mb: 3,
        borderBottom: 3,
        borderColor: "lightgrey",
      }}
    >
      <Grid
        container
        mb={1}
        spacing={{ xs: 2, md: 1 }}
        columns={{ xs: 4, md: 8 }}
      >
        {/* Номер заказа */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            size="small"
            options={[]}
            freeSolo
            multiple
            value={formValues.co_name}
            onChange={handleArrayChange("co_name")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip size="small" label={option} {...getTagProps({ index })} />
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
                  size: "small",
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
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Контрагент */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            loading={cpLoading}
            options={cpOptions.length > 0 ? cpOptions : []}
            noOptionsText={noOptionsMessage}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.name} (${option.phone})`
            }
            filterSelectedOptions
            value={formValues.cp_name.map((name) => ({ name, phone: "" }))}
            onInputChange={(_, value) => fetchAutoComplete(value)}
            onChange={handleCpChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Контрагент"
                fullWidth
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cpLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps?.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Телефон контрагента */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            loading={cpLoading}
            options={cpOptions.length > 0 ? cpOptions : []}
            noOptionsText={noOptionsMessage}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.phone} (${option.name})`
            }
            filterSelectedOptions
            value={formValues.cp_phone.map((phone) => ({ name: "", phone }))}
            onInputChange={(_, value) => fetchPhoneAutoComplete(value)}
            onChange={handleCpPhoneChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.phone}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Телефон контрагента"
                fullWidth
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cpLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps?.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          {/* <Autocomplete
            size="small"
            freeSolo
            options={[]}
            multiple
            value={formValues.cp_phone}
            onChange={handleArrayChange("cp_phone")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip size="small" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Телефон контрагента" fullWidth />
            )}
          /> */}
        </Grid>

        {/* Завел заявку, Заявка закреплена, Клиент закреплен */}
        {["Завел заявку", "Заявка закреплена", "Клиент закреплен"].map(
          (field, index) => (
            <Grid
              key={field}
              size={{ xs: 12, sm: 6, md: index === 2 ? 2.6 : 2.7 }}
            >
              <Autocomplete
                size="small"
                disablePortal
                options={autoCompleteName}
                multiple
                noOptionsText="Сотрудник не найден"
                value={autoCompleteName.filter((option) =>
                  formValues[field as keyof FormValues]?.includes(option || "")
                )}
                onChange={handleArrayChange(field as keyof FormValues)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option}
                      {...getTagProps({ index })}
                    />
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
