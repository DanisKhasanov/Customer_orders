import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Autocomplete,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { debounce } from "@mui/material/utils";
import { getAutoComplete, postData } from "@/api/api";
import {
  autoCompleteName,
  initialValues,
  russianLocale,
  CleanObject,
  getToday,
  emptyFields,
} from "@/helpers/index";
import useCustomSnackbar from "@/hooks/useCustomSnackbar";
import { FormValues, SearchFieldsProps } from "@/props/index";
import { CustomButtons } from "../button/customButtons";
import { AddedSearchFields } from "./addedSearchFields";
import { CustomAutocomplete } from "../autocomplete/customAutocomplete";

const SearchFields = ({ setTableData, setLoading }: SearchFieldsProps) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const { showSnackbar } = useCustomSnackbar();
  const [cpOptions, setCpOptions] = useState<{ name: string; phone: string }[]>(
    []
  );
  const [productOptions, setProductOptions] = useState<
    { shortName: string; fullName: string }[]
  >([]);
  const [loadingStates, setLoadingStates] = useState({
    cp_name: false,
    cp_phone: false,
    assortment: false,
  });
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

  const handleDelete = () => {
    setFormValues(initialValues);
  };

  const fetchAutoComplete = debounce(
    useCallback(
      async (query: string, field: "cp_name" | "cp_phone" | "assortment") => {
        setLoadingStates((prev) => ({ ...prev, [field]: true }));
        setNoOptionsMessage("");
        try {
          const response = await getAutoComplete(query, field);

          if (field === "assortment") {
            // Для товаров сохраняем оба варианта названия
            setProductOptions(
              response.map(([shortName, fullName]) => ({
                shortName,
                fullName,
              }))
            );
          } else {
            setCpOptions(
              response.map(([key, value]) =>
                field === "cp_name"
                  ? { name: key, phone: value }
                  : { name: value, phone: key }
              )
            );
          }

          if (!response.length) {
            setNoOptionsMessage("Ничего не найдено");
          }
        } catch {
          showSnackbar("Ошибка при загрузке данных", { variant: "error" });
        } finally {
          setLoadingStates((prev) => ({ ...prev, [field]: false }));
        }
      },
      []
    ),
    300
  );

  const handleCpChange =
    (key: "cp_name" | "cp_phone" | "assortment") => (_: any, newValue: any) => {
      setFormValues((prev) => ({
        ...prev,
        [key]: newValue.map((item: any) =>
          key === "assortment"
            ? typeof item === "string"
              ? item
              : item.shortName
            : item[key.slice(3)]
        ),
      }));
    };

  const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/\D/g, "");
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
    const res = emptyFields(formValues);

    if (!res) {
      showSnackbar("Пожалуйста, заполните хотя бы одно поле", {
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const formattedValues = {
        ...formValues,
        co_moment_begin: formValues.co_moment_begin
          ? formValues.co_moment_begin.format("YYYY-MM-DD HH:mm:ss")
          : null,
        co_moment_end: formValues.co_moment_end
          ? formValues.co_moment_end.format("YYYY-MM-DD 23:59:59")
          : null,
      };
      if (formattedValues.co_moment_end && !formattedValues.co_moment_begin) {
        showSnackbar("Сначала выберите дату начала", {
          variant: "error",
        });
        return;
      }
      const cleanedValues = CleanObject(formattedValues);

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

  const handlePaste = (
    event: React.ClipboardEvent<HTMLDivElement>,
    field: "cp_name" | "cp_phone" | "assortment"
  ) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text").trim();

    const pastedItems =
      field === "assortment"
        ? [pastedText]
        : pastedText.split(/[\n,]+/).filter(Boolean);

    setFormValues((prev) => ({
      ...prev,
      [field]: [...new Set([...(prev[field] || []), ...pastedItems])],
    }));
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
                value={formValues[field as keyof FormValues]}
                onChange={handleDateChange(field as keyof FormValues)}
                format="DD/MM/YYYY"
                minDate={i ? formValues.co_moment_begin : undefined}
                slotProps={{ textField: { size: "small" } }}
              />
            ))}
          </LocalizationProvider>
        </Grid>

        {/* Контрагент и Телефон контрагента */}
        {(["cp_name", "cp_phone"] as const).map((field, i) => (
          <Grid key={field} size={{ xs: 12, sm: 6, md: 2.7 }}>
            <Autocomplete
              multiple
              freeSolo
              autoComplete
              filterOptions={(x) => x}
              size="small"
              loading={loadingStates[field]}
              options={cpOptions}
              noOptionsText={noOptionsMessage}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return `${option[i ? "phone" : "name"]} (${
                  option[i ? "name" : "phone"]
                })`;
              }}
              filterSelectedOptions
              value={formValues[field].map((val: string) => ({
                [i ? "phone" : "name"]: val,
                [i ? "name" : "phone"]: "",
              }))}
              onInputChange={(_, value) => {
                if (value.trim().length >= 3) {
                  const cleanedValue =
                    field === "cp_phone" ? cleanPhoneNumber(value) : value;
                  fetchAutoComplete(cleanedValue, field);
                }
              }}
              onChange={handleCpChange(field)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option[i ? "phone" : "name"]}
                      size="small"
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={i ? "Телефон контрагента" : "Контрагент"}
                  onPaste={(e) => handlePaste(e, field)}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingStates[field] && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
        ))}

        {/* Товары или группа */}
        <Grid size={{ xs: 12, sm: 6, md: 2.6 }}>
          <Autocomplete
            multiple
            freeSolo
            autoComplete
            filterOptions={(x) => x}
            size="small"
            loading={loadingStates.assortment}
            options={productOptions}
            noOptionsText={noOptionsMessage}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.fullName; // Показываем полное название
            }}
            filterSelectedOptions
            value={formValues.assortment.map((val: string) => {
              const foundOption = productOptions.find(
                (opt) => opt.shortName === val
              );
              return foundOption || val;
            })}
            onInputChange={(_, value) => {
              if (value.trim().length >= 3) {
                fetchAutoComplete(value, "assortment");
              }
            }}
            onChange={handleCpChange("assortment")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                const label =
                  typeof option === "string" ? option : option.shortName;
                return (
                  <Chip key={key} label={label} size="small" {...tagProps} />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Товар или группа"
                onPaste={(e) => handlePaste(e, "assortment")}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingStates.assortment && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  },
                }}
              />
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
              <CustomAutocomplete
                label={field}
                options={autoCompleteName}
                value={
                  Array.isArray(formValues[field]) ? formValues[field] : []
                }
                onChange={handleArrayChange(field as keyof FormValues)}
              />
            </Grid>
          )
        )}

        {/* Дополнительные поля */}
        <AddedSearchFields
          formValues={formValues}
          handleArrayChange={handleArrayChange}
        />
      </Grid>

      <CustomButtons handleSearch={handleSearch} handleDelete={handleDelete} />
    </Box>
  );
};

export default SearchFields;
