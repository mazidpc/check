import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';
import useCallData from '../customHooks/useCallData';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const axiosData = useCallData();

  const {
    data: user,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await axiosData.get('/users/me');

        // safety check (VERY IMPORTANT)
        if (!res.data || !res.data.user) {
          return null;
        }

        return res.data.user;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 0,
  });

  const handleLogout = async () => {
    try {
      await axiosData.post('/users/logout');
      refetch(); // instead of reload (better UX)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        refetch,
        isLoading,
        isError,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
