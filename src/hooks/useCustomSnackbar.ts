import { useSnackbar, OptionsObject, SnackbarMessage } from "notistack";

const useCustomSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message: SnackbarMessage, options?: OptionsObject) => {
    enqueueSnackbar(message, {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      ...options,
    });
  };

  return { showSnackbar };
};

export default useCustomSnackbar;