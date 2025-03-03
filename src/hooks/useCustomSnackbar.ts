import { useSnackbar, OptionsObject, SnackbarMessage } from "notistack";
import { useCallback } from "react";

const useCustomSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = useCallback(
    (message: SnackbarMessage, options?: OptionsObject) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        ...options,
      });
    },
    [enqueueSnackbar]
  );

  return { showSnackbar };
};

export default useCustomSnackbar;
