import { Component,OnInit,Inject, Input } from '@angular/core';
import {  Router, ActivatedRoute,ParamMap } from '@angular/router';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PyticketService } from 'src/app/service/pyticket.service';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import htmlToImage from 'html-to-image';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var $: any;
import { CeiboShare } from 'ng2-social-share';

export declare class FacebookParams {
  u: string;
}

export class GooglePlusParams {
  url: string
}

export class LinkedinParams {
  url:string
}

export declare class PinterestParams {
  url: string;
  media: string;
  description: string;
}

export class TwitterParams {
  text: string;
  url: string;
  hashtags: string;
  via: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @Input() url = location.href;
  
  //vars used only for example, put anything you want :)
  public repoUrl = 'https://github.com/Epotignano/ng2-social-share';
  public imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';


  qrcodename: string = "http://ramdeshdev.com/event";
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
  eventmap: any;
  submitted:boolean = false;
  alleventData: any;
  
  constructor(
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    public api: PyticketService) {
      this.route.paramMap.subscribe(params => {
        this.id = params.get("id");
      });
      this.initialize(this.id);
       // initialise facebook sdk after it loads if required
       if (!window['fbAsyncInit']) {
        window['fbAsyncInit'] = function () {
            window['FB'].init({
                appId: 'your-app-id',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.0'
            });
        };
    }

    // load facebook sdk if required
    const url = 'https://connect.facebook.net/en_US/sdk.js';
    if (!document.querySelector(`script[src='${url}']`)) {
        let script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    }

    
      
  }

  ngAfterViewInit(): void {
    // render facebook button
    window['FB'] && window['FB'].XFBML.parse();
  } 

  registerForm(){
    this.profileForm = new FormGroup({
      Name: new FormControl('', Validators.required),
      EmailId: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
       MobileNumber : new FormControl('', Validators.required),
      idnumber: new FormControl('', Validators.required),
      documentIdType :new FormControl('0', Validators.required),
      Quantity :new FormControl(1, Validators.required),
    });
  }

  // convenience getter for easy access to form fields
  get f() { 
    return this.profileForm.controls; 
  }

  ngOnInit() {
    this.registerForm();
    $('[data-toggle="tooltip"]').tooltip();   
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id");
    });
  }

  generateQRCode() {
    this.submitted = true;
    console.log('dddd', this.profileForm.value);
    if (this.profileForm.valid) {
      var result = (<HTMLInputElement>document.getElementById("myInput")).value;
      let params ={
        "totalTickets": result,
         "eventId": this.id,
         "name": this.profileForm.value.Name,
         "email": this.profileForm.value.EmailId,
         "mobileNumber":this.profileForm.value.MobileNumber,
         "docType": this.profileForm.value.documentIdType,
         "docId": this.profileForm.value.idnumber
      };

      // console.log('params:', params);
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
                // return;
              } else {
                // alert('Thank you for registering.');
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
                    "Seats":result,
                    "DocumentType": this.profileForm.value.documentIdType,
                    "DocumentId":this.profileForm.value.idnumber,
                    "QrCodeValue":this.value
                  },
                  width: '800px',
                  height: '500px',
                  hasBackdrop: true,
                  autoFocus : true
                });
               
                dialogRef.afterClosed().subscribe(result => {
                  this.value = result;
                  // this.profileForm.reset();
                  // this.profileForm.reset();
                  this.registerForm();
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

  registerForEvent(eventdetail:any){
    const dialogRef = this.matDialog.open(RegisterEventDialog, {
      data: 
      {
        "Name": eventdetail
      },
      width: '800px',
      height: '500px',
      hasBackdrop: true,
      autoFocus : true
    });
   
    dialogRef.afterClosed().subscribe(result => {
      this.value = result;
    });
  }

  initialize(eventId:any) {
    // alert('eventId'+ eventId);
    if(eventId !=null){
      this.api._getAPI('event/list?eventId='+eventId+'').pipe(
        catchError(err => {
          return throwError(err);
        })
      ).subscribe(
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

    this.api._getAPI('event/list').pipe(
      catchError(err => {
        return throwError(err);
      })
    ).subscribe(
      res => {
        if (res.status == 200) {
          this.alleventData = res.data;
          this.eventData = res.data;
          // this.id = this.eventData[0].eventId;
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
  selector : 'eventregister-dialog',
  templateUrl:'./eventregister-dialog.html'
})

export class RegisterEventDialog {
  display: boolean;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  profileForm: FormGroup;
  
  submitted: boolean;
  qrcodename: string;
  value: any;
  eventData: any;

  constructor(
    public api: PyticketService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<RegisterEventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.profileForm = new FormGroup({
        Name: new FormControl('', Validators.required),
        EmailId: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
         MobileNumber : new FormControl('', Validators.required),
        idnumber: new FormControl('', Validators.required),
        documentIdType :new FormControl('0', Validators.required),
        Quantity :new FormControl(1, Validators.required),
      });
      this.eventData = data;
      // console.log('Data' , JSON.stringify(data));
  }

  get f() { 
    return this.profileForm.controls; 
  }

  BookTicket() {
    this.submitted = true;
    console.log('dddd', this.profileForm.value + JSON.stringify(this.eventData) + this.eventData.Name.eventId);
    if (this.profileForm.valid) {
      var result = (<HTMLInputElement>document.getElementById("myInput")).value;
      let params ={
        "totalTickets": result,
         "eventId": this.eventData.Name.eventId,
         "name": this.profileForm.value.Name,
         "email": this.profileForm.value.EmailId,
         "mobileNumber":this.profileForm.value.MobileNumber,
         "docType": this.profileForm.value.documentIdType,
         "docId": this.profileForm.value.idnumber
      };

      // console.log('params:', params);
      this.api._postAPI('event/book', params).subscribe(
          res => {
            if (res.status == 200) {
              if (this.qrcodename == '') {
                this.display = false;
              } else {
                this.value = [{
                  "UserId": res.data.userId,
                  "TicketId": res.data.bookingId,
                  "EventId": res.data.eventId,
                }];
                const dialogRef = this.matDialog.open(EventTicketDialog, {
                  data: 
                  {
                    "Name": this.profileForm.value.Name,
                    "EventName": this.eventData.Name.title,
                    "EventDescription": this.eventData.Name.eventDescription,
                    "StartDate": this.eventData.Name.startDate,
                    "EndDate": this.eventData.Name.endDate,
                    "Address":this.eventData.Name.address,
                    "TicketId": res.data.bookingId,
                    "EventId": res.data.eventId,
                    "Seats":result,
                    "DocumentType": this.profileForm.value.documentIdType,
                    "DocumentId":this.profileForm.value.idnumber,
                    "QrCodeValue":this.value
                  },
                  width: '800px',
                  height: '500px',
                  hasBackdrop: true,
                  autoFocus : true
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
}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './eventticket-dialog.html',
})
export class EventTicketDialog {
  display: boolean;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  

  constructor(
    public dialogRef: MatDialogRef<EventTicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.display = true;
      
      // this.downloadImage(data.Name, data.EventName,data.TicketId);
  }

  close() {
    this.dialogRef.close();
  }

  downloadImage(evName, evttitle,evTicketId) {
    htmlToImage.toJpeg(document.getElementById('content'), {
        quality: 0.95
      })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = evName +'_'+ evttitle +'_'+  evTicketId +'_'+ 'ticket.jpeg';
        link.href = dataUrl;
        link.click();
      });
     
      // setTimeout(() => {
      //   this.dialogRef.close();
      // }, 2000);
  }
}