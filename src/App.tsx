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
  // const order = {
  //   orderNumber: "59656",
  //   periodStart: "01.01.2022",
  //   periodEnd: "25.02.2025",
  //   createdBy: "05.Евдокимова Ольга",
  //   deliveryMethod: "СДЭК",
  //   contractor: "Абдурахимова Диана Шавкатовна",
  //   contractorPhone: "89641675527",
  //   assingedTo: "05.Евдокимова Ольга",
  //   trackingNumber: "10083674130",
  //   salesChannel: "WhatsApp",
  //   isNewClient: false,
  //   clientAssignedTo: "05.Евдокимова Ольга",
  // };

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
