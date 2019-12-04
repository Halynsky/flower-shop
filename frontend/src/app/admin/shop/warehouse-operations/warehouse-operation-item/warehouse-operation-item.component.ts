import { Component } from "@angular/core";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { WarehouseOperation } from "../../../../api/models/WarehouseOperation";
import { WarehouseOperationService } from "../../../../api/services/warehouse-operation.service";
import { FlowerSize } from "../../../../api/models/FlowerSize";
import { WarehouseOperationType } from "../../../../api/models/WarehouseOperationType";
import { EnumToObjectsPipe } from "../../../../pipes/enum-to-objects";
import { TranslationService } from "../../../../utils/translation.service";
import { FlowerFull } from "../../../../api/models/Flower";
import { FlowerService } from "../../../../api/services/flower.service";

@Component({
  selector: 'warehouse-operation-item',
  templateUrl: './warehouse-operation-item.component.html',
  styleUrls: ['./warehouse-operation-item.component.scss']
})
export class WarehouseOperationItemComponent {

  isFlowerChosen: boolean = false;

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  item: WarehouseOperation = new WarehouseOperation();
  itemFlowerSize: FlowerSize = new FlowerSize();
  itemWarehouseOperationType = new WarehouseOperationType();

  operationTypes = [];
  directionOption = '—';

  flowersOptions;
  sizeOptions;
  flowerChosen: FlowerFull = new FlowerFull();

  constructor(public dataService: WarehouseOperationService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private translation: TranslationService,
              private enumToObjectsPipe: EnumToObjectsPipe,
              private flowerService: FlowerService) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams => {
            if (queryParams['id'])
              this.getItem(queryParams['id']);
            this.isFlowerChosen = true;
          })
        }


      }
    );

    this.getAllFlowers();
    this.operationTypes = enumToObjectsPipe.transform(WarehouseOperationType.OperationType);
    this.operationTypes.forEach(e => e.label = translation.text[e.label]);
  }

  getItem(id) {
    this.dataService.getById(id).subscribe(
      item => {
        this.item = item;
        this.itemFlowerSize = item.flowerSize;
        this.itemWarehouseOperationType = item.warehouseOperationType;
        this.getFlowerById(item.flowerSize.flower.id);
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  getWarehouseOperationType(operationType) {
    this.dataService.getWarehouseOperationType(operationType).subscribe(
      item => {
        this.itemWarehouseOperationType = item;
        console.log(item.id);
        if (item.direction === WarehouseOperationType.Direction.IN) {
          this.directionOption = 'Прихід';
        } else {
          this.directionOption = 'Відхід';
        }
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  getFlowerById(id) {
    this.flowerService.getFlowerFullById(id).subscribe(item => {
        this.flowerChosen = item;
        this.getFlowersSizeById(this.flowerChosen.id);
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  getFlowersSizeById(id) {
    this.flowerService.getFlowerSizeById(id).subscribe(items => {
        this.sizeOptions = items;
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
    this.isFlowerChosen = true;
  }

  getAllFlowers() {
    this.flowerService.getAll().subscribe(items => {
        this.flowersOptions = items;
      },
      error => this.snackBarService.showError(getErrorMessage(error)))
  }

  add() {
    this.dataService.add(this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Товарну операцію успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Товарну операцію успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.item.warehouseOperationType = this.itemWarehouseOperationType;
    this.item.flowerSize = this.itemFlowerSize;
    this.mode == ItemSaveMode.new ? this.add() : this.update();
  }
}
