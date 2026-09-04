import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MarketSearchStore {
  private readonly _term = signal<string>('');

  readonly term = this._term.asReadonly();

  setTerm(term: string): void {
    this._term.set(term.trim());
  }

  clear(): void {
    this._term.set('');
  }
}
