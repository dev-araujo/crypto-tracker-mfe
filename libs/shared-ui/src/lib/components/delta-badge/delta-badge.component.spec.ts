import { TestBed } from '@angular/core/testing';
import { DeltaBadgeComponent } from './delta-badge.component';

describe('DeltaBadgeComponent', () => {
  it('renders a positive change with the up trend class', async () => {
    const fixture = TestBed.createComponent(DeltaBadgeComponent);

    fixture.componentRef.setInput('value', 2.5);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.classList).toContain('delta--up');
    expect(host.textContent).toContain('+2,50%');
  });

  it('renders a missing change as flat', async () => {
    const fixture = TestBed.createComponent(DeltaBadgeComponent);

    fixture.componentRef.setInput('value', null);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).classList).toContain('delta--flat');
  });
});
