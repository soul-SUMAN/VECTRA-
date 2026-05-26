import { useState, useCallback } from "react";

/**
 * useApi — wraps any service function with loading, error, and data state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(getAllCars);
 *   useEffect(() => { execute({ page: 1 }); }, []);
 */
const useApi = (serviceFn) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const res = await serviceFn(...args);
        setData(res.data.data);
        return { success: true, data: res.data.data };
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [serviceFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
