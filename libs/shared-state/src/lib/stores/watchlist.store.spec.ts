import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { WatchlistStore } from './watchlist.store';

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => [...entries.keys()][index] ?? null,
    removeItem: (key: string) => entries.delete(key) as unknown as void,
    setItem: (key: string, value: string) => entries.set(key, value) as unknown as void,
  };
}

describe('WatchlistStore', () => {
  let store: WatchlistStore;

  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    TestBed.resetTestingModule();
    store = TestBed.inject(WatchlistStore);
  });

  it('starts empty', () => {
    expect(store.isEmpty()).toBe(true);
    expect(store.count()).toBe(0);
  });

  it('adds and removes an asset with toggle', () => {
    expect(store.toggle('uuid-1')).toBe(true);
    expect(store.contains('uuid-1')).toBe(true);

    expect(store.toggle('uuid-1')).toBe(false);
    expect(store.contains('uuid-1')).toBe(false);
  });

  it('persists the list across instances', () => {
    store.toggle('uuid-1');
    store.toggle('uuid-2');

    TestBed.resetTestingModule();

    expect(TestBed.inject(WatchlistStore).uuids()).toEqual(['uuid-1', 'uuid-2']);
  });

  it('clears every asset', () => {
    store.toggle('uuid-1');
    store.clear();

    expect(store.isEmpty()).toBe(true);
  });
});
