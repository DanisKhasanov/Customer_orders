import Grid from "@mui/material/Grid2";
import {
  autoCompeleteStatus,
  autoCompeleteSalesChannel,
  autoCompeleteNewClient,
  autoCompeleteClosingApplication,
} from "@/helpers/index";
import { AddSearchFieldsProps } from "@/props/addFileds";
import React from "react";
import { CustomAutocomplete } from "../autocomplete/customAutocomplete";

export const AddedSearchFields = React.memo(
  ({ formValues, handleArrayChange }: AddSearchFieldsProps) => {
    const fields = [
      {
        label: "Статус заказа",
        options: autoCompeleteStatus,
        key: "state_name",
      },
      {
        label: "Новый клиент",
        options: autoCompeleteNewClient,
        key: "Новый клиент",
      },
      {
        label: "Канал продаж",
        options: autoCompeleteSalesChannel,
        key: "salesChannel_name",
      },
      {
        label: "Причина закрытия заявки",
        options: autoCompeleteClosingApplication,
        key: "Причина закрытия заявки",
      },
      // { label: "Поиск по товару и группе", options: [], key: "" },
    ];

    return (
      <>
        {fields.map(({ label, options, key }) => (
          <Grid key={key} size={{ xs: 12, sm: 2 }}>
            <CustomAutocomplete
              label={label}
              options={options}
              value={formValues[key as keyof typeof formValues]}
              onChange={handleArrayChange(key as keyof typeof formValues)}
            />
          </Grid>
        ))}
      </>
    );
  }
);
