import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@crypto/shared-ui';

@Component({
  selector: 'shell-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, EmptyStateComponent],
  template: `
    <crypto-empty-state
      icon="compass"
      title="Página não encontrada"
      description="O endereço acessado não existe ou foi movido."
    >
      <a class="action" routerLink="/market">Voltar ao mercado</a>
    </crypto-empty-state>
  `,
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
