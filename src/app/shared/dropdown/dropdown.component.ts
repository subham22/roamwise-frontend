import { Component, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: string[] = [];

  isOpen: boolean = false;
  selected: string = ''; // now driven by writeValue, not an @Input

  constructor(private elementRef: ElementRef) {}

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};


  writeValue(obj: any): void {
    this.selected = obj;
  }

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }


  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    this.onTouched();
  }

  selectOption(option: string): void {
    this.selected = option;
    this.isOpen = false;
    this.onChange(option);
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }
}

