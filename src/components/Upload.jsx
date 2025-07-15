import { useState } from "react";
import { normalize, compare } from "../api";

export default function Upload({ onImportReady }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  async function handleUpload() {
    if (!file) return alert("Seleziona un file");
    setStatus("Upload in corso…");
    const form = new FormData();
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/.netlify/functions/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(((e.loaded / e.total) * 100) | 0);
    };
    xhr.onload = async () => {
      if (xhr.status < 300) {
        const { import_id, rows_imported } = JSON.parse(xhr.responseText);
        setStatus(`${rows_imported} righe importate. Normalizzo…`);
        await normalize(import_id);
        setStatus("Comparo…");
        const { updates_count } = await compare(import_id);
        setStatus(`Pronto: ${updates_count} modifiche`);
        onImportReady(import_id);
      } else {
        setStatus(`Errore upload: ${xhr.responseText}`);
      }
    };
    xhr.onerror = () => setStatus("Errore di rete");
    xhr.send(form);
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        Importa Inventario
      </div>
      <div className="card-body">
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setProgress(0);
            setStatus("");
          }}
        />
        <button className="btn btn-success" onClick={handleUpload}>
          Avvia Importazione
        </button>
        {progress >= 0 && (
          <div className="progress mt-3">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}
        <div className="mt-2 text-info">{status}</div>
      </div>
    </div>
  );
}
