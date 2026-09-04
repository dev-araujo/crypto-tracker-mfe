import { Injectable, computed, signal } from '@angular/core';
import { readStoredValue, writeStoredValue } from '@crypto/shared-utils';

const WATCHLIST_STORAGE_KEY = 'crypto.watchlist.uuids';

@Injectable({ providedIn: 'root' })
export class WatchlistStore {
  private readonly _uuids = signal<readonly string[]>(
    readStoredValue<string[]>(WATCHLIST_STORAGE_KEY, []),
  );

  readonly uuids = this._uuids.asReadonly();
  readonly count = computed(() => this._uuids().length);
  readonly isEmpty = computed(() => this._uuids().length === 0);

  contains(uuid: string): boolean {
    return this._uuids().includes(uuid);
  }

  toggle(uuid: string): boolean {
    const shouldAdd = !this.contains(uuid);

    this.persist(
      shouldAdd
        ? [...this._uuids(), uuid]
        : this._uuids().filter((storedUuid) => storedUuid !== uuid),
    );

    return shouldAdd;
  }

  remove(uuid: string): void {
    this.persist(this._uuids().filter((storedUuid) => storedUuid !== uuid));
  }

  clear(): void {
    this.persist([]);
  }

  private persist(uuids: readonly string[]): void {
    this._uuids.set(uuids);
    writeStoredValue(WATCHLIST_STORAGE_KEY, uuids);
  }
}
