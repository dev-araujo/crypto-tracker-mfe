import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  imports: [ConfirmDialogComponent],
  template: `
    <crypto-confirm-dialog
      tone="danger"
      title="Limpar a watchlist?"
      confirmLabel="Limpar"
      cancelLabel="Manter"
      [open]="isOpen()"
      [description]="'Não é possível desfazer.'"
      (confirmed)="confirmed = confirmed + 1"
      (dismissed)="dismissed = dismissed + 1"
    />
  `,
})
class HostComponent {
  readonly isOpen = signal(false);
  confirmed = 0;
  dismissed = 0;
}

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  function dialogElement(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  function buttonLabelled(label: string): HTMLButtonElement {
    return [...fixture.nativeElement.querySelectorAll('button')].find(
      (button: HTMLButtonElement) => button.textContent?.trim() === label,
    );
  }

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.open = false;
    };
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HostComponent] });

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('stays closed until the caller opens it', () => {
    expect(dialogElement().open).toBe(false);
  });

  it('opens as a modal when the input flips', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    expect(dialogElement().open).toBe(true);
  });

  it('describes itself to assistive technology', () => {
    const dialog = dialogElement();
    const titleId = dialog.getAttribute('aria-labelledby');
    const descriptionId = dialog.getAttribute('aria-describedby');

    expect(fixture.nativeElement.querySelector(`#${titleId}`).textContent).toContain(
      'Limpar a watchlist?',
    );
    expect(fixture.nativeElement.querySelector(`#${descriptionId}`).textContent).toContain(
      'Não é possível desfazer.',
    );
  });

  it('emits confirmation without closing itself', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    buttonLabelled('Limpar').click();

    expect(host.confirmed).toBe(1);
    expect(host.dismissed).toBe(0);
  });

  it('emits dismissal from the cancel button', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    buttonLabelled('Manter').click();

    expect(host.dismissed).toBe(1);
    expect(host.confirmed).toBe(0);
  });

  it('treats escape as a dismissal instead of a native close', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    const cancelEvent = new Event('cancel', { cancelable: true });
    dialogElement().dispatchEvent(cancelEvent);

    expect(host.dismissed).toBe(1);
    expect(cancelEvent.defaultPrevented).toBe(true);
  });

  it('dismisses on a backdrop click but not on a panel click', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.dialog__panel').click();
    expect(host.dismissed).toBe(0);

    dialogElement().click();
    expect(host.dismissed).toBe(1);
  });

  it('closes once the caller lowers the flag', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    host.isOpen.set(false);
    fixture.detectChanges();

    expect(dialogElement().open).toBe(false);
  });
});
