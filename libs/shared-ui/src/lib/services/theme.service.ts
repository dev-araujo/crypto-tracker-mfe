import { DOCUMENT, Injectable, effect, inject } from '@angular/core';
import { PreferencesStore } from '@crypto/shared-state';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly preferences = inject(PreferencesStore);

  constructor() {
    effect(() => this.applyTheme());
  }

  private applyTheme(): void {
    this.document.documentElement.setAttribute('data-theme', this.preferences.theme());
  }
}
