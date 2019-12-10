import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PyticketService } from 'src/app/service/pyticket.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  qrcodename : string = "https://insider.in/arijit-singh-live-in-mumbai-one-night-only-sign-up-for-early-access-2020/event";
  title = 'generate-qrcode';
  elementType: 'url' | 'canvas' | 'img' = 'url';
  value: string;
  display = false;
  href : string;

  eventData :any;
  public myAngularxQrCode: string = null;
  upcommingevents: {}[];
  id: string;
  profileForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public api: PyticketService) 
    { 
      this.profileForm = new FormGroup({
        Name: new FormControl('', Validators.required),
        EmailId: new FormControl('',Validators.required),
        MobileNumber: new FormControl('',Validators.required),
        Address: new FormControl('',Validators.required),
        Seats: new FormControl('',Validators.required)
      });
      // console.log('Log::', router.url );//+ this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // this.id = params.get("id")
      // console.log('params:', JSON.stringify(params))
    });
    // console.log('dada', this.id);
    this.initialize();
  }
  
  downloadImage(){
    this.href = document.getElementsByTagName('img')[7].src;
  }


  generateQRCode(){
    // alert('dddd'+ this.profileForm.valid);
    // console.warn(this.profileForm.value.Name);
    if (this.qrcodename == '') {
      this.display = false;
      alert("Please enter the name");
      return;
    } else {
      this.value = this.qrcodename ;
      this.display = true;
    }

    // if(this.profileForm.valid){
    //   let params = {
    //     "Name": this.profileForm.value.Name,
    //     "MobileNumber": this.profileForm.value.MobileNumber,
    //     "EmailId": this.profileForm.value.EmailId,
    //     "Address": this.profileForm.value.Address,
    //     "Quantity":this.profileForm.value.Seats
    //   };
  
    //   this.api._postAPI('registerforevent',params).pipe(
    //     catchError(err => {
    //         // alert('Handling error locally and rethrowing it...'+ JSON.stringify(err));
    //         return throwError(err);
    //     })
    //   )
    //   .subscribe(
    //       res  => {
    //         alert('HTTP response'+ JSON.stringify(res) + res.Message)
    //         //  $("#content").show();
    //         if(res.StatusCode == 200){
    //           if (this.qrcodename == '') {
    //             this.display = false;
    //             alert("Please enter the name");
    //             return;
    //           } else {
    //             this.value = this.qrcodename + res._id;
    //             this.display = true;
    //           }
    //         }else{
    //           alert('Error' + res.Message)
    //         }
            
    //       },
    //       err => {
    //         if(err.length >0){
    //           // alert('HTTP Error'+ err)
    //         }
    //       }
    //   );
    // }else{
    //   alert('Please provide valid details')
    // }
    
  }

  initialize(){
    
     // Assign a value
     this.myAngularxQrCode = 'http://www.pyticketing.com/events/arjitsingh.html';
      this.eventData =[
        { 
          id:1,about: 'Start off 2020 with a big bang in Mumbai. Arijit Singh, the voice of every love story and heartbreak is set to perform in Mumbai for one night only. From ‘Tum Hi Ho’ to ‘Ve Maahi’, we’ve pretty much grown up with this iconic singer. Catch Arijit Singh at this real special concert with your special ones!',
          actor:'Arijit Singh',aggregateRating:'5',attendee:'33', audience:'12',composer:'',contributor:'',price:'Rs .1200 /-',
          director:'',doorTime:'7 PM',duration:'5 Hours',endDate:'January 25 | 11 PM',eventStatus:'',funder:'',inLanguage:'',
          isAccessibleForFree:'',location:'Jio Garden, BKC, Mumbai,Pt No: RG1A, G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
          maximumAttendeeCapacity:'100',offers:'NA',organizer:'Arjit Team',categories:'Music',tags:'bollywood, music, concert',
          performer:'Arjit Singh',recordedIn:'',review:'',sponsor:'Paytm',startDate:'January 25 | 7PM',subEvent:'',typicalAgeRange:'',
          termsandcondition:
          [           
            { Name: 'Sign up does not ensure Tickets' },
            { Name: 'Please note, this is not your ticket and cannot be redeemed for tickets at the event. ' },
            { Name : 'By signing up, you agree to receive updates and promotional emails.' }
          ],
          description:'',image:'',name:'Arijit Singh Live in Mumbai | One Night Only 2020 | Sign up for Early Access',url:'' 
        },
        { 
          id:2,about: 'Neha Kakkar, the heartbreak is set to perform in Pune for one night only. we’ve pretty much grown up with this iconic singer. Catch Neha Kakkar at this real special concert with your special ones!',
          actor:'Neha Kakkar',aggregateRating:'5',attendee:'33', audience:'12',composer:'',contributor:'',price:'Rs .3000 /-',
          director:'',doorTime:'7 PM',duration:'5 Hours',endDate:'February 11 | 7 PM',eventStatus:'',funder:'',inLanguage:'',
          isAccessibleForFree:'',location:'Pune,Pt No: RG1A, G Block, Pune',
          maximumAttendeeCapacity:'100',offers:'NA',organizer:'Arjit Team',categories:'Music',tags:'bollywood, music, concert',
          performer:'Neha Kakkar',recordedIn:'',review:'',sponsor:'Zee',startDate:'February 11 | 7PM',subEvent:'',typicalAgeRange:'',
          termsandcondition:
          [           
            { Name: 'Sign up does not ensure Tickets' },
            { Name: 'Please note, this is not your ticket and cannot be redeemed for tickets at the event. ' },
            { Name : 'By signing up, you agree to receive updates and promotional emails.' }
          ],
          description:'',image:'',name:'Neha Kakkar Live in Pune | One Night Only 2020 | Sign up for Early Access',url:'' 
        }
      ];


      this.upcommingevents =[
        { Title: 'U2 Concert in Detroit', SubTitle:'Ford Field  2000 Brush St, Detroit, MI 48226, EE. UU.',StartDate:'May 29, 2018 @ 8:00 Pm', EndDate:'May 30, 2018 @ 4:00 Am',  Price:'400',Image:'./../../assets/images/event-1.jpg' },
        { Title: 'Summer Festival in Detroit', SubTitle:'Ford Field  2000 Brush St, Detroit, MI 48226, EE. UU.',StartDate:'May 29, 2018 @ 8:00 Pm', EndDate:'May 30, 2018 @ 4:00 Am',  Price:'200',Image:'../../../assets/images/event-2.jpg' },
        { Title: 'Costume Festival Detroit', SubTitle:'Ford Field  2000 Brush St, Detroit, MI 48226, EE. UU.',StartDate:'May 29, 2018 @ 8:00 Pm', EndDate:'May 30, 2018 @ 4:00 Am',  Price:'700',Image:'../../../assets/images/event-3.jpg' },
        { Title: 'Blockchain Conference', SubTitle:'Speackers: Maria Williams, Luis Smith, James Doe',StartDate:'May 29, 2020 @ 8:00 Pm', EndDate:'May 30, 2020 @ 4:00 Am',  Price:'3000',Image:'../../../assets/images/event-4.jpg' }
      ]
  }



}
