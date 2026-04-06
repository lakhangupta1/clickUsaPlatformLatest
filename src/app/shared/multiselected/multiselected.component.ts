import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

interface IDropdownSettings {
  singleSelection?: boolean;
  idField?: string;
  textField?: string;
  enableCheckAll?: boolean;
  selectAllText?: string;
  unSelectAllText?: string;
  allowSearchFilter?: boolean;
  limitSelection?: number;
  clearSearchFilter?: boolean;
  maxHeight?: number;
  itemsShowLimit?: number;
  searchPlaceholderText?: string;
  noDataAvailablePlaceholderText?: string;
  closeDropDownOnSelection?: boolean;
  showSelectedItemsAtTop?: boolean;
  defaultOpen?: boolean;
}

@Component({
  selector: 'app-multiselected',
  standalone: true,
  imports: [FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './multiselected.component.html',
  styleUrl: './multiselected.component.scss'

})
export class MultiselectedComponent {

  @Input() dropdownData: any[] = [];
  @Input() selectedData: any[] = [];
  @Input() dropdownPlaceholder: string = '';
  @Input() dropdownSettings: IDropdownSettings = {};
  @Input() dropdownDisabled: boolean = false;
  @Output() getSelectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() items: any[] = [];
  @Input() settings: any;
  @Output() onSelect = new EventEmitter<any>();

  dropdownList: any[] = [];
  selectedItems: any[] = [];


  ngOnInit(): void {

    this.settings = {
      singleSelection: this.dropdownSettings.singleSelection ?? false,
      idField: this.dropdownSettings.idField ?? 'id',
      textField: this.dropdownSettings.textField ?? 'text',
      enableCheckAll: this.dropdownSettings.enableCheckAll ?? true,
      selectAllText: this.dropdownSettings.selectAllText ?? 'Select All',
      unSelectAllText: this.dropdownSettings.unSelectAllText ?? 'Unselect All',
      allowSearchFilter: this.dropdownSettings.allowSearchFilter ?? true,
      limitSelection: this.dropdownSettings.limitSelection ?? -1,
      clearSearchFilter: this.dropdownSettings.clearSearchFilter ?? true,
      maxHeight: this.dropdownSettings.maxHeight ?? 200,
      itemsShowLimit: this.dropdownSettings.itemsShowLimit ?? 10,
      searchPlaceholderText: this.dropdownSettings.searchPlaceholderText ?? 'Search',
      noDataAvailablePlaceholderText: this.dropdownSettings.noDataAvailablePlaceholderText ?? 'No data found',
      closeDropDownOnSelection: this.dropdownSettings.closeDropDownOnSelection ?? false,
      showSelectedItemsAtTop: this.dropdownSettings.showSelectedItemsAtTop ?? false,
      defaultOpen: this.dropdownSettings.defaultOpen ?? false
    }
  }

  onItemSelect(event: any): void {

    this.getSelectedItems.emit(this.selectedData);
  }

  onItemDeSelect(event: any): void {

    this.getSelectedItems.emit(this.selectedData);
  }

  onSelectAll(event: any): void {

    this.getSelectedItems.emit(event);
  }

  onDeSelectAll(event: any): void {

    this.getSelectedItems.emit([]);
  }

}
