interface StatusTexts {
    [key: number]: string;
  }
  
  const statusText: StatusTexts = {
    200: "Success",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Unsupported",
    500: "Internal Server Error",
  };
  
  export default statusText;
  