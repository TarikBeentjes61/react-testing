import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function useApiHandler(url, method = 'GET', queryParams = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const request = useCallback(async (body = {}, contentType_ = '') => {
    const shouldIncludeBody = ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());
    const isFormData = body instanceof FormData;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/${url}`, {
        method,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(!isFormData && { 'Content-Type': contentType_ || 'application/json' }),
        },
        ...(shouldIncludeBody && {
          body: isFormData ? body : JSON.stringify(body),
        }),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        const errorData = contentType?.includes('application/json')
          ? await res.json()
          : { message: 'An error occurred' };
        throw new Error(errorData.message);
      }

      if (res.status === 204) {
        setData(null);
        return null;
      }

      const responseData = contentType?.includes('application/json')
        ? await res.json()
        : null;
      setData(responseData);
      return responseData;
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [method, token, url]);

  useEffect(() => {
    if (method === 'GET') {
      request();
    }
  }, [method, request]);

  return { data, error, loading, request };
}

export default useApiHandler;
