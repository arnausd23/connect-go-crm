import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { ClientAuthenticationInfo, DetectionBoxInfo } from './constants';

export default function createFastContext<Store>(initialState: Store) {
  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): [SelectorOutput, (value: Partial<Store>) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    const [state, setState] = useState(selector(store.get()));

    useEffect(() => {
      return store.subscribe(() => setState(selector(store.get())));
    }, []);

    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
}

interface ClientAuthenticationStore {
  showBox: boolean;
  boxInfo: DetectionBoxInfo;
  showMessage: boolean;
  messageInfo: ClientAuthenticationInfo;
  openNewWindow: boolean;
  newWindowRef: any;
  isReadyToOpen: boolean;
  timer: any;
}

export const { Provider, useStore } =
  createFastContext<ClientAuthenticationStore>({
    openNewWindow: false,
    isReadyToOpen: false,
    showMessage: false,
    showBox: false,
    newWindowRef: null,
    boxInfo: {
      x: 0,
      y: 0,
      h: 0,
      w: 0,
      color: '#ef5350',
      originHeight: 0,
      originWidth: 0,
    },
    messageInfo: {
      bgColor: 'authGreen',
      endingDate: undefined,
      footer: undefined,
      header: undefined,
      name: undefined,
      startingDate: undefined,
    },
    timer: null,
  });
