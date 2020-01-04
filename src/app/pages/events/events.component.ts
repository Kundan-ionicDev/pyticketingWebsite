import { Component,OnInit,Inject } from '@angular/core';
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
  
  constructor(
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    public api: PyticketService) {
      this.route.paramMap.subscribe(params => {
        this.id = params.get("id");
      });
      this.initialize(this.id);
      this.registerForm();
  }

  registerForm(){
    this.profileForm = new FormGroup({
      Name: new FormControl('', Validators.required),
      EmailId: new FormControl('', Validators.required),
      MobileNumber: new FormControl('', Validators.required),
      idnumber: new FormControl('', Validators.required),
      documentIdType :new FormControl('0', Validators.required),
      Quantity :new FormControl(1, Validators.required),
    });
  }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id");
    });
  }

  generateQRCode() {
    //console.log('dddd', this.profileForm.value);
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
                alert('Thank you for registering.');
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
                  this.profileForm.reset();
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
            // this.eventmap = "https://maps.google.com/maps?q=" + this.eventData[0].address + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            // let Url: HTMLInputElement = document.getElementById("gmap_canvas") as HTMLInputElement;
            // Url.src = this.eventmap
            // document.getElementById("gmap_canvas").src = this.eventmap;
            // alert('this.eventmap' + this.eventmap);
          } else {
          }
        },
        err => {
          if (err.length > 0) {
          }
        }
      );
    }else{
      this.api._getAPI('event/list').pipe(
        catchError(err => {
          return throwError(err);
        })
      ).subscribe(
        res => {
          if (res.status == 200) {
            this.eventData = res.data;
            this.id = this.eventData[0].eventId;
            // alert('events' + JSON.stringify(this.eventData));
            for(var i= 0; i< this.eventData; i++){
              // alert(this.eventData);
              if(res.data[i].startDate > Date()){
                // alert('ssss');
              }
            }
            //this.eventData = res.data;
            // this.eventmap = "https://maps.google.com/maps?q=" + this.eventData[0].address + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            // let Url: HTMLInputElement = document.getElementById("gmap_canvas") as HTMLInputElement;
            // Url.src = this.eventmap
            // document.getElementById("gmap_canvas").src = this.eventmap;
            // alert('this.eventmap' + this.eventmap);
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