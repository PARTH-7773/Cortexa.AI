import authApis from "../auth.api";

function useAuth() {
  const login = async (credentials) => {
    const response = await authApis.loginApi(credentials);
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };
  const logout = async () => {
    const response = await authApis.logoutApi();
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };

  const getMe = async () => {
    const response = await authApis.getMeApi();
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };
  return {
    login,
    logout,
    getMe,
  };
}

export default useAuth;
