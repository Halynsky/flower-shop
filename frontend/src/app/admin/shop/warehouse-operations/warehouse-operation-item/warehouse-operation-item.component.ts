import { Component } from "@angular/core";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { ColorService } from "../../../../api/services/color.service";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { WarehouseOperation } from "../../../../api/models/WarehouseOperation";
import { WarehouseOperationService } from "../../../../api/services/warehouse-operation.service";
import { FlowerSize } from "../../../../api/models/FlowerSize";
import { WarehouseOperationType } from "../../../../api/models/WarehouseOperationType";
import { EnumToObjectsPipe } from "../../../../pipes/enum-to-objects";
import { TranslationService } from "../../../../utils/translation.service";

@Component({
  selector: 'warehouse-operation-item',
  templateUrl: './warehouse-operation-item.component.html',
  styleUrls: ['./warehouse-operation-item.component.scss']
})
export class WarehouseOperationItemComponent {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  item: WarehouseOperation = new WarehouseOperation();
  itemFlowerSize = new FlowerSize();
  itemWarehouseOperationType = new WarehouseOperationType();

  directionOptions = [];
  operationTypes = [];

  constructor(public dataService: WarehouseOperationService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private translation: TranslationService,
              private enumToObjectsPipe: EnumToObjectsPipe) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams  => {
            if (queryParams['id'])
              this.getItem(queryParams['id'])
          })
        }


      }
    )

    this.directionOptions = enumToObjectsPipe.transform(WarehouseOperationType.Direction);
    this.directionOptions.forEach(e => e.label = translation.text[e.label]);
    this.operationTypes = enumToObjectsPipe.transform(WarehouseOperationType.OperationType);
    this.operationTypes.forEach(e => e.label = translation.text[e.label]);

  }

  getItem(id) {
    this.dataService.getById(id).subscribe(
      item => {
        this.item = item;
        this.itemFlowerSize = item.flowerSize;
        this.itemWarehouseOperationType = item.warehouseOperationType;
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {

  }
}
