const API_BASE = "http://localhost:8080/api/auth";

async function handleResponse(res) {
  const text = await res.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new Error(
      (data && (data.message || data.error)) ||
        (typeof data === "string" ? data : null) ||
        "Request failed",
    );
  }

  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
}

export async function registerUser(name, email, password, phone) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, phone }),
  });

  return handleResponse(res);
}

export async function getUserProfile(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
}

export async function updatePassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  return handleResponse(res);
}

export async function deleteAccount(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
}
