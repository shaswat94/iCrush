import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/internal/operators/tap';
import { SignalrService } from 'src/app/_services/signalr.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  inputFocused = false;
  userDetail: any = null;

  constructor(private userService: UserService, private authService: AuthService,
      private alertify: AlertifyService,
      private signalrService: SignalrService) { }

  ngOnInit() {
    this.signalrService
      .start()
      .then(() => console.log('connected'))
      .catch((err) => console.error(err.toString()));

    this.loadMessages();

    this.signalrService.on('Send', (id, message) => {
      this.messages.unshift(message);
    });

    this.signalrService.on('typing', (userInfo) => {
      this.userDetail = userInfo;
    });
  }

  loadMessages() {
    // by adding + infront of this keyword we force the currentUserId to be a number
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

    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        message.isRead = true;
        this.signalrService.invoke('SendMessage', this.recipientId, message);

        this.newMessage.content = '';

    }, error => this.alertify.error(error));
  }

  setInput() {
    this.inputFocused = !this.inputFocused;
    const currentUserId = this.authService.decodedToken.nameid;
    const currentUserName = this.authService.currentUser.username;

    this.signalrService.invoke('SendTyping', {id: currentUserId, username: currentUserName});
  }

  reset() {
    this.signalrService.invoke('SendTyping', null);
  }
}
