import { useState } from "react";
import "./App.css";
import { SnackbarProvider } from "notistack";
// import { Provider } from "react-redux";
// import store from "@/store/store";
import Table from "@/components/table/table";
import SearchFields from "@/components/fields/searchFields";
import {
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function App() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleToggleAccordion = () => {
    setExpanded((prev) => !prev);
  };

  return (
    // <Provider store={store}>
      <SnackbarProvider maxSnack={5}>
        <Collapse timeout={400} in={expanded}>
          <Box>
            <SearchFields setTableData={setTableData} setLoading={setLoading} />
          </Box>
        </Collapse>
        <Box display="flex" justifyContent="center">
          <IconButton onClick={handleToggleAccordion} size="large">
            {expanded ? (
              <ExpandLessIcon fontSize="large" />
            ) : (
              <ExpandMoreIcon fontSize="large" />
            )}
          </IconButton>
        </Box>
        <Table tableData={tableData} loading={loading} />
      </SnackbarProvider>
    // </Provider>
  );
}

export default App;
