import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { MapModalComponent } from "./../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map, switchMap } from "rxjs/operators";
import { EventLocation } from '../../../events/location.model';
import { of } from 'rxjs';

@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"]
})
export class LocationPickerComponent implements OnInit {

  selectedLocationImg: string;
  isLoading = false;
  @Output() locationPick = new EventEmitter<EventLocation>();
  constructor(private modalCtrl: ModalController, private http: HttpClient) {}


  onPickLocation() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const pickedLocation: EventLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImgUrl: null
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
        .pipe(switchMap(address => {
          pickedLocation.address = address;
          return of(this.getMapImg(pickedLocation.lat, pickedLocation.lng, 14));
        })).subscribe(staticMapImgUrl => {
          pickedLocation.staticMapImgUrl = staticMapImgUrl;
          this.selectedLocationImg = staticMapImgUrl;
          this.isLoading = false;
          this.locationPick.emit(pickedLocation);

        });
      });
      modalEl.present();
    });
  }
  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          environment.googleMapsAPIKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0){
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImg(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?${lat},${lng}&zoom=${14}&size=500x300&maptype=roadmap
    &markers=color:blue%7Clabel:Event%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }
  ngOnInit() {}
}
