import { AxiosError } from "axios";

export interface ServerError {
  // extend as we add more
  type: "ValidationError" | "Unknown" | "BadRequest" | "NotAuthorized" | "NotFound";
  message?: string;
  validationErrors: any[];
}

export const parseServerError = (error: AxiosError): ServerError => {
  function unknownError(): ServerError {
    return {
      type: "Unknown",
      validationErrors: [],
    };
  }

  if (!error || !error.response) {
    return unknownError();
  }

  if (error.response.status === 400) {
    const errorRes: any = error.response.data;
    if (errorRes.reason === "ValidationError" && errorRes.validationErrors) {
      return {
        type: "ValidationError",
        message: errorRes.message,
        validationErrors: errorRes.validationErrors,
      };
    } else {
      return {
        type: "BadRequest",
        message: errorRes.message,
        validationErrors: [],
      };
    }
  } else if (error.response.status === 401) {
    return {
      type: "NotAuthorized",
      message: "You aren't currently logged in",
      validationErrors: [],
    };
  } else if (error.response.status === 404) {
    return {
      type: "NotFound",
      message: "That resource was not found",
      validationErrors: [],
    };
  }

  return unknownError();
};

export const extractStatusCode = (err: unknown): number | undefined => {
  const axiosErr = err as AxiosError;
  return axiosErr.response && axiosErr.response.status;
};

export const is404 = (err: unknown): boolean => {
  return extractStatusCode(err) === 404;
};

export const is403 = (err: unknown): boolean => {
  return extractStatusCode(err) === 403;
};

export const is401 = (err: unknown): boolean => {
  return extractStatusCode(err) === 401;
};

export const is400 = (err: unknown): boolean => {
  return extractStatusCode(err) === 400;
};

export const extractAPIError = (err: unknown): any | undefined => {
  const axiosErr = err as AxiosError;
  return axiosErr.response && axiosErr.response.data;
};
