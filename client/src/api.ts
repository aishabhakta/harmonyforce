const API_BASE_URL = "http://18.218.163.17:5000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const defaultHeaders: HeadersInit = isFormData
    ? {} // let browser set it
    : {
        "Content-Type": "application/json",
      };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (err: any) {
    console.error(`API Error: ${err.message}`);
    throw err;
  }
}
