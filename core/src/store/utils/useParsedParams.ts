import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const useParsedParams = function () {
  const params = useParams();

  return useMemo<Record<string, string | number | null>>(
    () =>
      Object.keys(params).reduce(
        (acc, key) => {
          const value = params[key];
          if (value === undefined || value === 'null') {
            acc[key] = null;
          } else if (isNaN(parseInt(value))) {
            acc[key] = value;
          } else {
            acc[key] = parseInt(value);
          }

          return acc;
        },
        {} as Record<string, string | number | null>,
      ),
    [params],
  );
};

export default useParsedParams;