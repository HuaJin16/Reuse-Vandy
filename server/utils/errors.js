const handleErrors = (err) => {
  inputErrors = { firstName: "", lastName: "", email: "", password: "" };

  /* HANDLE DUPLICATE EMAIL ERROR*/
  if (err.code === 11000) {
    inputErrors.email = "Email already associated with an account";
    return inputErrors;
  }

  /* HANDLE VALIDATION ERRORS */
  if (err && err.message && err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      inputErrors[properties.path] = properties.message;
    });
  }

  /* HANDLE INVALID LOGIN CREDENTIALS*/
  if (err.message === "invalid email") {
    inputErrors.email = "Email address is not registered to an account";
  }
  if (err.message === "invalid password") {
    inputErrors.password = "Invalid password for the provided email";
  }

  return inputErrors;
};

module.exports = handleErrors;
