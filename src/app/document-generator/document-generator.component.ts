import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-document-generator',
  templateUrl: './document-generator.component.html',
  styleUrls: ['./document-generator.component.css']
})
export class DocumentGeneratorComponent implements AfterViewInit {
  htmlContent = '';
  data:any = null;

  @ViewChild('htmlContentInput', { static: false }) htmlContentInput!: ElementRef;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    // Focus on the textarea when the component has been initialized
    this.htmlContentInput.nativeElement.focus();
  }

  generateDocument() {
    this.http.post('http://localhost:3000/generate-doc', { html: this.htmlContent }, { responseType: 'arraybuffer' })
      .subscribe((data:any) => {
        this.downloadFile(data, 'document.zip');
        this.htmlContent = '';
      });
  }

  downloadFile(data1: any, filename: string) {
    this.data = data1;
    const blob = new Blob([this.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
}
