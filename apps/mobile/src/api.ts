import type {
  Agency,
  Annonce,
  AuthResponse,
  ConversationResponse,
  Favorite,
  SearchAnnoncesResponse,
  User,
  VisitRequest,
} from "./types";

export const API_BASE_URL = "https://homematch-veii.onrender.com";
export const PUBLIC_ASSET_BASE_URL = "https://homematchapp.me";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | undefined>;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.token
        ? {
            Authorization: `Bearer ${options.token}`,
          }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ??
      data?.error ??
      "Une erreur est survenue pendant la communication avec l'API.";
    throw new ApiError(Array.isArray(message) ? message.join("\n") : message, response.status);
  }

  return data as T;
}

export function getImageUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/images/")) return `${PUBLIC_ASSET_BASE_URL}${path}`;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
}

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: data,
    });
  },
  me(token: string) {
    return apiRequest<User>("/auth/me", { token });
  },
};

export const announcementApi = {
  search(query: { q?: string; ville?: string; typeAnnonce?: string }) {
    return apiRequest<SearchAnnoncesResponse>("/announcements", { query });
  },
  mine(token: string) {
    return apiRequest<{ success: boolean; data: Annonce[] }>("/announcements/mine", {
      token,
    });
  },
  findOne(id: string) {
    return apiRequest<{ success: boolean; data: SearchAnnoncesResponse["data"][number] }>(
      `/announcements/${id}`,
    );
  },
};

export const agencyApi = {
  me(token: string) {
    return apiRequest<Agency>("/agencies/me", { token });
  },
  update(token: string, data: Partial<Agency>) {
    return apiRequest<Agency>("/agencies/me", {
      method: "PATCH",
      token,
      body: data,
    });
  },
};

export const favoriteApi = {
  mine(token: string) {
    return apiRequest<{ success: boolean; data: Favorite[] }>("/favorites/mine", {
      token,
    });
  },
  status(token: string, announcementId: string) {
    return apiRequest<{ success: boolean; data: { isFavorite: boolean } }>(
      `/favorites/announcements/${announcementId}/status`,
      { token },
    );
  },
  add(token: string, announcementId: string) {
    return apiRequest<{ success: boolean }>(
      `/favorites/announcements/${announcementId}`,
      { method: "POST", token },
    );
  },
  remove(token: string, announcementId: string) {
    return apiRequest<{ success: boolean }>(
      `/favorites/announcements/${announcementId}`,
      { method: "DELETE", token },
    );
  },
};

export const visitApi = {
  mine(token: string) {
    return apiRequest<{ success: boolean; data: VisitRequest[] }>(
      "/visit-requests/mine",
      { token },
    );
  },
  create(
    token: string,
    announcementId: string,
    data: { message: string; requestedVisitDate: string },
  ) {
    return apiRequest<{ success: boolean; data: VisitRequest }>(
      `/visit-requests/announcements/${announcementId}`,
      { method: "POST", token, body: data },
    );
  },
  cancel(token: string, id: string) {
    return apiRequest<{ success: boolean; data: VisitRequest }>(
      `/visit-requests/${id}/cancel`,
      { method: "PATCH", token },
    );
  },
  received(token: string) {
    return apiRequest<{ success: boolean; data: VisitRequest[] }>(
      "/visit-requests/received",
      { token },
    );
  },
  updateStatus(
    token: string,
    id: string,
    status: "ACCEPTEE" | "REFUSEE" | "EN_ATTENTE" | "TERMINEE",
  ) {
    return apiRequest<{ success: boolean; data: VisitRequest }>(
      `/visit-requests/${id}/status`,
      { method: "PATCH", token, body: { status } },
    );
  },
};

export const assistantApi = {
  chat(data: { message: string; conversationId?: string }) {
    return apiRequest<ConversationResponse>("/ai/chat", {
      method: "POST",
      body: data,
    });
  },
};
