const handleErrors = (err) => {
  inputErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    auth: "",
    title: "",
    price: "",
    description: "",
    imageURLs: "",
    userRef: "",
    posts: "",
  };

  /* HANDLE DUPLICATE EMAIL ERROR*/
  if (err.code === 11000) {
    inputErrors.email = "Email already associated with an account";
    return inputErrors;
  }

  /* HANDLE VALIDATION ERRORS */
  if (
    err &&
    err.message &&
    (err.message.includes("User validation failed") ||
      err.message.includes("Post validation failed"))
  ) {
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

  /* HANDLE AUTHENTICATION ERRORS */
  if (err.message === "unauthorized") {
    inputErrors.auth = "You are not authenticated";
  }
  if (err.message === "invalid token") {
    inputErrors.auth = "Invalid token";
  }
  if (err.message === "longer password required") {
    inputErrors.password = "Minimum of 6 characters required";
  }

  /* HANDLE USER POST ERRORS */
  if (err.message === "unavailable") {
    inputErrors.posts = "Post not found";
  }
  if (err.message == "invalid post ID") {
    inputErrors.posts = "Invalid post ID";
  }

  return inputErrors;
};

module.exports = handleErrors;
