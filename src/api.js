// src/api.js
import axios from "axios";

const client = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

export function getStaging(importId) {
  return client
    .get(`/.netlify/functions/get-staging?import_id=${importId}`)
    .then((r) => r.data);
}

export function normalize(importId) {
  return client
    .post(`/.netlify/functions/normalize`, { import_id: importId })
    .then((r) => r.data);
}

export function compare(importId) {
  return client
    .post(`/.netlify/functions/compare`, { import_id: importId })
    .then((r) => r.data);
}

export function getNormalized(importId) {
  return client
    .get(`/.netlify/functions/get-normalized?import_id=${importId}`)
    .then((r) => r.data);
}
