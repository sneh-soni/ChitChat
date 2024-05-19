import { isValidUsername } from "6pp";

export const usernameValidator = (username) => {
  if (!isValidUsername(username)) {
    return { isValid: false, errorMessage: "Invalid Username" };
  }
};

export const passwordValidator = (password) => {
  if (password.includes(" ")) {
    return {
      isValid: false,
      errorMessage: "Password cannot contain spaces",
    };
  }
  if (password.length < 6) {
    return {
      isValid: false,
      errorMessage: "Password must be at least 6 characters long",
    };
  }
};
