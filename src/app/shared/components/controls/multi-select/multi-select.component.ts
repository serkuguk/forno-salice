import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef, inject,
  input,
  linkedSignal,
  OnInit,
  output
} from '@angular/core';
import {MultiSelect} from "primeng/multiselect";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlItemInterface} from "@shared/types/frontend/types/control-item-interface";

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [MultiSelect, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {

  public items = input<ControlItemInterface[]>([]);
  public disabledValue = input<any[]>([]);
  public placeholder = input<string>("Select sum items...");
  public selectedItemsLabel = input<string>();
  public lengthTextSelected = input<number>(20);
  public filter = input<boolean>(false);
  public displaySelectedLabel = input<boolean>(false);
  public emptyOption = input<boolean>(false);
  public showClear = input<boolean>();
  public withIcons = input<boolean>(false);
  public resetFilterOnHide = input<boolean>(true);
  public nullOrZero = input<number | null>(null);
  public labelType = input<string>("in_label");
  public showIcon = input<boolean>(false);
  public virtualScroll = input<boolean>(false);
  public maxSelectedLabels = input<number>(2);
  public style = input<{}>();
  public changed = output<number | string>();
  public selectedItems: string | undefined;
  public value: string | undefined;
  public isDisabled: boolean | undefined;

  private readonly cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.selectedItems = `Selecionado {0} ${this.selectedItemsLabel()}`;
  }

  private propagateChange: any = () => { }
  private propagateTouched: any = () => { }

  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  onBlur(): void {
    this.propagateTouched()
  }

  onChanged(event: any): void {
    this.value = event.value;
    this.propagateChange(event.value);
    this.changed.emit(event.value)
  }
}
