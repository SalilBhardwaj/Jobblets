import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = import.meta.env.VITE_BASE_URL;
const initialState = {
  user: {
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  },
  workerProfile: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const updateUserProfile = createAsyncThunk(
  "/user/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const role = state.user.user.role;
      let response;
      let isMultipart = false;
      let submitData;

      if (formData.profilePhoto instanceof File) {
        isMultipart = true;
        submitData = new FormData();
        submitData.append("profileImage", formData.profilePhoto);
        const { profilePhoto, profilePhotoPreview, ...otherFields } = formData;
        submitData.append("formData", JSON.stringify(otherFields));
      } else {
        submitData = { formData: { ...formData } };
      }

      if (role == "worker") {
        response = await fetch(`${baseUrl}/user/worker/updateProfile`, {
          method: "POST",
          body: isMultipart ? submitData : JSON.stringify(submitData),
          headers: isMultipart
            ? undefined
            : { "Content-Type": "application/json" },
          credentials: "include",
        });
      } else if (role == "client") {
        response = await fetch(`${baseUrl}/user/client/updateProfile`, {
          method: "POST",
          body: isMultipart ? submitData : JSON.stringify(submitData),
          headers: isMultipart
            ? undefined
            : { "Content-Type": "application/json" },
          credentials: "include",
        });
      } else {
        throw new Error("Invalid role");
      }
      if (!response.ok) {
        throw new Error("Some Error Occurred");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Some Error Occurred");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          phone: credentials.phone,
          password: credentials.password,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Some Error Occurred");
      }
      const data = await response.json();
      return data.payload;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const logout = () => (dispatch) => {
  // optional: revoke token on server here
  dispatch(userSlice.actions.clearUser());
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload.user || initialState.user;
      state.workerProfile = payload.workerProfile || null;
      state.token = payload.token || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: () => initialState,
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (s) => {
        s.loading = true;
      })
      .addCase(signup.fulfilled, (s, a) => {
        s.loading = false;
        s.error = null;
      })
      .addCase(signup.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      });

    /* --- login flow --- */
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.error = null;
        s.user = a.payload.user;
        s.workerProfile = a.payload.workerProfile || null;
        s.token = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      });
    // updateUserProfile
    builder
      .addCase(updateUserProfile.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.workerProfile = a.payload.workerProfile || null;
        s.isAuthenticated = true;
        if (a.payload.user && a.payload.user.address) {
          s.user.address = {
            address: a.payload.user.address.address || "",
            pincode: a.payload.user.address.pincode || "",
          };
        }
      })
      .addCase(updateUserProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      });
  },
});

export const selectUser = (state) => state.user.user;

export const selectAuth = (state) => state.user.isAuthenticated;

export const selectBusy = (state) => state.user.loading;

export const selectError = (state) => state.user.error;

export const { setUser, clearUser, startLoading, stopLoading, setError } =
  userSlice.actions;
export default userSlice.reducer;
