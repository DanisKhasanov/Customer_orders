import { FormValues } from "@/props";

export const emptyFields = (formValues: FormValues) => {
  const emptyFields = Object.keys(formValues).some((field) => {
    // Проверка для массивов: если длина массива больше 0, то поле заполнено
    if (Array.isArray(formValues[field])) {
      return formValues[field].length > 0;
    }
    // Проверка для дат: если дата не null, то поле заполнено
    if (formValues[field] && formValues[field] !== null) {
      return true;
    }
    return false;
  });
  return emptyFields;
};
