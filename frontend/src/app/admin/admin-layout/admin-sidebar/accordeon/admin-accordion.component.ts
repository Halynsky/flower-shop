import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItem } from "primeng/api";


@Component({
  selector: 'admin-accordion',
  templateUrl: './admin-accordion.component.html',
  styleUrls: ['./admin-accordion.component.scss']
})
export class AdminAccordionComponent implements AfterViewInit {
  @Input()
  data: MenuItem;
  @Input()
  @HostBinding('class.-small')
  small: boolean;
  maxHeight: string = '0';
  opened: boolean;
  private currentHeight: string;
  private subMenu;

  constructor(private _element: ElementRef,
              private router: Router,
              private cd: ChangeDetectorRef) {
  }

  toggleAccordion(children): void {
    if (children) {
      if (!this.subMenu) {
        this.subMenu = this._element.nativeElement.querySelector('.sub');
      }
      if (this.opened) {
        this.maxHeight = this.subMenu.scrollHeight + 'px';
        setTimeout(() => {
          this.maxHeight = '0';
        }, 100);
      } else {
        this.maxHeight = this.subMenu.scrollHeight + 'px';
        this.currentHeight = this.maxHeight;
      }
      this.opened = !this.opened;
    }
    // this.cd.detectChanges();
  }

  transitionEnd(e: TransitionEvent): void {
    if (this.opened && e.propertyName == 'height') {
      this.maxHeight = 'auto';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data && this.data.items) {
        const val = (this.data.items as any[]).some(item => {
          const regExp: RegExp = new RegExp(`${item.link}`, 'gmi');

          return regExp.test(this.router.url);
        });
        if (val) {
          this.toggleAccordion(this.data.items);
        }
      }
    }, 0);
  }
}
