import React, { createContext, useContext, useEffect, useReducer } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/userService";

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  user:            null,
  isAuthenticated: false,
  loading:         true,  // true until session check settles
  error:           null,
};

// ─── Action Types ──────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING:   "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT:        "LOGOUT",
  SET_ERROR:     "SET_ERROR",
  CLEAR_ERROR:   "CLEAR_ERROR",
  UPDATE_USER:   "UPDATE_USER",
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user:            action.payload,
        isAuthenticated: true,
        loading:         false,
        error:           null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, loading: false };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount — one call, aborted on cleanup (handles StrictMode)
  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const res = await getCurrentUser();
        if (!cancelled) {
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: res.data.data });
        }
      } catch {
        // 401 here just means no active session — stay logged out
        if (!cancelled) {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      }
    };

    checkSession();

    // Cleanup: if StrictMode unmounts+remounts, ignore the first call's result
    return () => { cancelled = true; };
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await loginUser(credentials);
      // Backend returns: { data: { User: {...}, accessToken, refreshToken } }
      const userData = res.data.data.User || res.data.data;
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: userData });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const register = async (formData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      await registerUser(formData);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};