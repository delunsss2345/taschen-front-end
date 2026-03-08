export const getErrorMessage = (err: unknown): string => {
  let errorMessage = "Đã xảy ra lỗi không xác định";
  if (typeof err === "object" && err !== null && "response" in err) {
    const axiosError = err as {
      response?: { data?: { message?: string; error?: string } };
    };
    const backendMsg =
      axiosError.response?.data?.message || axiosError.response?.data?.error;
    if (backendMsg) errorMessage = backendMsg;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  return errorMessage;
};
