import { Component, OnInit } from '@angular/core';
import { EventsService } from './../../events.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { EventLocation } from '../../location.model';
import { switchMap } from 'rxjs/operators';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss']
})
export class NewEventPage implements OnInit {
  form: FormGroup;
  constructor(
    private eventsService: EventsService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      desc: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(255)]
      }),
      capacity: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      time: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null)
    });
  }
  onLocationPicked(location: EventLocation) {
    this.form.patchValue({ location });
  }

  onImagePicked(ImageData: string | File) {
    let imageFile;
    if (typeof ImageData === 'string') {
      try {
        imageFile = base64toBlob(
          ImageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = ImageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  onCreateEvent() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    // console.log(this.form.value);
    this.loadingCtrl
      .create({
        message: 'Creating Event...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.eventsService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const date = new Date(this.form.value.date);
              const time = new Date(this.form.value.time);
              const s = date.toDateString() + ' ' + time.toLocaleTimeString();
              return this.eventsService.addEvent(
                this.form.value.name,
                this.form.value.desc,
                this.form.value.capacity,
                new Date(s),
                this.form.value.location,
                uploadRes.imageUrl
              );
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/events/tabs/my-events']);
          });
      });
  }
}
