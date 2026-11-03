import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';

// Serialize params so the effect reruns only when they actually change.
export default function useApi(path, params) {
  const key = JSON.stringify(params ?? null);
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    apiGet(path, JSON.parse(key) ?? undefined)
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  return state;
}
