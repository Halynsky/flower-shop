package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.WarehouseOperationType;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.WarehouseOperationModel;
import ua.com.flowershop.projection.WarehouseOperationProjection;
import ua.com.flowershop.repository.WarehouseOperationRepository;
import ua.com.flowershop.service.WarehouseOperationService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.WAREHOUSE_OPERATIONS_PATH;

@RestController
@RequestMapping(WAREHOUSE_OPERATIONS_PATH)
public class WarehouseOperationController {

    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private WarehouseOperationService warehouseOperationService;

    @PageableSwagger
    @GetMapping
    public ResponseEntity<Page<WarehouseOperationProjection>> getAll(@RequestParam(required = false) Long id,
                                                                     @RequestParam(required = false) String flowerTypeNamePart,
                                                                     @RequestParam(required = false) String flowerNamePart,
                                                                     @RequestParam(required = false) String flowerSizeNamePart,
                                                                     @RequestParam(required = false) Integer amountFrom,
                                                                     @RequestParam(required = false) Integer amountTo,
                                                                     @RequestParam(required = false) LocalDateTime dateFrom,
                                                                     @RequestParam(required = false) LocalDateTime dateTo,
                                                                     @RequestParam(required = false) List<WarehouseOperationType.OperationType> operationTypes,
                                                                     @RequestParam(required = false) List<WarehouseOperationType.Direction> directions,
                                                                     @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        Page<WarehouseOperationProjection> page = warehouseOperationRepository.findProjectedByFilters(id, flowerTypeNamePart, flowerNamePart, flowerSizeNamePart,
            amountFrom, amountTo, dateFrom, dateTo, operationTypes, directions, pageRequest);
        return new ResponseEntity<>(page, OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseOperationProjection> getById(@PathVariable Long id) {
        WarehouseOperationProjection warehouseOperationProjection = warehouseOperationRepository.findProjectedById(id)
            .orElseThrow(NotFoundException::new);
        return new ResponseEntity<>(warehouseOperationProjection, OK);
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody WarehouseOperationModel warehouseOperationModel) {
        warehouseOperationService.save(warehouseOperationModel);
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody WarehouseOperationModel warehouseOperationModel) {
        warehouseOperationService.update(id, warehouseOperationModel);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        warehouseOperationRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }

}
