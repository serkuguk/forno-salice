import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  @Input() filterForm: FormGroup | undefined;
  @Input() canEdit: boolean = false;
  @Input() canSave: boolean = false;
  @Input() canCancel: boolean = false;
  @Input() canSearch: boolean | undefined;
  @Input() notification: string = '';
  @Input() tableTitle: string = '';
  @Input() showTable: boolean = false;
  @Input() showFormulario: boolean = false;
  @Input() tableTitleBlock?: boolean = false;
  @Input() buttonNew?: boolean = false;
  @Input() buttonNewName?: string = 'NUEVO';
  @Input() buttonSave?: boolean = false;
  @Input() buttonSaveName?: string = 'GUARDAR';
  @Input() buttonRemove?: boolean = false;
  @Input() buttonRemoveName?: string = '';
  @Input() canCreateNew?: boolean = true;
  @Input() buttonEdit?: boolean = false;
  @Input() buttonEditName?: string = 'MODIFICAR';
  @Input() newSaveRemoveButtons: boolean = false;
  @Input() showSearchClearButtons: boolean = false;
  @Input() confirmRemoveMessage?: string;
  @Input() messages: any[] = [];
  @Output() addNewButton = new EventEmitter();
  @Output() editButton = new EventEmitter();
  @Output() removeButton = new EventEmitter();
  @Output() searchButton = new EventEmitter();
  @Output() clearButton = new EventEmitter();
  @Output() saveButton = new EventEmitter();
  @Output() cancelButton = new EventEmitter();


  constructor() {
  }

  ngOnInit(): void {
  }

  newButtonEvent(): void {
    this.addNewButton.emit();
  }

  editButtonEvent(): void {
    this.editButton.emit();
  }

  removeButtonEvent(): void {
    this.removeButton.emit();
  }

  searchButtonEvent(): void {
    this.searchButton.emit();
  }

  cancelButtonEvent(): void {
    this.cancelButton.emit();
  }

  saveButtonEvent(): void {
    this.saveButton.emit();
  }

  clearButtonEvent() {
    this.clearButton.emit();
  }

  deleteItem() {
    const confirmDelete = confirm(this.confirmRemoveMessage);
    if (confirmDelete) {
      this.removeButtonEvent();
    }
  }
}
