import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@crypto/shared-ui';

@Component({
  selector: 'shell-remote-unavailable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, EmptyStateComponent],
  template: `
    <crypto-empty-state
      icon="layers"
      tone="error"
      [title]="'Módulo ' + remoteLabel() + ' indisponível'"
      description="Este microfrontend não pôde ser carregado agora. O restante da aplicação segue funcionando normalmente."
    >
      <button type="button" class="action" (click)="reload()">Tentar novamente</button>
      <a class="action" routerLink="/market">Ir para o mercado</a>
    </crypto-empty-state>
  `,
  styleUrl: './remote-unavailable.component.scss',
})
export class RemoteUnavailableComponent {
  readonly remoteLabel = input<string>('solicitado');

  protected reload(): void {
    globalThis.location.reload();
  }
}
