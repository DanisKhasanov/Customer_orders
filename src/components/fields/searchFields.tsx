import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Autocomplete,
  Chip,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getAutoComplete, postData } from "@/api/api";
import {
  autoCompleteName,
  initialValues,
  russianLocale,
  CleanObject,
  getToday,
} from "@/helpers/index";
import { FormValues, SearchFieldsProps } from "@/props/index";
import { CustomButtons } from "../button/customButtons";
import useCustomSnackbar from "@/hooks/useCustomSnackbar";
import { AddedSearchFields } from "./addedSearchFields";
import { CustomAutocomplete } from "../autocomplete/customAutocomplete";

const SearchFields = ({ setTableData, setLoading }: SearchFieldsProps) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const { showSnackbar } = useCustomSnackbar();
  const [cpOptions, setCpOptions] = useState<{ name: string; phone: string }[]>(
    []
  );
  const [cpLoading, setCpLoading] = useState(false);
  const [noOptionsMessage, setNoOptionsMessage] = useState<string>("");
  const [addFields, setAddFields] = useState(false);

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

  const handleDelete = () => {
    setFormValues(initialValues);
  };

  const fetchAutoComplete = useCallback(
    async (query: string, field: "cp_name" | "cp_phone") => {
      if (query.length < 3) return;
      setCpLoading(true);
      setNoOptionsMessage("");
      try {
        const response = await getAutoComplete(query, field);
        if (!response.length) {
          setCpOptions([]);
          setNoOptionsMessage("Контрагенты не найдены");
          return;
        }
        setCpOptions(
          response.map(([key, value]) =>
            field === "cp_name"
              ? { name: key, phone: value }
              : { name: value, phone: key }
          )
        );
      } catch {
        showSnackbar("Ошибка при загрузке контрагентов", { variant: "error" });
      } finally {
        setCpLoading(false);
      }
    },
    []
  );

  const handleCpChange =
    (key: "cp_name" | "cp_phone") => (_: any, newValue: any) => {
      setFormValues((prev) => {
        const updatedValues = newValue.map((item: any) => item[key.slice(3)]);
        return { ...prev, [key]: updatedValues };
      });
    };

  const handleArrayChange =
    (key: keyof FormValues) => (_: any, newValue: any) => {
      setFormValues((prev) => ({
        ...prev,
        [key]: newValue,
      }));
    };

  const handleDateChange = (key: keyof FormValues) => (date: any) => {
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
        borderBottom: 2,
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
          <CustomAutocomplete
            label="Номер заказа"
            options={[]}
            value={formValues.co_name}
            onChange={handleArrayChange("co_name")}
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
            {["co_moment_begin", "co_moment_end"].map((field, i) => (
              <DatePicker
                key={field}
                sx={{ width: "50%" }}
                label={i ? "Дата окончания" : "Дата начала"}
                value={formValues[field]}
                onChange={handleDateChange(field)}
                format="DD/MM/YYYY"
                minDate={i ? formValues.co_moment_begin : undefined}
                slotProps={{ textField: { size: "small" } }}
              />
            ))}
          </LocalizationProvider>
        </Grid>

        {/* Контрагент и Телефон контрагента */}
        {["cp_name", "cp_phone"].map((field, i) => (
          <Grid key={field} size={{ xs: 12, sm: 6, md: 4 }}>
            <Autocomplete
              multiple
              freeSolo
              size="small"
              loading={cpLoading}
              options={cpOptions}
              noOptionsText={noOptionsMessage}
              getOptionLabel={(option) =>
                `${option[i ? "phone" : "name"]} (${
                  option[i ? "name" : "phone"]
                })`
              }
              filterSelectedOptions
              value={formValues[field].map((val) => ({
                [i ? "phone" : "name"]: val,
                [i ? "name" : "phone"]: "",
              }))}
              onInputChange={(_, value) => fetchAutoComplete(value, field)}
              onChange={handleCpChange(field ) }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    label={option[i ? "phone" : "name"]}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={i ? "Телефон контрагента" : "Контрагент"}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: cpLoading && (
                      <CircularProgress color="inherit" size={20} />
                    ),
                  }}
                />
              )}
            />
          </Grid>
        ))}

        {/* Завел заявку, Заявка закреплена, Клиент закреплен */}
        {["Завел заявку", "Заявка закреплена", "Клиент закреплен"].map(
          (field, index) => (
            <Grid
              key={field}
              size={{ xs: 12, sm: 6, md: index === 2 ? 2.6 : 2.7 }}
            >
              <CustomAutocomplete
                label={field}
                options={autoCompleteName}
                value={formValues[field as keyof FormValues]}
                onChange={handleArrayChange(field as keyof FormValues)}
              />
            </Grid>
          )
        )}
        {/* Дополнительные поля */}
        {/* <Collapse timeout={500} in={addFields} sx={{ width: "100%" }}> */}
        {/* {addFields && ( */}
        {/* <Grid
              container
              spacing={{ xs: 2, md: 1 }}
              columns={{ xs: 4, md: 8 }}
            > */}
        <AddedSearchFields
          formValues={formValues}
          handleArrayChange={handleArrayChange}
        />
        {/* </Grid> */}
        {/* )} */}
        {/* </Collapse> */}
      </Grid>

      <CustomButtons
        handleSearch={handleSearch}
        handleDelete={handleDelete}
        setAddFields={setAddFields}
        addFields={addFields}
      />
    </Box>
  );
};

export default SearchFields;
