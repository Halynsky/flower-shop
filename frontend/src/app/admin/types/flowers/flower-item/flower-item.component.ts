import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '../../../../services/snak-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { clone, getErrorMessage } from '../../../../utils/Functions';
import { ItemSaveMode } from '../../../../models/ItemSaveMode';
import { FlowerTypeService } from '../../../../api/services/flower-type.service';
import { FlowerFull } from '../../../../api/models/Flower';
import { FlowerService } from '../../../../api/services/flower.service';
import { FlowerType } from '../../../../api/models/FlowerType';
import { ColorService } from '../../../../api/services/color.service';
import { Color } from '../../../../api/models/Color';
import { DatePipe } from '@angular/common';
import { SizeService } from '../../../../api/services/size.service';
import { Size } from '../../../../api/models/Size';
import { FlowerSize } from '../../../../api/models/FlowerSize';
import { TranslationService } from '../../../../utils/translation.service';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Group } from '../../../../api/models/Group';
import { GroupService } from '../../../../api/services/group.service';
import { forkJoin, Observable } from "rxjs";
import * as moment from 'moment';
import { RELEASE_DATE_STRING } from "../../../../utils/Costants";

@Component({
  selector: 'flower-item',
  templateUrl: './flower-item.component.html',
  styleUrls: ['./flower-item.component.scss']
})
export class FlowerItemComponent implements OnInit {

  displayAddSizeDialog = false;

  previousNameOriginal;
  previousName;
  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;
  private newImage: File;

  propertyId;
  flowerTypes: FlowerType[] = [];
  groups: Group[] = [];
  seasonNameOptions: {value: string; label: string}[] = [];
  item: FlowerFull = new FlowerFull();

  colors: Color[] = [];
  sizes: Size [] = [];

  sizeToAdd: Size;

  initialized = false;
  loading = false;

  sizeToCreate: Size = new Size();

  constructor(public dataService: FlowerService,
              public translation: TranslationService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private flowerTypeService: FlowerTypeService,
              public sizeService: SizeService,
              public colorService: ColorService,
              private groupService: GroupService,
              public datepipe: DatePipe) {
    this.route.params.subscribe(
      params => {
        this.mode = params.mode;

        if (this.mode === ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams => {
            if (queryParams.id) {
              this.propertyId = queryParams.id;
            }
          })
        }

      }
    );

    let requests: Observable<any>[] = [this.flowerTypeService.getAll(), this.colorService.getForAdmin(), this.sizeService.getAll()];

    if (this.mode === ItemSaveMode.edit)
      requests.push(this.dataService.getById(this.propertyId));

    forkJoin(requests)
      .pipe(finalize(() => this.initialized = true))
      .subscribe(
        (res) => {
          this.flowerTypes = res[0];
          this.colors = res[1];
          this.sizes = res[2];
          if (this.mode === ItemSaveMode.edit) {
            this.item = res[3];
            this.item.flowerSizes.forEach(fs => fs.price = fs.price / 100);
            this.previousNameOriginal = this.item.nameOriginal;
            this.previousName = this.item.name;
            this.getAllGroupsForFlowerType(this.item.flowerType.id)
          }
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      );


    const releaseYear = moment(RELEASE_DATE_STRING).year()
    this.seasonNameOptions.push(({label: `Не вибрано`, value: null}))
    for (let year = moment().year() + 1; year >= releaseYear; year--) {
      this.seasonNameOptions.push(({label: `Осінь ${year}`, value: `Осінь ${year}`}))
      this.seasonNameOptions.push(({label: `Весна ${year}`, value: `Весна ${year}`}))
    }
  }

  ngOnInit() {
  }

  getAllFlowerTypes() {
    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  getAllColors() {
    this.initialized = true;
    this.colorService.getForAdmin().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  getAllSizes() {
    return this.sizeService.getAll()
      .subscribe(
        sizes => this.sizes = sizes,
        error => this.snackBarService.showError(getErrorMessage(error))
      );
  }

  getAllGroupsForFlowerType(flowerTypeId: number) {
    this.groupService.getByFlowerTypeId(flowerTypeId).subscribe(
      groups => this.groups = groups,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }


  getItem(id) {
    this.dataService.getById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        item => {
          item.flowerSizes.forEach(fs => fs.price = fs.price / 100);
          this.item = item;
          this.previousNameOriginal = item.nameOriginal;
          this.previousName = item.name;
          this.getAllGroupsForFlowerType(this.item.flowerType.id);
          },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  create() {
    this.loading = true;
    const formData: FormData = new FormData();
    const item = clone(this.item);
    item.flowerSizes.forEach(fs => fs.price = fs.price * 100);
    item.popularity = item.popularity ? item.popularity : 0;
    formData.append('data', JSON.stringify(item));
    if (this.newImage) {
      formData.append('file', this.newImage);
    }
    this.dataService.create(formData)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.snackBarService.showSuccess('\'Квітку\' успішно створено');
          this.router.navigate(['../../'], {relativeTo: this.route})
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  update() {
    this.loading = true;
    const formData: FormData = new FormData();
    const item = clone(this.item);
    item.flowerSizes.forEach(fs => fs.price = fs.price * 100);
    item.popularity = item.popularity ? item.popularity : 0;
    formData.append('data', JSON.stringify(item));
    if (this.newImage) {
      formData.append('file', this.newImage);
    }
    this.dataService.update(this.item.id, formData)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.snackBarService.showSuccess('\'Квітку\' успішно оновлено');
          this.router.navigate(['../../'], {relativeTo: this.route})
        },
        error => {
          this.snackBarService.showError(getErrorMessage(error));
          this.getItem(item.id);
        }
      )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.create() : this.update()
  }

  addImage(event: File): void {
    if (!event) {
      this.item.image = null;
    }
    this.newImage = event;
  }

  removeFlowerSize(i) {
    this.item.flowerSizes.splice(i, 1);
  }

  addFlowerSize() {

    if (!this.sizeToAdd) {
      this.snackBarService.showWarning('Оберіть розмір квітки який ви хочете додати');
      return;
    }

    const found = this.item.flowerSizes.find(item => item.size.id == this.sizeToAdd.id);

    if (found) {
      this.snackBarService.showWarning('Обраний Розмір вже додано');
      return;
    }

    const flowerSize = new FlowerSize();
    flowerSize.size = this.sizeToAdd;

    this.item.flowerSizes.push(flowerSize);

  }

  createSize() {
    this.loading = true;
    this.sizeService.add(this.sizeToCreate)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.displayAddSizeDialog = false;
          this.snackBarService.showSuccess('Розмір успішно створено');
          this.getAllSizes();
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  resetAddSizeForm(form: NgForm) {
    this.sizeToCreate = new Size();
    form.resetForm();
  }
}
