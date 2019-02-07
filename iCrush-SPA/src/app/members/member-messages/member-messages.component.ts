import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/internal/operators/tap';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  hubConnection: HubConnection;

  constructor(private userService: UserService, private authService: AuthService,
      private alertify: AlertifyService) { }

  ngOnInit() {
    const builder = new HubConnectionBuilder();
    this.loadMessages();

    this.hubConnection = builder.withUrl('http://localhost:5000/signalr').build();

    this.hubConnection.on('Send', (id, message) => {
      console.log(id, message);
    });
  }

  loadMessages() {
    // by adding + infront of this we force the currentUserId to be a number
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap( messages => {
            for (let i = 0; i < messages.length; i++) {
              if (messages[i].isRead === false && messages[i].recipientId === currentUserId) {
                this.userService.markAsRead(currentUserId, messages[i].id);
              }
            }
        })
      )
      .subscribe(messages => {
        this.messages = messages;
      }, error => this.alertify.error(error));
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;

    this.hubConnection
      .start()
      .then(() => console.log('connected'))
      .catch((err) => console.error(err.toString()));

    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        this.messages.unshift(message);
        this.newMessage.content = '';

        this.hubConnection.invoke('SendMessage', this.recipientId, message.content);

    }, error => this.alertify.error(error));
  }
}
