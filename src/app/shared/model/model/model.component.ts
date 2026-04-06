import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-model-confirm-autofocus',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
})
export class ModelComponent {
  @Input() modal: IModal;
  
  private _activeModal: NgbActiveModal;

  get modalInstance() {
    return this._activeModal;
  }

  constructor(private activeModal: NgbActiveModal) {
    this._activeModal = activeModal;  
  }
}



export interface IModal {
  title: string;
  body: string;
  style: {
    centered: boolean;
    size: Size;
    scrollable: boolean;
  };
  type: ModalType;
  backdropClass: 'light-blue-backdrop';
  windowClass: 'dark-modal';
  hideCloseButton: true;
  closeOnOutsideClick: false;
  animation: true;
  keyboard: false;
}

export enum Size {
  lg = 'lg',
  sm = 'sm',
  xl = 'xl'
}

export enum ModalType {
  Basic = 'Basic',
  Confirm = 'Confirm'
}
