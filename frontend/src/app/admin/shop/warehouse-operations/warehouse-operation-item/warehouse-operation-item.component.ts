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
import { Location } from '@angular/common';

@Component({
  selector: 'warehouse-operation-item',
  templateUrl: './warehouse-operation-item.component.html',
  styleUrls: ['./warehouse-operation-item.component.scss']
})
export class WarehouseOperationItemComponent {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  item: WarehouseOperation = new WarehouseOperation();

  itemWarehouseOperationType = new WarehouseOperationType();

  operationTypes = [];
  directionOption = '';

  flowersOptions;
  sizeOptions;
  flowerChosen: FlowerFull;
  flowerSizeChosen: FlowerSize;

  initialFlowerId;
  initialSizeId;

  constructor(public dataService: WarehouseOperationService,
              private snackBarService: SnackBarService,
              private router: Router,
              public location: Location,
              private route: ActivatedRoute,
              private translation: TranslationService,
              private enumToObjectsPipe: EnumToObjectsPipe,
              private flowerService: FlowerService) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];
      }
    );

    this.route.queryParams.subscribe(params => {
      this.initialFlowerId = params['flowerId'];
      this.initialSizeId = params['sizeId'];
    });

    this.getAllFlowers();
    this.operationTypes = enumToObjectsPipe.transform(WarehouseOperationType.OperationType);
    this.operationTypes.forEach(e => e.label = translation.text.operationTypes[e.label]);
  }


  getWarehouseOperationType() {
    this.dataService.getWarehouseOperationType(this.itemWarehouseOperationType.operationType).subscribe(
      item => {
        this.itemWarehouseOperationType = item;
        if (item.direction === WarehouseOperationType.Direction.IN) {
          this.directionOption = 'Прихід';
        } else {
          this.directionOption = 'Відхід';
        }
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  getFlowersSizeById(id) {
    this.flowerService.getFlowerSizesById(id).subscribe(items => {
        this.sizeOptions = items;
        console.log("SIZE ID", this.initialSizeId);
        if (this.initialSizeId) {
          this.flowerSizeChosen = this.sizeOptions.find(item => item.size.id == this.initialSizeId);
          this.initialSizeId = null;
        }
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  getAllFlowers() {
    this.flowerService.getForSelector().subscribe(items => {
        this.flowersOptions = items;
        if (this.initialFlowerId) {
          this.flowerChosen = this.flowersOptions.find(item => item.id == this.initialFlowerId);
          this.getFlowersSizeById(this.flowerChosen.id)
        }
      },
      error => this.snackBarService.showError(getErrorMessage(error)))
  }

  add() {
    this.dataService.add(this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Товарну операцію успішно створено");
        this.location.back();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.item.warehouseOperationType = this.itemWarehouseOperationType;
    this.item.flowerSize = this.flowerSizeChosen;
    this.add() ;
  }
}
