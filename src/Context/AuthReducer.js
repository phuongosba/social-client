const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        token: action.payload.token,
        user: action.payload.user,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };

    case "EDIT_INFO":
      const newUser = action.payload;

      return {
        ...state,
        user: {
          ...state.user,
          name: newUser.name,
          city: newUser.city,
          faculty: newUser.faculty,
        },
      };
    case "EDIT_AVT": {
      const newUser = action.payload;
      console.log(newUser.profilePicture);
      return {
        ...state,
        user: {
          ...state.user,
          profilePicture: newUser.profilePicture,
        },
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
