const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createSession(token, userName) {
  const res = await fetch(`${BASE_URL}/chat/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ userName }),
  });
  if (!res.ok) {
    throw new Error("Failed to create session");
  }
  return res.json(); // { sessionId }
}

export async function sendMessage(sessionId, message, token) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
      body: JSON.stringify({ sessionId, message }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getSession(sessionId, token) {
  const res = await fetch(`${BASE_URL}/chat/session/${sessionId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) {
    throw new Error("Failed to get session");
  }
  return res.json();
}

export async function sendFeedback(sessionId, feedback) {
  const res = await fetch(`${BASE_URL}/chat/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, feedback }),
  });

  if (!res.ok) {
    // We won't throw here to avoid breaking the UI; just log it.
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    console.error("Failed to send feedback:", errorData);
    return { success: false };
  }

  return res.json();
}
