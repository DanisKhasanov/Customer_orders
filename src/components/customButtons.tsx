import { Box, Button } from "@mui/material";

export const CustomButtons = ({
  handleSearch,
  handleDelete,
}: {
  handleSearch: () => void;
  handleDelete: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: 2,
        mt: 3,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ textTransform: "none", flex: 1 }}
        >
          Поиск
        </Button>
        <Button
          variant="outlined"
          onClick={handleDelete}
          sx={{ textTransform: "none", flex: 1 }}
        >
          Сбросить
        </Button>
      </Box>
    </Box>
  );
};
