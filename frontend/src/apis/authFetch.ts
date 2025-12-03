// import { getCookie } from "./enum"; // if you already have it; else remove token part

// export async function authFetch(
//   input: RequestInfo,
//   init: RequestInit = {}
// ): Promise<Response> {
//   // Add defaults
//   const finalInit: RequestInit = {
//     credentials: "include",
//     ...init,
//     headers: {
//       ...(init.headers || {}),
//     },
//   };

//   // OPTIONAL: if you still want to send Authorization header from cookie
//   const token = getCookie("access_token");
//   if (token && !(finalInit.headers as any)?.Authorization) {
//     (finalInit.headers as any).Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(input, finalInit);

//   // ✅ Global 401 handling
//   if (res.status === 401) {
//     localStorage.clear();
//     sessionStorage.clear();
//     // (optional) also clear cookies by hitting logout endpoint if it is public
//     // await fetch("http://localhost:8082/api/auth/logout", { method: "POST", credentials: "include" });

//     window.location.href = "/";
//     throw new Error("Unauthorized");
//   }

//   return res;
// }
import { getCookie } from "./enum";

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || undefined);

  // Set Authorization from cookie if not already present
  const token = getCookie("access_token");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });

  if (res.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  return res;
}
