import { useCallback, useEffect, useRef, useState } from 'react';

const CUSTOM_EVENT = 'localstorage-update';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const instanceId = useRef(Math.random().toString(36));

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState<T>(readValue);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(readValue());
    };

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key && detail?.source !== instanceId.current) {
        setValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(CUSTOM_EVENT, handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(CUSTOM_EVENT, handleCustomEvent);
    };
  }, [key, readValue]);

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const currentValue = readValue();
        const updated =
          newValue instanceof Function ? newValue(currentValue) : newValue;

        localStorage.setItem(key, JSON.stringify(updated));
        setValue(updated);
        window.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT, {
            detail: { key, source: instanceId.current },
          })
        );
      } catch (e) {
        console.error('useLocalStorage: ошибка записи', key, e);
      }
    },
    [key, readValue]
  );

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENT, {
        detail: { key, source: instanceId.current },
      })
    );
  }, [key, initialValue]);

  return [value, setStoredValue, removeValue] as const;
}
