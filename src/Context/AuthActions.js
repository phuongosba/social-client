export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});
export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});
export const EditInfo = (newUser) => ({
  type: "EDIT_INFO",
  payload: newUser,
});
export const EditAvt = (newUser) => ({
  type: "EDIT_AVT",
  payload: newUser,
});
