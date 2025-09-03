export const getContentType = () => ({
  "Content-Type": "application/json",
});

interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

export const errorCatch = (error: ApiError): string => {
  const message = error?.response?.data?.message;

  if (message) {
    if (Array.isArray(message)) {
      return message[0] || "Unknown error";
    }
    return message;
  }

  return error.message || "Unknown error";
};
