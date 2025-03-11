export interface AutocompleteFieldProps {
    label: string;
    options: string[];
    value: string[];
    onChange: (event: any, newValue: string[]) => void;
  }
  