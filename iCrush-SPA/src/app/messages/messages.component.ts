import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/message';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Pagination, PaginatedResult } from '../_models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  pagination: Pagination;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  messageContainer = 'Outbox';

  constructor(private userService: UserService, private alertify: AlertifyService,
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer).subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => this.alertify.error(error));
  }

  onPageChanged($event): void {
    this.pagination.currentPage = $event.pageIndex + 1;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Delete Message', 'Are you sure you want to delete this Message?', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid)
        .subscribe(res => {
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          this.alertify.success('Message deleted successfully');

          if (this.messages.length === 0) { this.loadMessages(); }

        }, err => this.alertify.error('Failed to delete this message'));
    }, () => { });
  }
}
