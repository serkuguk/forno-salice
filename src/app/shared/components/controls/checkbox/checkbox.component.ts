import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, input, output, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CheckboxModule, FormsModule],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ]
})
export class CheckboxComponent implements ControlValueAccessor {
    public label = input<string>('');
    public binary = input<boolean>(true);
    public disabled = input<boolean>(false);
    public readonly = input<boolean>(false);
    public changed = output<boolean>();

    value: boolean = false;
    isDisabled: boolean = false;

    private propagateChange: any = () => {
    };
    private propagateTouched: any = () => {
    };

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.propagateTouched = fn;
    }

    writeValue(value: boolean): void {
        this.value = value ?? false;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onValueChange(checked: boolean): void {
        this.value = checked;
        this.propagateChange(checked);
        this.changed.emit(checked);
    }

    onBlur(): void {
        this.propagateTouched();
    }
}
