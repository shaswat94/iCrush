import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from 'src/app/_models/pagination';
import { UserFilters } from 'src/app/_models/user-filters';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-list-filters',
  templateUrl: './member-list-filters.component.html',
  styleUrls: ['./member-list-filters.component.css']
})
export class MemberListFiltersComponent implements OnInit {

  @Input() pagination: Pagination;
  @Input() user: User;
  @Input() userFilters: any = {};
  @Output() outputFiltersEvent = new EventEmitter<any>();

  genderList: any = [
    {option: 'Male', value: 'male'},
    {option: 'Female', value: 'female'}
  ];
  constructor() { }

  ngOnInit() {
  }

  outputUserFilters() {
    this.outputFiltersEvent.emit(this.userFilters);
  }

  resetFilters() {
    this.userFilters.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userFilters.minAge = 18;
    this.userFilters.maxAge = 99;

    this.outputFiltersEvent.emit(this.userFilters);
  }

  toggleFilterInputEvent (event) {
    this.userFilters.orderBy = event.value;

    this.outputFiltersEvent.emit(this.userFilters);
  }
}
