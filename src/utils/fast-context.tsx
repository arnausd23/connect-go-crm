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

interface DetectionBoxStore {
  showBox: boolean;
  boxInfo: DetectionBoxInfo;
}

interface AuthenticationMessageStore {
  showMessage: boolean;
  messageInfo: ClientAuthenticationInfo;
}

interface NewWindowStore {
  ref: any;
  isReadyToOpen: boolean;
  isOpen: boolean;
}

interface TimerStore {
  timer: any;
}

export const {
  Provider: DetectionBoxProvider,
  useStore: useDetectionBoxStore,
} = createFastContext<DetectionBoxStore>({
  showBox: false,
  boxInfo: {
    x: 0,
    y: 0,
    h: 0,
    w: 0,
    color: '#ef5350',
    originHeight: 0,
    originWidth: 0,
  },
});

export const {
  Provider: AuthenticationMessageProvider,
  useStore: useAuthenticationMessageStore,
} = createFastContext<AuthenticationMessageStore>({
  showMessage: false,
  messageInfo: {
    bgColor: 'authGreen',
    endingDate: undefined,
    footer: undefined,
    header: undefined,
    name: undefined,
    startingDate: undefined,
  },
});

export const { Provider: NewWindowProvider, useStore: useNewWindowStore } =
  createFastContext<NewWindowStore>({
    ref: null,
    isReadyToOpen: false,
    isOpen: false,
  });

export const { Provider: TimerProvider, useStore: useTimerStore } =
  createFastContext<TimerStore>({
    timer: null,
  });
