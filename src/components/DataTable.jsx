import { useState, useEffect } from "react";
import { getStaging, getNormalized } from "../api";
import { Table, Form, Button, Pagination } from "react-bootstrap";

export default function DataTable({ importId }) {
  const [staging, setStaging] = useState([]);
  const [normalized, setNormalized] = useState([]);
  const [filter, setFilter] = useState("");
  const perPage = 50;
  const [pgS, setPgS] = useState(1),
    [pgN, setPgN] = useState(1);

  useEffect(() => {
    if (!importId) return;
    getStaging(importId).then(setStaging);
    getNormalized(importId).then(setNormalized);
  }, [importId]);

  const filteredS = staging.filter((r) => String(r.minsan).includes(filter));
  const filteredN = normalized.filter((n) => String(n.minsan).includes(filter));
  const totalPS = Math.ceil(filteredS.length / perPage);
  const totalPN = Math.ceil(filteredN.length / perPage);
  const slice = (arr, pg) => arr.slice((pg - 1) * perPage, pg * perPage);

  return (
    <>
      <div className="d-flex mb-2">
        <Form.Control
          placeholder="🔍 Cerca MINSAN"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button
          className="ms-auto"
          onClick={() => {
            setPgS(1);
            setPgN(1);
            getStaging(importId).then(setStaging);
            getNormalized(importId).then(setNormalized);
          }}
        >
          Ricarica
        </Button>
      </div>

      <h5>
        Staging ({filteredS.length}/{staging.length})
      </h5>
      <Table striped bordered size="sm" responsive>
        <thead>
          <tr>
            <th>Ditta</th>
            <th>MINSAN</th>
            <th>EAN</th>
            <th>Descrizione</th>
            <th>Lotto</th>
            <th>Qty</th>
            <th>CostoBase</th>
            <th>CostoMedio</th>
            <th>UltimoCostoDitta</th>
            <th>DataUltimoCostoDitta</th>
            <th>PrezzoBD</th>
            <th>IVA</th>
            <th>Scadenza</th>
          </tr>
        </thead>
        <tbody>
          {slice(filteredS, pgS).map((r) => (
            <tr key={r.id}>
              <td>{r.ditta}</td>
              <td>{r.minsan}</td>
              <td>{r.ean}</td>
              <td>{r.descrizione}</td>
              <td>{r.lotto}</td>
              <td>{r.raw_quantity}</td>
              <td>{r.costo_base}</td>
              <td>{r.costomedio}</td>
              <td>{r.ultimo_costo_ditta}</td>
              <td>{r.data_ultimo_costo_ditta}</td>
              <td>{r.prezzo_bd}</td>
              <td>{r.iva}</td>
              <td>{r.raw_expiry?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.Prev
          disabled={pgS === 1}
          onClick={() => setPgS((pg) => pg - 1)}
        />
        {[...Array(totalPS)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === pgS}
            onClick={() => setPgS(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={pgS === totalPS}
          onClick={() => setPgS((pg) => pg + 1)}
        />
      </Pagination>

      <h5 className="mt-4">
        Normalized ({filteredN.length}/{normalized.length})
      </h5>
      <Table striped bordered size="sm" responsive>
        <thead>
          <tr>
            <th>Ditta</th>
            <th>MINSAN</th>
            <th>EAN</th>
            <th>Descrizione</th>
            <th>Qty Totale</th>
            <th>CostoMedio</th>
            <th>PrezzoBD</th>
            <th>IVA</th>
            <th>Scadenza</th>
          </tr>
        </thead>
        <tbody>
          {slice(filteredN, pgN).map((n) => (
            <tr key={n.id}>
              <td>{n.ditta}</td>
              <td>{n.minsan}</td>
              <td>{n.ean}</td>
              <td>{n.descrizione}</td>
              <td>{n.total_qty}</td>
              <td>{n.costomedio}</td>
              <td>{n.prezzo_bd}</td>
              <td>{n.iva}</td>
              <td>{n.expiry?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.Prev
          disabled={pgN === 1}
          onClick={() => setPgN((pg) => pg - 1)}
        />
        {[...Array(totalPN)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === pgN}
            onClick={() => setPgN(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={pgN === totalPN}
          onClick={() => setPgN((pg) => pg + 1)}
        />
      </Pagination>
    </>
  );
}
