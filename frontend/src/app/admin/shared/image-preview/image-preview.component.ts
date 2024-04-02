import { Component, ElementRef, EventEmitter, Inject, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ConfirmationService } from "primeng/api";
import { SnackBarService } from "../../../services/snak-bar.service";

let index: number = 0;

export const ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'bmp', 'doc', 'docx', 'xls', 'xlsx', 'rar', 'zip', 'txt', 'pdf'];

export const MAX_FILE_SIZE = {
  bytes: 1024 * 1024 * 10,
  megabytes: 10
};

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {

  @Input() image: string;
  @Input() previewSize: number = 120;
  @Input() disabled: boolean = false;
  @Input() confirmTitle: string = 'Delete image';
  @Output() fileChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('file') fileInput: ElementRef;

  index = index++;
  hash: number;

  constructor(private snackBarService: SnackBarService,
              private renderer: Renderer2,
              private confirmationService: ConfirmationService,
              @Inject('Window') private window: Window) {
    this.hash = Math.floor(1000 + Math.random() * 9000);
  }

  onFileChange(event): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validateFile(file)) {
        this.fileChange.emit(file);
        this.readImage(file);
      }
    }
  }

  readImage(file) {
    let reader = new FileReader();
    let img = new Image();
    let resized = new Image();
    const size = this.previewSize * 2;

    reader.onloadend = (e) => {
      img.src = reader.result as string;
      let canvas = this.renderer.createElement('canvas');
      let resizeCanvas = this.renderer.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let resizeCtx = canvas.getContext('2d');
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas = this.resize(canvas, img, size);
        resizeCanvas = this.resize(resizeCanvas, img, 1920);
        let ctr = canvas.getContext('2d');
        let rtr = resizeCanvas.getContext('2d');
        ctr.drawImage(img, 0, 0, canvas.width, canvas.height);
        rtr.drawImage(img, 0, 0, resizeCanvas.width, resizeCanvas.height);

        resizeCanvas.toBlob(blob => {
          this.fileChange.emit(new File([blob], 'image.jpg', {type: 'image/jpeg', lastModified: Date.now()}));
        }, 'image/jpeg', 0.7);
        this.image = canvas.toDataURL('image/jpeg', 0.7);
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    this.confirmationService.confirm({
      header: this.confirmTitle,
      message: `Ви впевнені що хочете видалити дану картинку?`,
      accept: () => {
        this.fileChange.emit(null);
        this.fileInput.nativeElement.value = '';
        this.delete.emit();
        this.image = null;
      }
    });
  }

  validateFile(file): boolean {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      this.snackBarService.showError(`Файл типу <b>${file.name}</b> не прийнятний`);
      this.fileInput.nativeElement.value = '';

      return false;
    }
    if (file.size > MAX_FILE_SIZE.bytes) {
      this.snackBarService.showError(`Файл <b>${file.name}</b> не вдалося завантажити на сервер. Максимальний розмір файлу <b>${MAX_FILE_SIZE.megabytes}</b> Mb`);
      this.fileInput.nativeElement.value = '';

      return false;
    }

    return true;
  }

  private resize(canvas, img, size) {
    let width = img.width;
    let height = img.height;
    if (width > height) {
      if (width > size) {
        height *= size / width;
        width = size;
      }
    } else {
      if (height > size) {
        width *= size / height;
        height = size;
      }
    }
    canvas.width = width;
    canvas.height = height;

    return canvas;
  }
}
