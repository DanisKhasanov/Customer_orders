import { useState } from "react";
import "./App.css";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import store from "@/store/store";
import Table from "@/components/table";
import SearchFields from "@/components/searchFields";

function App() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Provider store={store}>
        <SnackbarProvider maxSnack={5}>
          <SearchFields setTableData={setTableData} setLoading={setLoading} />
          <Table tableData={tableData} loading={loading} />
        </SnackbarProvider>
      </Provider>
    </>
  );
}

export default App;
