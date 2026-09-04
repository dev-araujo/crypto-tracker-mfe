import { TestBed } from '@angular/core/testing';
import { Coin } from '@crypto/shared-data-access';
import { WatchlistSummaryComponent } from './watchlist-summary.component';

function buildCoin(name: string, changePercent: number): Coin {
  return {
    uuid: name,
    symbol: name.toUpperCase(),
    name,
    rank: 1,
    iconUrl: '',
    accentColor: null,
    price: 10,
    marketCap: 10,
    volume24h: 10,
    changePercent,
    trend: changePercent >= 0 ? 'up' : 'down',
    sparkline: [],
    listedAt: null,
    isLowVolume: false,
  };
}

describe('WatchlistSummaryComponent', () => {
  it('hides the performer blocks when a single asset is tracked', async () => {
    const fixture = TestBed.createComponent(WatchlistSummaryComponent);

    fixture.componentRef.setInput('total', 1);
    fixture.componentRef.setInput('averageChange', 3.9);
    fixture.componentRef.setInput('bestPerformer', buildCoin('bitcoin', 3.9));
    fixture.componentRef.setInput('worstPerformer', buildCoin('bitcoin', 3.9));
    fixture.componentRef.setInput('periodLabel', '24h');
    fixture.componentRef.setInput('showPerformers', false);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Variação média');
    expect(text).not.toContain('Melhor desempenho');
  });
});
