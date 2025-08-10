// core/src/store/StoreService.ts
import {
  combineReducers,
  configureStore,
  ReducersMapObject,
  Middleware,
  Reducer,
} from '@reduxjs/toolkit';
import createSagaMiddleware, { Saga } from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';
import merge from 'lodash/merge';
import store from './store';

export class StoreService {
  private static instance: StoreService;
  private store?: ReturnType<typeof configureStore>;
  private customMiddlewares: Middleware[] = [];
  private staticReducers: ReducersMapObject<any> = {};
  private injectedReducers: ReducersMapObject<any> = {};
  private preloadedState: any = {};
  private resetHooks = new Map<string, (state: any) => any>();

  private constructor() {}

  public static getInstance() {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  public registerStaticReducer(
    key: string,
    reducer: Reducer,
    initialState?: any
  ) {
    this.staticReducers[key] = reducer;
    if (initialState !== undefined) {
      this.preloadedState[key] = initialState;
    }
  }

  public registerMiddleware(middleware: Middleware) {
    this.customMiddlewares.push(middleware);
  }

  private getStaticReducers() {
    if (Object.keys(this.staticReducers).length === 0) {
      return { dummy: (state = null) => state };
    }
    return this.staticReducers;
  }

  private createReducer(injectedReducers: ReducersMapObject = {}) {
    const staticReducers = this.getStaticReducers();
    return combineReducers({
      ...staticReducers,
      ...injectedReducers,
    });
  }

  private processResetHooks(state: any) {
    if (this.resetHooks.size === 0) {
      return this.preloadedState;
    }
    let result = this.preloadedState;
    for (const hook of this.resetHooks.values()) {
      result = merge(result, hook(state));
    }
    return result;
  }

  public createStore(rootSaga: Saga) {
    const sagaMiddleware = createSagaMiddleware();
    const { run: runSaga } = sagaMiddleware;

    const middlewares = [...this.customMiddlewares, sagaMiddleware];

    this.store = configureStore({
      reducer: this.createReducer(this.injectedReducers),
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(middlewares),
      devTools: process.env.NODE_ENV !== 'production',
      enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers({}).concat([
          createInjectorsEnhancer({
            createReducer: this.createReducer.bind(this),
            runSaga,
          }),
        ]) as never,
      preloadedState: this.preloadedState,
    });

    (this.store as any).injectedReducers = this.injectedReducers;

    sagaMiddleware.run(rootSaga);

    return this.store;
  }

  public getStore() {
    if (!this.store) {
      throw new Error('Store not created yet. Call createStore() first.');
    }
    return this.store;
  }

  public getDispatch() {
    return this.getStore().dispatch;
  }

  public registerResetHook(key: string, hook: (state: any) => any) {
    this.resetHooks.set(key, hook);
  }
}
