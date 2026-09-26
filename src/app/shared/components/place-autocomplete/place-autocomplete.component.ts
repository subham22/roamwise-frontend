import {
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { PlacesService } from '../../services/places.service';

@Component({
    selector: 'app-place-autocomplete',
    imports: [],
    templateUrl: './place-autocomplete.component.html',
    styleUrl: './place-autocomplete.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PlaceAutocompleteComponent),
            multi: true,
        },
    ],
})
export class PlaceAutocompleteComponent implements ControlValueAccessor {
    value = signal('');

    suggestions = signal<string[]>([]);

    isOpen = signal<boolean>(false);

    private inputSubject = new Subject<string>();
    private onChange: (value : any) => void = () => {};
    private onTouched: () => void = () => {};

    private placeService = inject(PlacesService);
    private elementRef = inject(ElementRef);

    constructor() {
        this.inputSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap( input => input.length > 2  ? this.placeService.getSuggestions(input) : [])
        ).subscribe({
            next: response => {
                this.suggestions.set(response);
                this.isOpen.set(response.length > 0)
            }
        })
    }
    registerOnChange(fn: any): void {
       this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    writeValue(val: any) {
        this.value.set(val ?? '')
    }

    onInput(newValue: string) {
        this.value.set(newValue);
        this.onChange(newValue);
        this.inputSubject.next(newValue)
    }

    selectSuggestion(suggestions: string) {
        this.value.set(suggestions)
        this.onChange(suggestions)
        this.onTouched();
        this.isOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }
}
