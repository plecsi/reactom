import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Általános hook entitás listák kezelésére.
 * @param actions - Az entitás redux akciói
 * @param selectors - Az entitás szelektorai
 * @param initialRequest - Kezdeti lekérdezési paraméterek
 * @param paginationMode - Lapozási mód (pl. 'paged', 'infinite', stb.)
 */
export function useEntityList<EntityListRequestType>({
  actions,
  selectors,
  initialRequest,
  paginationMode,
  queryKey,
}: {
  actions: any;
  selectors: any;
  initialRequest?: Partial<EntityListRequestType>;
  paginationMode?: string;
  queryKey?: string;
}) {
  const dispatch = useDispatch();

  // Lista elemek, betöltési státuszok stb. a state-ből
  const items = useSelector(selectors.selectList);
  const loading = useSelector(selectors.selectListIsFetching);
  const error = useSelector(selectors.selectListErrors);
  const total = useSelector(selectors.selectListCount);
  const currentQuery = useSelector(selectors.selectListQuery);

  console.log('useEntityList', items);

  // Lista lekérdezése
  const fetchList = useCallback(
    (request?: Partial<EntityListRequestType>) => {
      dispatch(
        actions.fetchList({
          ...initialRequest,
          ...request,
          paginationMode,
          queryKey,
        })
      );
    },
    [dispatch, actions, initialRequest, paginationMode, queryKey]
  );

  // Frissítés
  const refreshList = useCallback(() => {
    dispatch(actions.refreshList({ queryKey }));
  }, [dispatch, actions, queryKey]);

  // Tisztítás
  const clearList = useCallback(() => {
    dispatch(actions.clearList({ queryKey }));
  }, [dispatch, actions, queryKey]);

  // Lapozási mód váltása
  const setPaginationMode = useCallback(
    (mode: string) => {
      dispatch(actions.setPaginationMode(mode));
    },
    [dispatch, actions]
  );

  // Lekérdezési params cseréje
  const setQuery = useCallback(
    (newQuery: Partial<EntityListRequestType>) => {
      dispatch(actions.setQuery({ ...newQuery, queryKey }));
    },
    [dispatch, actions, queryKey]
  );

  // Automatikus inicializáló effektus
  useEffect(() => {
      console.log('BEJÖN A HOOKBAN?', initialRequest);
    fetchList(initialRequest);
    if (initialRequest && !loading) {

    }
    // Csak első render vagy initialRequest váltásnál
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRequest]);

  return {
    items,
    loading,
    error,
    total,
    query: currentQuery,
    fetchList,
    refreshList,
    clearList,
    setPaginationMode,
    setQuery,
  };
}
