import { FormValues } from "@/props";

export interface AddSearchFieldsProps {
  formValues: FormValues;
  handleArrayChange: (ket: keyof FormValues) => (_: any, newValue: any) => void;
  
}
