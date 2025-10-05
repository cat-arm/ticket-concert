interface ApiError {
  message: string;
  statusCode: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = "An error occurred";

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error: ApiError = {
        message: errorMessage,
        statusCode: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
