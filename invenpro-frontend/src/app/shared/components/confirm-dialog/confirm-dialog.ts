import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  private confirmService = inject(ConfirmService);
  dialogo = this.confirmService.dialogo;

  confirmar(): void {
    this.confirmService.resolver(true);
  }

  cancelar(): void {
    this.confirmService.resolver(false);
  }
}
