import { Component, OnInit } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Platform } from "@ionic/angular";
import * as firebase from "firebase";

declare var gapi;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  items: Observable<any[]>;
  constructor(db: AngularFirestore, platform: Platform) {
    this.items = db.collection("students").valueChanges();

    platform.ready().then(source => {
      console.log("platform source " + source);

      gapi.load("client", () => {
        console.log("loaded client");

        gapi.client
          .init({
            apiKey: "AIzaSyB_uF09njEkWFN7FuAD_-Gu7ncioifWUxM",
            scope: "https://www.googleapis.com/auth/calendar"
          })
          .then();

        // gapi.client.init({
        //   apiKey: "AIzaSyB_uF09njEkWFN7FuAD_-Gu7ncioifWUxM",
        //   clientId:
        //     "874036221463-40v1dfqisia5tqtehhf2nsjuf04lam9j.apps.googleusercontent.com",
        //   // discoveryDocs: [
        //   //   //   // "https://www.googleapis.com/discovery/v1/apis/urlshortener/v1/rest"

        //   //   //   "https://www.googleapis.com/drive/v3/files?key=AIzaSyAoECXy7olOa0lZk7lP_yv9WWLOD8OyASc"
        //   //   "https://www.googleapis.com/calendar/v3/users/me/calendarList?key=AIzaSyAoECXy7olOa0lZk7lP_yv9WWLOD8OyASc"
        //   // ],
        //   scope: [
        //     "https://www.googleapis.com/auth/calendar",
        //     "https://www.googleapis.com/auth/calendar",
        //     "https://www.googleapis.com/auth/calendar.events",
        //     "https://www.googleapis.com/auth/calendar.events.readonly",
        //     "https://www.googleapis.com/auth/calendar.readonly"
        //   ]

        //   // discoveryDocs: [
        //   //   "https://developers.google.com/apis-explorer/?hl=pt_BR#search/directory/admin/directory_v1/directory.members.hasMember?groupKey=02jxsxqh1ewkirf&memberKey=silvio.limeira%2540gedu.demo.mstech.com.br&_h=6&"
        //   // ],
        //   // scope: [
        //   //   "https://www.googleapis.com/auth/admin.directory.group",
        //   //   "https://www.googleapis.com/auth/admin.directory.group",
        //   //   "https://www.googleapis.com/auth/admin.directory.group",
        //   //   "https://www.googleapis.com/auth/admin.directory.group.readonly"
        //   // ]
        // });

        this.login();
      });
    });
  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    console.log("token: ", token);

    const credential = firebase.auth.GoogleAuthProvider.credential(token);

    console.log("credential: ", credential);

    const events = await gapi.client.calendar.events.list({
      calendarId: "primary"
    });

    console.log("events: ", events);
  }

  async logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log("User signed out.");
    });
  }

  makeRequest() {
    var resource = {
      summary: "Teste123",
      location: "Teste123",
      start: {
        dateTime: "2019-07-23T11:00:00.000-03:00",
        timeZone: "America/Sao_Paulo"
      },
      end: {
        dateTime: "2019-07-23T11:25:00.000-03:00",
        timeZone: "America/Sao_Paulo"
      }
    };

    gapi.client
      .request({
        path: "/calendar/v3/calendars/primary/events",
        method: "POST",
        body: resource
      })
      .then(function(response) {
        // this.writeResponse(resp.result);
        console.log(response);
        var creator = response.creator.email;
        var calendarEntry = response.htmlLink;
        var infoDiv = document.getElementById("info");
        var infoMsg = document.createElement("P");
        infoMsg.appendChild(
          document.createTextNode(
            "Calendar entry " + "successfully created by " + creator
          )
        );
        infoDiv.appendChild(infoMsg);
        var entryLink = document.createElement("A");
        // entryLink.href = calendarEntry;
        entryLink.appendChild(
          document.createTextNode("View the Calendar entry")
        );
        infoDiv.appendChild(entryLink);
      });
  }

  writeResponse(response) {}
}
