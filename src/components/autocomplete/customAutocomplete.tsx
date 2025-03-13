import TextField from "@mui/material/TextField";
import { Autocomplete, Chip } from "@mui/material";
import { AutocompleteFieldProps } from "@/props/autocompleteFieldProps";
import { useState } from "react";

export const CustomAutocomplete = ({
  label,
  options,
  value,
  onChange,
}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState("");

  const processInput = (text: string) => {
    const newChips = text
      .trim()
      .split(/\s+/) 
      .filter(Boolean);

    if (newChips.length) {
      onChange(null, [...value, ...newChips]);
      setInputValue("");
    }
  };

  return (
    <Autocomplete
    size="small"
    options={options}
    multiple
    freeSolo={!options.length}
    value={value}
    onChange={onChange}
    noOptionsText="Опция не найдена"
    inputValue={inputValue}
    onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
    renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option}
              size="small"
              {...tagProps}
            />
          );
        })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        onKeyDown={(e) => {
          if (e.key === " ") {
            e.preventDefault();
            processInput(inputValue);
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          processInput(e.clipboardData.getData("text"));
        }}
      />
    )}
  />
  
  );
};
