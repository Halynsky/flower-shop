import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.scss']
})
export class EditorDialogComponent implements OnInit {

  text: string;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    this.text = this.config.data.text
  }

  save() {
    this.config.data.onTextSubmit(this.text);
  }

}
