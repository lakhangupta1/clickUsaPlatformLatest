import { Component, Input } from '@angular/core';
import { IModal } from '../model/model.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-model',
  standalone: true,
  imports: [],
  templateUrl: './confirm-model.component.html',
  styleUrl: './confirm-model.component.scss'
})
export class ConfirmModelComponent {
  @Input() modal: IModal;
  constructor(public activeModal: NgbActiveModal) { }  
}
