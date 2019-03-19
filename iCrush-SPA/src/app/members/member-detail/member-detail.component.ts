import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MatTabGroup } from '@angular/material/tabs';
import { SignalrService } from 'src/app/_services/signalr.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs') memberTabs: MatTabGroup;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private signalrService: SignalrService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];

      // tslint:disable-next-line:no-unused-expression
      selectedTab > 0 ? this.selectTab(selectedTab) : 0;
    });

    this.galleryOptions = [
      { 'imagePercent': 80, 'thumbnailsPercent': 20, 'thumbnailsColumns': 6, 'thumbnailsMargin': 0, 'thumbnailMargin': 0,
      'preview': false, 'imageAnimation': NgxGalleryAnimation.Fade },
      { 'breakpoint': 500, 'width': '300px', 'height': '300px', 'thumbnailsColumns': 3 },
      { 'breakpoint': 300, 'width': '100%', 'height': '200px', 'thumbnailsColumns': 2 }
    ];

    this.galleryImages = this.getImages();

    this.signalrService.on('loggedOut', (onlineStatus) => {
      this.user.isActive = onlineStatus;
    });

    this.signalrService.on('loggedIn', (onlineStatus) => {
      console.log(onlineStatus);
      if (this.user.id === onlineStatus.userId) {
        this.user.isActive = onlineStatus.status;
      }
    });
  }

  ngOnDestroy() {
    this.signalrService.stop();
  }

  getImages() {
    const imageUrls = [];

    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }

    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memberTabs.selectedIndex = tabId;
  }
}
