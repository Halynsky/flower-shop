import { Component, OnInit } from "@angular/core";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { UserForAdmin } from "../../../api/models/User";
import { getErrorMessage } from "../../../utils/Functions";
import { UserService } from "../../../api/services/user.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;
  item: UserForAdmin = new UserForAdmin();

  previousEmail: string;

  loading = false;

  constructor(public dataService: UserService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams => {
            if (queryParams['id']) {
              this.getItem(queryParams['id']);
            }
          })
        }
      }
    );
  }

  ngOnInit() {
  }


  getItem(id) {
    this.dataService.getById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      item => {
        this.item = item;
        this.previousEmail = item.email
      } ,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  create() {
    this.dataService.create(this.item)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("'Користувач' успішно створений");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("'Користувач' успішно оновленей");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.create() : this.update()
  }

}
