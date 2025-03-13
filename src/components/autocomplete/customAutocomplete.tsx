import TextField from "@mui/material/TextField";
import { Autocomplete, Chip } from "@mui/material";
import { AutocompleteFieldProps } from "@/props/autocompleteFieldProps";
import { useState, useEffect } from "react";

export const CustomAutocomplete = ({
  label,
  options,
  value,
  onChange,
}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault();
      if (inputValue.trim()) {
        onChange(null, [...value, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const handleDelete = (chipToDelete: string) => {
    onChange(
      null,
      value.filter((chip) => chip !== chipToDelete)
    );
  };

  useEffect(() => {
    if (inputValue.trim().includes(" ")) {
      const chips = inputValue
        .split(" ")
        .map((item) => item.trim())
        .filter(Boolean);
      if (chips.length) {
        onChange(null, [...value, ...chips]);
        setInputValue("");
      }
    }
  }, [inputValue, value, onChange]);

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
        value.map((option, index) => (
          <Chip
            key={index}
            label={option}
            size="small"
            {...getTagProps({ index })}
            onDelete={() => handleDelete(option)}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      )}
    />
  );
};
