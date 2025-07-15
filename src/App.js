import { useState } from "react";
import Upload from "./components/Upload";
import DataTable from "./components/DataTable";

function App() {
  const [importId, setImportId] = useState("");
  return (
    <div className="container py-4">
      <h1>Inventory Sync</h1>
      <Upload onImportReady={setImportId} />
      {importId && <DataTable importId={importId} />}
    </div>
  );
}

export default App;
