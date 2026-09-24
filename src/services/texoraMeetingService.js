// src/services/texoraMeetingService.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const TEXORA_BASE = `${API_BASE}/v1/texorameetings`;

export const texoraValidateJoinCode = (joinCode) =>
  axios.get(`${TEXORA_BASE}/join/${joinCode}`);

export const texoraGenerateToken = (joinCode, identity, displayName, role) =>
  axios.post(`${TEXORA_BASE}/join/${joinCode}/token`, {
    identity,
    displayName,
    role,
  });

export const texoraLeave = (joinCode, identity) =>
  axios.post(`${TEXORA_BASE}/join/${joinCode}/leave`, { identity });
