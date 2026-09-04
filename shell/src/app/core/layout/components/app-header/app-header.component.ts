import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { REFERENCE_CURRENCIES } from '@crypto/shared-data-access';
import { MarketSearchStore, PreferencesStore, WatchlistStore } from '@crypto/shared-state';
import { IconComponent, SearchFieldComponent } from '@crypto/shared-ui';
import { RemotePrefetcherService } from '../../../routing/remote-prefetcher.service';

const MARKET_ROUTE = '/market';
const SEARCH_SHORTCUT = '/';

@Component({
  selector: 'shell-app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, IconComponent, SearchFieldComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
})
export class AppHeaderComponent {
  private readonly router = inject(Router);
  private readonly preferences = inject(PreferencesStore);
  private readonly searchStore = inject(MarketSearchStore);
  private readonly watchlist = inject(WatchlistStore);
  private readonly prefetcher = inject(RemotePrefetcherService);
  private readonly searchField = viewChild(SearchFieldComponent);

  protected readonly currencies = REFERENCE_CURRENCIES;
  protected readonly currencyCode = this.preferences.currencyCode;
  protected readonly theme = this.preferences.theme;
  protected readonly searchTerm = this.searchStore.term;
  protected readonly watchlistCount = this.watchlist.count;
  protected readonly searchShortcut = SEARCH_SHORTCUT;

  protected onPrefetchRemote(remoteName: string): void {
    this.prefetcher.prefetch(remoteName);
  }

  protected onSearch(term: string): void {
    this.searchStore.setTerm(term);
    this.navigateToMarket(term);
  }

  protected onCurrencyChange(event: Event): void {
    this.preferences.setCurrencyByCode((event.target as HTMLSelectElement).value);
  }

  protected onThemeToggle(): void {
    this.preferences.toggleTheme();
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== SEARCH_SHORTCUT || this.isTypingContext(event.target)) {
      return;
    }

    event.preventDefault();
    this.searchField()?.focus();
  }

  private navigateToMarket(term: string): void {
    this.router.navigate([MARKET_ROUTE], {
      queryParams: { search: term.length > 0 ? term : null, offset: null },
      queryParamsHandling: 'merge',
    });
  }

  private isTypingContext(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
  }
}
