const API_BASE = "http://localhost:8080/api/auth";

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}

export async function getUserProfile(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load profile");
  }

  return data;
}

export async function updatePassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update password");
  }

  return data;
}

export async function deleteAccount(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete account");
  }
  return data;
}
