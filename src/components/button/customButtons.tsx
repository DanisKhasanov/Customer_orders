import { Box, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export const CustomButtons = ({
  handleSearch,
  handleDelete,
  setAddFields,
  addFields,
}: {
  handleSearch: () => void;
  handleDelete: () => void;
  setAddFields: React.Dispatch<React.SetStateAction<boolean>>;
  addFields: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: 1.5,
        mt: 2,
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
          color="inherit"
          onClick={() => setAddFields((prev) => !prev)}
          sx={{ textTransform: "none" }}
          endIcon={addFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Дополнительные фильтры
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          sx={{ textTransform: "none", flex: 1 }}
        >
          Сбросить
        </Button>
      </Box>
    </Box>
  );
};
