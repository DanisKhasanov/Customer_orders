import TextField from "@mui/material/TextField";
import { Autocomplete, Chip } from "@mui/material";
import { AutocompleteFieldProps } from "@/props/autocompleteFieldProps";

export const CustomAutocomplete = ({
  label,
  options,
  value,
  onChange,
}: AutocompleteFieldProps) => (
  <Autocomplete
    size="small"
    options={options}
    multiple
    freeSolo={!options.length}
    value={value}
    onChange={onChange}
    noOptionsText="Опция не найдена"
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip size="small" label={option} {...getTagProps({ index })} />
      ))
    }
    renderInput={(params) => <TextField label={label} {...params} />}
  />
);
