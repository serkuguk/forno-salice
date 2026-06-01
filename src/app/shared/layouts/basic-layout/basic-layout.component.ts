import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "@shared/components/button";

@Component({
  selector: 'basic-layout',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.scss']
})
export class BasicLayoutComponent implements OnInit {

  @Input() canEdit?: boolean = false;
  @Input() canSave?: boolean = false;
  @Input() notification?: string = '';
  @Input() formGroup: FormGroup | undefined;
  @Input()
  set messages(message: any) {
    this.messagesService = message;
  }

  @Output() clearButton = new EventEmitter();
  @Output() addNewButton = new EventEmitter();
  @Output() editButton = new EventEmitter();
  @Output() deleteButton = new EventEmitter();
  @Output() saveButton = new EventEmitter();
  @Output() cancelButton = new EventEmitter();

  private messagesService: any;
  constructor() { }

  ngOnInit(): void {}

  newButtonEvent(): void {
    this.addNewButton.emit();
  }

  editButtonEvent(): void {
    this.editButton.emit();
  }

  removeButtonEvent(): void {
    this.deleteButton.emit();
  }

  clearButtonEvent(): void {
    this.clearButton.emit();
  }

  cancelButtonEvent(): void {
    this.cancelButton.emit();
  }

  saveButtonEvent(): void {
    if (this.canSave) this.saveButton.emit();
  }

  get messages(): any {
    return this.messagesService;
  }

}
