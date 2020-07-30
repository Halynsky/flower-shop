import { Component, Input, OnInit } from '@angular/core';
import { FlowerSize } from "../../../../api/models/FlowerSize";

@Component({
  selector: 'specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent implements OnInit {

  @Input() flowerSize: FlowerSize;

  constructor() { }

  ngOnInit(): void {
  }

}
