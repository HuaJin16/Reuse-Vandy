const handleErrors = (err) => {
  errors = {
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
    notifications: "",
  };

  /* HANDLE DUPLICATE EMAIL ERROR*/
  if (err.code === 11000) {
    errors.email = "Email already associated with an account";
    return errors;
  }

  /* HANDLE VALIDATION ERRORS */
  if (
    err &&
    err.message &&
    (err.message.includes("User validation failed") ||
      err.message.includes("Post validation failed"))
  ) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  /* HANDLE INVALID LOGIN CREDENTIALS*/
  if (err.message === "invalid email") {
    errors.email = "Email address is not registered to an account";
  }
  if (err.message === "invalid password") {
    errors.password = "Invalid password for the provided email";
  }

  /* HANDLE AUTHENTICATION ERRORS */
  if (err.message === "unauthorized") {
    errors.auth = "You are not authenticated";
  }
  if (err.message === "invalid token") {
    errors.auth = "Invalid token";
  }
  if (err.message === "longer password required") {
    errors.password = "Minimum of 6 characters required";
  }

  /* HANDLE USER POST ERRORS */
  if (err.message === "unavailable") {
    errors.posts = "Post not found";
  }
  if (err.message === "No saved posts found") {
    errors.posts = "No saved posts found";
  }

  /* HANDLE NOTIFICATION ERRORS */
  if (err.message === "No notifications found") {
    errors.notifications = "Notification(s) not found";
  }

  /* HANDLE MONGOOSE ERRROS */
  if (err.message.includes("Cast to ObjectId failed for value")) {
    if (err.message.includes("Post")) {
      errors.posts = "Invalid post ID format";
    }
    if (err.message.includes("Notification")) {
      errors.notifications = "Invalid notification ID format";
    }
  }

  return errors;
};

module.exports = handleErrors;
