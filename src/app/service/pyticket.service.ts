import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PyticketService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  // Calling POST Method's 
  _postAPI(methodname: string, params: any): Observable < any > {
    return this.http.post <any> (environment.apiUrl + methodname, params, this.httpOptions).pipe(
      tap(_ =>
        this.log(methodname)),
      catchError(
        this.handleError(methodname, [])
      )
    );
  }


  // Calling GET Method's
  _getAPI(methodname: string): Observable < any > {
    return this.http.get <any> (environment.apiUrl + methodname, this.httpOptions).pipe(
      tap(_ => this.log(methodname)),
      catchError(this.handleError('login', []))
    );
  }



  // Error Handling
  private handleError < T > (operation = 'operation', result ? : T) {
    return (error: any): Observable < T > => {
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
