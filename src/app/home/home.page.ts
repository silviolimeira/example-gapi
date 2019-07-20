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

        gapi.client.init({
          apiKey: "AIzaSyAoECXy7olOa0lZk7lP_yv9WWLOD8OyASc",
          clientId:
            "874036221463-40v1dfqisia5tqtehhf2nsjuf04lam9j.apps.googleusercontent.com",
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/urlshortener/v1/rest"
          ]

          // discoveryDocs: [
          //   "https://developers.google.com/apis-explorer/?hl=pt_BR#search/directory/admin/directory_v1/directory.members.hasMember?groupKey=02jxsxqh1ewkirf&memberKey=silvio.limeira%2540gedu.demo.mstech.com.br&_h=6&"
          // ],
          // scope: [
          //   "https://www.googleapis.com/auth/admin.directory.group",
          //   "https://www.googleapis.com/auth/admin.directory.group",
          //   "https://www.googleapis.com/auth/admin.directory.group",
          //   "https://www.googleapis.com/auth/admin.directory.group.readonly"
          // ]
        });

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

  makerequest() {
    function writeResponse(resp) {
      console.log("resp: ", resp);
      var responseText;
      if (resp.code && resp.data[0].debugInfo == "QuotaState: BLOCKED") {
        responseText =
          'Invalid API key provided. Please replace the "apiKey" value with your own.';
      } else {
        responseText =
          "Short URL http://goo.gl/fbsS expands to " + resp.longUrl;
      }
      var infoDiv = document.getElementById("info");
      infoDiv.innerHTML = "";
      infoDiv.appendChild(document.createTextNode(responseText));
    }
    // var shortUrl = document.getElementById('shortUrl').value;
    var request = gapi.client.urlshortener.url.get({
      shortUrl: "http://goo.gl/fbsS"
    });
    request.execute(writeResponse);
  }
}
