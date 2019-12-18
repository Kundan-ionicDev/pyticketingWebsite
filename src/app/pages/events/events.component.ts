import { Component,OnInit,Inject } from '@angular/core';
// import { Router } from '@angular/router';

import {  Router, ActivatedRoute,ParamMap } from '@angular/router';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PyticketService } from 'src/app/service/pyticket.service';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import htmlToImage from 'html-to-image';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var $: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  qrcodename: string = "https://insider.in/arijit-singh-live-in-mumbai-one-night-only-sign-up-for-early-access-2020/event";
  title = 'generate-qrcode';
  elementType: 'url' | 'canvas' | 'img' = 'url';
  value: any;
  display = false;
  href: string;

  eventData: any;
  public myAngularxQrCode: string = null;
  upcommingevents: {} [];
  id: string;
  profileForm: FormGroup;


  constructor(
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    public api: PyticketService) {
    this.profileForm = new FormGroup({
      Name: new FormControl('Kundan Sakpal', Validators.required),
      EmailId: new FormControl('kundan@sp.com', Validators.required),
      MobileNumber: new FormControl('9960097184', Validators.required),
      Address: new FormControl('Chakala NAdheri', Validators.required),
      idnumber: new FormControl('23422424242', Validators.required),
      documentIdType :new FormControl('Pancard', Validators.required),
      Quantity :new FormControl('1', Validators.required),
    });
    // console.log('Log::', router.url );//+ this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    this.route.paramMap.subscribe(params => {
      // this.id = params.get("id")
      // console.log('params:', JSON.stringify(params))
    });
    // console.log('dada', this.id);
    this.initialize();
  }

  downloadImage() {
    htmlToImage.toJpeg(document.getElementById('my-node'), {
        quality: 0.95
      })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'myticket.jpeg';
        link.href = dataUrl;
        link.click();
      });
    // this.href = document.getElementsByTagName('img')[7].src;
  }

  generateQRCode() {
    if (this.profileForm.valid) {
      let params = {
        "Name": this.profileForm.value.Name,
        "MobileNumber": this.profileForm.value.MobileNumber,
        "EmailId": this.profileForm.value.EmailId,
        "Address": this.profileForm.value.Address,
        "Quantity": 3
      };
      console.log('params:', this.profileForm);
      this.api._postAPI('registerforevent', params).pipe(
          catchError(err => {
            // alert('Handling error locally and rethrowing it...'+ JSON.stringify(err));
            return throwError(err);
          })
        )
        .subscribe(
          res => {
            // alert('HTTP response'+ JSON.stringify(res));
            //  $("#content").show();
            if (res.StatusCode == 200) {
              if (this.qrcodename == '') {
                this.display = false;
                alert("Please enter the name");
                return;
              } else {
                // this.value = this.qrcodename + res._id;

                this.value = [{
                  "Name": this.profileForm.value.Name,
                  "TicketId": res.Data._id,
                  "EventId": '5dee34ec0cfdee0d0d85e602'
                }];
                this.display = true;
              }
            } else {
              // alert('Error' + res.Message)
            }
            const dialogRef = this.matDialog.open(EventTicketDialog, {
              // data: this.value,
              width: '1200px',
              hasBackdrop: true,
              autoFocus : false
            });
           
           
            dialogRef.afterClosed().subscribe(result => {
              this.value = result;
            });
          },
          err => {
            if (err.length > 0) {
              // alert('HTTP Error'+ err)
            }
          }
        );
    } else {
      alert('Please provide valid details')
    }

  }

  initialize() {
    // Assign a value
    this.myAngularxQrCode = 'http://www.pyticketing.com/events/arjitsingh.html';
    this.api._getAPI('event/list?eventId=a1dce4bba7f410445291aa88382c50').pipe(
        catchError(err => {
          // alert('Handling error locally and rethrowing it...'+ JSON.stringify(err));
          return throwError(err);
        })
      )
      .subscribe(
        res => {
          if (res.status == 200) {
            this.eventData = res.data;
          } else {
          }
        },
        err => {
          if (err.length > 0) {
          }
        }
      );
  }
}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './eventticket-dialog.html',
})
export class EventTicketDialog {
  qrcodename: string = "https://insider.in/arijit-singh-live-in-mumbai-one-night-only-sign-up-for-early-access-2020/event";
  title = 'generate-qrcode';
  elementType: 'url' | 'canvas' | 'img' = 'url';
  value: any;
  display = true;

  constructor(
    public dialogRef: MatDialogRef<EventTicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
        this.value = this.qrcodename;
        this.display = true;
       // alert('value' + this.value);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  downloadImage() {
    htmlToImage.toJpeg(document.getElementById('my-node'), {
        quality: 0.95
      })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'myticket.jpeg';
        link.href = dataUrl;
        link.click();
      });
    // this.href = document.getElementsByTagName('img')[7].src;
  }
}