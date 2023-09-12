import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { calendar_v3 } from '@googleapis/calendar';
import { BehaviorSubject, interval, map, switchMap, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { Appointment, convertGoogleEventsToAppointments } from './interfaces/appointment';
import { google } from 'googleapis';



const private_key = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFXL7N4nbsERg5\nr6RgeQHa22KlPQuRP+fQDgJ3mT+l+d1T/AvYxU5fevwMrHGdIWDNE6iia7h1zwUO\nki+jhtdiyXrQpxpEzfGr3tXykiUITq1MngLCLMTDNToamzJDsLvm1iOo0mdqFiI5\nq6aLB09qFlfxWhGfteUScrlSDbhx7YDfRXP4h/PA2ndRgZ9tcfTramLb+E3WLncU\nKmy+7vrnpq5N2BMJ0TKO2IIF3Z301x/3eo2FE439pU2qZLqzmU0pAdNqQceoSA0t\nihIe1CbkAElIjU50tg9TGIzgRqmiE0emkIx4O7u/7JCLgPk+8yZB7/iQ8xwyLE7R\n8WKO/oCpAgMBAAECggEABEzlC29nz/T/ZiJhnoiEddRZ7efKnLubvXjQrPJ15JPx\nMqdHSs3hy0rOuyf2wcm8ZjuLbR6Twl1katDcoN+LSefB+VHqzJ0AKxKL7uEoVWoB\ndK3suXZoQyihv3qqObdcIMeBt2f+QN2CmWcYFedu34zlFak0wRohh6lgSF1sK29L\njndLtc6SVCbT4+euNhJtPSxMG9698zCVa+oFtRgkJLRSn+6VIMSw1CgeHaX86Yxy\nxaZU2sxvgi31BMMlOOE/2rXCWdaPhY+HSZ0f91yhBsr+UMsBkmKhPsIiaQ3kY1Hf\n+SvqYs0TXR0CmM41+JBfK/J53csWiByNJAUYYAhFUQKBgQD1I5FU6Jlz0S/ocEB6\nYLCZqRa518RxeOha7/uP+QKMrNbv7yT0TlWKsa638scAVzg8DRMx/QVLbSJDabu4\ntICcaVHeogPz/7/er6XdNfNCaWRePyx73aK4/iTVHwni3+QSh0MpyYQ+U+exzfiu\nTnzxcfUtRvlSPzXMDCe7MTMEcwKBgQDOG0grDhah3j+0ZUaAhdQf0AjadyR5xvLR\neZ24XC4uQeYX9cngdlEPsIjBJyXuusb9Wsnd1rQ157vVavBcWEoJrMD5373xCYJK\n+HB48hgJ3v9k+sytxO7VAeGUw1WdqtT7NY1JGPEvlYsEa6PC6ZaFyTsBvUFwdOuH\nsJdjCn87cwKBgQDKZ3O4B9WsKyzDXuveH7exKEv7ZoxspMg1TbEITzIrtQpDUdHR\nZlx7B/qbJ3nobhugeas/uwqEHLgNsV+uQltuygcvK9bXwHNMCvuIiuMwEpUsvDye\niYGx/SWsUtR23yYRpl1uQ1VNoTnNNaP/SA8hzFYD7HYv0sE4mVC03wqgwQKBgEQ1\noS+mjPTq8ZhJAAkewTH6DkQGtAqdPdT3c6wEzb+/TV/WlwXzAia4HLoXs6ULKTnF\npxMEsEU6uN4LcxqMmYwUIRVQ57JynC0lhUtxi2UQ6OLJYZ2MlCHoanhqINZ6J9wv\nP9/WIlPGIOjImryxw3/pNd8AfDy0ZRJV7fP4EF1jAoGBAOMR9lcqzZcPo2mwPe+u\ntxWlQZSKyAn5wzOkuh8yOcOlfyNHzcyCeod5FUCfuyiQAlhM796Zs3nlNiQuiy3j\n8OnmSnV8KkVxv7v8pX4z2UvzQO47kHhyd2xPmX7Fo1N3H4J/agTclJwXJ+lFjs1p\n2GVTU3kEbFwfwh6odtzIACO9\n-----END PRIVATE KEY-----';
const client_email = 'insfx-room-display@insfx-room-display.iam.gserviceaccount.com';
const scopes = ['https://www.googleapis.com/auth/calendar']; 


  @Injectable({
  providedIn: 'root',
})
      

export class  AppointmentService {

  /*
  async connect() : Promise<string> {
    const jwtClient = await new google.auth.JWT(
    client_email,
    undefined,
    private_key,
    scopes
  );  
    jwtClient.authorize();
  return await jwtClient.getAccessToken().toString();
}
*/

  // google = require('googleapis');
  // keyConfig = require('./insfx-room-display-credentials.json');
  private keyConfig = {
    client_email: 'nsfx-room-display@insfx-room-display.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFXL7N4nbsERg5\nr6RgeQHa22KlPQuRP+fQDgJ3mT+l+d1T/AvYxU5fevwMrHGdIWDNE6iia7h1zwUO\nki+jhtdiyXrQpxpEzfGr3tXykiUITq1MngLCLMTDNToamzJDsLvm1iOo0mdqFiI5\nq6aLB09qFlfxWhGfteUScrlSDbhx7YDfRXP4h/PA2ndRgZ9tcfTramLb+E3WLncU\nKmy+7vrnpq5N2BMJ0TKO2IIF3Z301x/3eo2FE439pU2qZLqzmU0pAdNqQceoSA0t\nihIe1CbkAElIjU50tg9TGIzgRqmiE0emkIx4O7u/7JCLgPk+8yZB7/iQ8xwyLE7R\n8WKO/oCpAgMBAAECggEABEzlC29nz/T/ZiJhnoiEddRZ7efKnLubvXjQrPJ15JPx\nMqdHSs3hy0rOuyf2wcm8ZjuLbR6Twl1katDcoN+LSefB+VHqzJ0AKxKL7uEoVWoB\ndK3suXZoQyihv3qqObdcIMeBt2f+QN2CmWcYFedu34zlFak0wRohh6lgSF1sK29L\njndLtc6SVCbT4+euNhJtPSxMG9698zCVa+oFtRgkJLRSn+6VIMSw1CgeHaX86Yxy\nxaZU2sxvgi31BMMlOOE/2rXCWdaPhY+HSZ0f91yhBsr+UMsBkmKhPsIiaQ3kY1Hf\n+SvqYs0TXR0CmM41+JBfK/J53csWiByNJAUYYAhFUQKBgQD1I5FU6Jlz0S/ocEB6\nYLCZqRa518RxeOha7/uP+QKMrNbv7yT0TlWKsa638scAVzg8DRMx/QVLbSJDabu4\ntICcaVHeogPz/7/er6XdNfNCaWRePyx73aK4/iTVHwni3+QSh0MpyYQ+U+exzfiu\nTnzxcfUtRvlSPzXMDCe7MTMEcwKBgQDOG0grDhah3j+0ZUaAhdQf0AjadyR5xvLR\neZ24XC4uQeYX9cngdlEPsIjBJyXuusb9Wsnd1rQ157vVavBcWEoJrMD5373xCYJK\n+HB48hgJ3v9k+sytxO7VAeGUw1WdqtT7NY1JGPEvlYsEa6PC6ZaFyTsBvUFwdOuH\nsJdjCn87cwKBgQDKZ3O4B9WsKyzDXuveH7exKEv7ZoxspMg1TbEITzIrtQpDUdHR\nZlx7B/qbJ3nobhugeas/uwqEHLgNsV+uQltuygcvK9bXwHNMCvuIiuMwEpUsvDye\niYGx/SWsUtR23yYRpl1uQ1VNoTnNNaP/SA8hzFYD7HYv0sE4mVC03wqgwQKBgEQ1\noS+mjPTq8ZhJAAkewTH6DkQGtAqdPdT3c6wEzb+/TV/WlwXzAia4HLoXs6ULKTnF\npxMEsEU6uN4LcxqMmYwUIRVQ57JynC0lhUtxi2UQ6OLJYZ2MlCHoanhqINZ6J9wv\nP9/WIlPGIOjImryxw3/pNd8AfDy0ZRJV7fP4EF1jAoGBAOMR9lcqzZcPo2mwPe+u\ntxWlQZSKyAn5wzOkuh8yOcOlfyNHzcyCeod5FUCfuyiQAlhM796Zs3nlNiQuiy3j\n8OnmSnV8KkVxv7v8pX4z2UvzQO47kHhyd2xPmX7Fo1N3H4J/agTclJwXJ+lFjs1p\n2GVTU3kEbFwfwh6odtzIACO9\n-----END PRIVATE KEY-----',
  };
  //  private jwtClient: any;

  baseUrl = "https://www.googleapis.com/calendar/v3/calendars/c_ad62ec6682965aaf68dcf07dbb1848f03c0e8bf15ebde6af2641777119007cd5@group.calendar.google.com/events/"//'GOOGLE_CALENDAR_URL';
  bearer = "ya29.c.b0Aaekm1KGFyBABXQrxiLDFjzFVP1mWZHic0gRd_k_V_KgEQWEHOmkd2dAxGdWe4FGMbL2Ayng0xEANQrUt95EhBJ86dU1u5MZlS37SVRkc-iabPqsdufe5NDRdb6ggpBhQM7eddmH5RxNjAmkGUB8AH69UDIGN4zeTh80GzM0Ay_EdQOic8aaY0nR2O3gL7jq3kA-t4asUQ0cNDqrEBzTqn91jZyi7VT6uOMlGKIvproFHEWna2UotXpGnwxvzQAF6UWbwE3yr1y3McxwqomTSr31CNsuTacJ2QH1EJ_hBFWQCpL1SnlFUHpzlXg-EOAimGJlgC5hrQT339Av0_Jski-tv2ZIyqt5zROdv0mUVR0zr37cMbwl4Bqb5i1BV441wRcpxidRiWtRUgzdUbZsfe-ttmjs37_XFd5eyeclYhJSgBBfggFOrh4snuS_-FB5lM8BBM5WQoBrBnUBnyF_-43l2ma2VyFxJU6RkoM2atc20eMn4ih2e21V_lggezJwslm6MM6ZwJpg0fZ-22bc5bkwQhdOShs4wIqk6Xng4Q4QiO_JJ6X9Mofe087y1ygVl-vRiaOaFoaokv6b0kBO9kpXY9d0uWJXyz_c94-_X-r7yO4ouVfOF6sjpX1pm3Xht9hWY4gx2_8csauBzoMmVUgqxI14n6wxq3zaRqd4r3U2BZiOYvprJXlhtYwaZp_q2riQUb9XOfW2kb7wpXpxlwBJf87-BohOFzbRWekZzZoxbxgOZsxpWdkJ5qVs1ifVz1IqJ6m3OeyUUvItgzYZ4ROB3aeMWIISw2zoRaj1vy9oOXzeRVbdjXjmk7wOfXVoy6YiI16B_ikrw4Jow1uQUt2gIVFe4OpUZs60404oBcxXVurhrO7jZR0h7JXYOYxQMmBgY016aZ1O9dZFQ1lyFqjZ6atpS4RgZVFqo8u19e_fV4pvMufqFaW7WSFOOwBBY2U1MVpgX1sQxQovey_s3Umf21c1JZtZo9hc_byud3-B-iJj5ryp7-s";//'BEARER_TOKEN';
  reqHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.bearer}`,
  });

  fetchAppointments$$ = new BehaviorSubject<undefined>(undefined);
 
 
  constructor(private http: HttpClient) {

    //this.bearer = this.connect().toString();
    //jwtClient.authorize();
    //bearer = this.jwtClient.getAccessToken().toString();
    //this.initializeJwtClient();
    //this.jwtClient.authorize();
    //this.bearer = this.jwtClient.getAccessToken();
  }
/*
  async getCalendarApi() {
    const jwtClient = new google.auth.JWT(
      this.keyConfig.client_email,
      undefined,
      this.keyConfig.private_key,
      ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
    );

    await jwtClient.authorize();
    const { token } = await jwtClient.getAccessToken();
    console.log(token); 

    return token;
  }
*/
  /*
  private async initializeJwtClient() {
    this.jwtClient = new this.google.Auth.JWT(this.keyConfig.client_email, null, this.keyConfig.private_key, [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ]);

    await this.refreshToken();
    // Refresh the token immediately upon initialization

    // Refresh the token every 30 minutes (30 minutes = 30 * 60 * 1000 milliseconds)
    setInterval(() => this.refreshToken(), 30 * 60 * 1000);
  }

  private async refreshToken() {
    try {
      await this.jwtClient.authorize();
      const newToken = await this.jwtClient.getAccessToken();
      this.bearer = newToken.token;
      console.log(this.bearer);
    } catch (error) {
      console.error('Error refreshing bearer token:', error);
    }
  }
  */
  //TODO implement the token refresher. RUN this every 30 minutes and everything should be fine!^


  getAllAppointments(): Observable<Appointment[]> {
    const startTime = new Date();
    const endTime = new Date();
    startTime.setUTCHours(0, 0, 0, 0);
    endTime.setUTCHours(23, 59, 59, 999);
    const url = this.baseUrl + `?timeMin=${startTime.toISOString()}&timeMax=${endTime.toISOString()}`;

    return this.fetchAppointments$$.pipe(
      switchMap(() => this.http.get<calendar_v3.Schema$Events>(url, { headers: this.reqHeaders })),
      map(convertGoogleEventsToAppointments),
      map((appointments) =>
        appointments.sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
      )
    );
  }

  getRemainingAppointments(): Observable<Appointment[]> {
    return this.getAllAppointments().pipe(
      map((appointments) => appointments.filter((item) => new Date(item.end.dateTime).getTime() > new Date().getTime()))
    );
  }

  addAppointment(appointment: Appointment): Observable<calendar_v3.Schema$Event> {
    return this.http
      .post(this.baseUrl, appointment, { headers: this.reqHeaders })
      .pipe(tap(() => this.fetchAppointments$$.next(undefined)));
  }

  updateAppointment(appointment: Appointment): Observable<calendar_v3.Schema$Event> {
    const url = this.baseUrl + appointment.id;
    return this.http
      .put(url, appointment, { headers: this.reqHeaders })
      .pipe(tap(() => this.fetchAppointments$$.next(undefined)));
  }
}
