import { AuthInput } from "src/resolvers/AuthInput";

export const validateRegister = (input: AuthInput) => {
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.email) === false
  ) {
    return [
      {
        field: "email",
        message: "Email is invalid",
      },
    ];
  }

  if (input.username.length < 3) {
    return [
      {
        field: "username",
        message: "Username must be greater or equal to 3 characters",
      },
    ];
  }

  if (input.password.length < 6) {
    return [
      {
        field: "password",
        message: "Password must be greater or equal to 6 characters",
      },
    ];
  }

  return null;
};
