import { useQuery } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
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
        if (!res?.data?.user) {
          return null;
        }

        return res.data.user;
      } catch (error) {
        return null;
      }
    },
    retry: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const handleLogout = async () => {
    try {
      await axiosData.post('/users/logout');
      refetch(); // instead of reload (better UX)
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  const contextValue = useMemo(
    () => ({
      user: user || null,
      refetch,
      isLoading,
      isError,
      handleLogout,
    }),
    [user, isLoading, isError, refetch]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;