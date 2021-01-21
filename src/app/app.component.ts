import { HttpClient, } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileInfo } from 'src/Model/FileInfo';
import{BaseUrl}from './Config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Gallery App'
  images: any
  currentImageSrc: any;
  isloading: boolean;
  ngOnInit(): void {
    this.getImages();
    this.isloading = false;
  }

  constructor(private http: HttpClient) { }
  onFileSelected(event) {

    var reader = new FileReader();
    var currentApp = this;
    reader.onload = function (e) {
      debugger
      currentApp.currentImageSrc = reader.result;
      const file = event.target.files[0];
      let content = this.result;
      let fileInfo = new FileInfo();
      fileInfo.FileName = file.name;
      let formatData = new FormData();
      var s = content as String;
      var StrAfterSlash = s.split('/')[1];
      var ImageFormat = StrAfterSlash.split(';')[0];
      var CleanFaceData = s.replace(`data:image/${ImageFormat};base64,`, '');
      fileInfo.FileByteArray = CleanFaceData;
      currentApp.isloading = true;

      currentApp.http.post(`${BaseUrl}/api/Gallery`, fileInfo)
        .subscribe(response => {
          currentApp.isloading = false;
          currentApp.getImages();
        }, error => {
          currentApp.isloading = false;
          if (error.status = 400) {
            alert(' Error- Image Is Exist Before.')
          } else alert(' Error- An Error Ocurr.')

        });
    }


    reader.readAsDataURL(event.target.files[0]);

  }
  onDelete(image: any) {
    const isConfirmed = confirm('Are you sure to delete this image');
    if (isConfirmed) {
      this.isloading = true;
      this.http.delete(`${BaseUrl}/api/Gallery/${image.name}`, image)
        .subscribe(response => {
          this.isloading = false;
          this.getImages();
          alert('Image Is Deleted ');
        }, error => {
          this.isloading = false;
          alert(' Error- An Error Occurr.')
        });
    }
  }
  onDeleteAll() {
    const isConfirmed = confirm('Are you sure to delete all');
    if (isConfirmed) {
      this.isloading = true;
      this.http.delete(`${BaseUrl}/api/Gallery/`)
        .subscribe(response => {
          this.isloading = false;
          this.getImages();
          alert('All Images Is Deleted ')

        },
          error => {
            this.isloading = false;
            alert(' Error- An Error Occurr.')
          });
    }
  }
  onDownload(image: any) {

    const link = document.createElement('a');
    link.download = image.name;
    link.href = image.uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  getImages() {
    this.isloading = true;
    this.http.get(`${BaseUrl}/api/Gallery`).subscribe(
      response => {
        this.images = response;
        this.isloading = false;
      },
      error => {
        alert(' Error- An Error Occurr.')
      }
    )
  }

}