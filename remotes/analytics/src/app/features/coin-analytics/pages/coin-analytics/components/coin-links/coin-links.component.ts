import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CoinLink } from '@crypto/shared-data-access';
import { IconComponent } from '@crypto/shared-ui';

const LINK_ICONS: Readonly<Record<string, string>> = {
  github: 'github',
  twitter: 'twitter',
  reddit: 'reddit',
  telegram: 'telegram',
  discord: 'discord',
  youtube: 'youtube',
  website: 'globe',
  explorer: 'compass',
  whitepaper: 'document',
};

@Component({
  selector: 'analytics-coin-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './coin-links.component.html',
  styleUrl: './coin-links.component.scss',
})
export class CoinLinksComponent {
  readonly links = input.required<readonly CoinLink[]>();

  protected readonly visibleLinks = computed(() =>
    this.links().map((link) => ({
      ...link,
      icon: LINK_ICONS[link.type.toLowerCase()] ?? 'external',
    })),
  );
}
