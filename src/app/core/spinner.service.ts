import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  /** スピナーを生成 */
  spinner = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
  });

  /** ローディング中かどうか */
  isLoading = false;

  constructor(private overlay: Overlay) { }

  /** スピナーを開始する */
  startSpinner() {
    this.spinner.attach(new ComponentPortal(MatSpinner));
    this.isLoading = true;
  }

  /** スピナーを停止する */
  stopSpinner() {
    this.spinner.detach();
    this.isLoading = false;
  }
}
