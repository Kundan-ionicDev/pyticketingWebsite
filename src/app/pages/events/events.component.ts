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
  ticket: number = 1;
  
  constructor(
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    public api: PyticketService) {
      this.route.paramMap.subscribe(params => {
        this.id = params.get("id")
        // console.log('params1111:', JSON.stringify(params))
      });
      // console.log('dada1111', this.id);

      this.initialize(this.id);
      this.profileForm = new FormGroup({
        Name: new FormControl('Kundan Sakpal', Validators.required),
        EmailId: new FormControl('kundan@sp.com', Validators.required),
        MobileNumber: new FormControl('9960097184', Validators.required),
        Address: new FormControl('Chakala NAdheri', Validators.required),
        idnumber: new FormControl('DCBPS8353E', Validators.required),
        documentIdType :new FormControl('PANCARD', Validators.required),
        Quantity :new FormControl(1, Validators.required),
      });
    // console.log('Log::', router.url );//+ this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
      // console.log('params:', JSON.stringify(params))
    });
    // console.log('dada', this.id);
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
    // 
    // var result = document.getElementsByClassName("quantity").value;
    // var result = document.getElementById("ticket").value;
    console.log('dddd', this.profileForm.value);
    if (this.profileForm.valid) {
      var result = (<HTMLInputElement>document.getElementById("myInput")).value;
      let params ={
        "totalTickets": result,
         "eventId": this.id,
         "name": this.profileForm.value.Name,
         "email": this.profileForm.value.EmailId,
         "docType": this.profileForm.value.documentIdType,
         "docId": this.profileForm.value.idnumber
      };

      console.log('params:', params);
      this.api._postAPI('event/book', params).pipe(
          catchError(err => {
            // alert('Handling error locally and rethrowing it...'+ JSON.stringify(err));
            return throwError(err);
          })
        )
        .subscribe(
          res => {
            // alert('HTTP response'+ JSON.stringify(res));
            //  $("#content").show();
            if (res.status == 200) {
              if (this.qrcodename == '') {
                this.display = false;
                // alert("Please enter the name");
                return;
              } else {
                // this.value = this.qrcodename + res._id;
                this.value = [{
                  "UserId": res.data.userId,
                  "TicketId": res.data.bookingId,
                  "EventId": res.data.eventId,
                }];
                // this.display = true;
                const dialogRef = this.matDialog.open(EventTicketDialog, {
                  data: 
                  {
                    "Name": this.profileForm.value.Name,
                    "EventName": this.eventData[0].title,
                    "EventDescription": this.eventData[0].eventDescription,
                    "StartDate": this.eventData[0].startDate,
                    "EndDate": this.eventData[0].endDate,
                    "Address":this.eventData[0].address,
                    "TicketId": res.data.bookingId,
                    "EventId": res.data.eventId,
                    "QrCodeValue":this.value
                  },
                  width: '800px',
                  hasBackdrop: true,
                  autoFocus : false
                });
               
                dialogRef.afterClosed().subscribe(result => {
                  this.value = result;
                });
            
              }
            } else {
              alert('Error!!!' + res.message)
            }
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

  initialize(eventId:any) {
    // Assign a value
    this.myAngularxQrCode = 'http://www.pyticketing.com/events/arjitsingh.html';
    this.api._getAPI('event/list?eventId='+eventId+'').pipe(
        catchError(err => {
          // alert('Handling error locally and rethrowing it...'+ JSON.stringify(err));
          return throwError(err);
        })
      )
      .subscribe(
        res => {
          // alert('data' + JSON.stringify(res));
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
  value: any;
  display: boolean;
  elementType: 'url' | 'canvas' | 'img' = 'url';

  qrcodename: string = "http://pyticketingsystem.com/events/id=";
  constructor(
    public dialogRef: MatDialogRef<EventTicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.value = this.qrcodename;
      this.display = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  makePdf() {
    var DocumentContainer = document.getElementById('content');
    var html = '<html><head>'+
               '<link href="../../../assets/css/ticket.css" rel="stylesheet" type="text/css" />'+
               '</head><body style="background:#ffffff;">'+
               DocumentContainer.innerHTML+
               '</body></html>';

    var WindowObject = window.open("", "PrintWindow",
    "width=auto,height=auto,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes, _blank");
    WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
    
    document.getElementById('print_link').style.display='block';
  }
  downloadImage() {
    htmlToImage.toJpeg(document.getElementById('content'), {
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