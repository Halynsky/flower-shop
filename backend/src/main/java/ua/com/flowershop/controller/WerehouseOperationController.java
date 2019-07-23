package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.WerehouseOperationType;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.WerehouseOperationModel;
import ua.com.flowershop.projection.WerehouseOperationProjection;
import ua.com.flowershop.repository.WerehouseOperationRepository;
import ua.com.flowershop.service.WerehouseOperationService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/werehouseOperations")
public class WerehouseOperationController {

    @Autowired private WerehouseOperationRepository werehouseOperationRepository;
    @Autowired private WerehouseOperationService werehouseOperationService;

    @PageableSwagger
    @GetMapping
    public ResponseEntity<Page<WerehouseOperationProjection>> getAll(@RequestParam(required = false) Long id,
                                                                     @RequestParam(required = false) String flowerTypeNamePart,
                                                                     @RequestParam(required = false) String flowerNamePart,
                                                                     @RequestParam(required = false) String flowerSizeNamePart,
                                                                     @RequestParam(required = false) Integer amountFrom,
                                                                     @RequestParam(required = false) Integer amountTo,
                                                                     @RequestParam(required = false) LocalDateTime dateFrom,
                                                                     @RequestParam(required = false) LocalDateTime dateTo,
                                                                     @RequestParam(required = false) List<WerehouseOperationType.OperationType> operationTypes,
                                                                     @RequestParam(required = false) List<WerehouseOperationType.Direction> directions,
                                                                     @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        Page<WerehouseOperationProjection> page = werehouseOperationRepository.findProjectedByFilters(id, flowerTypeNamePart, flowerNamePart, flowerSizeNamePart,
            amountFrom, amountTo, dateFrom, dateTo, operationTypes, directions, pageRequest);
        return new ResponseEntity<>(page, OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WerehouseOperationProjection> getById(@PathVariable Long id) {
        WerehouseOperationProjection werehouseOperationProjection = werehouseOperationRepository.findProjectedById(id)
            .orElseThrow(NotFoundException::new);
        return new ResponseEntity<>(werehouseOperationProjection, OK);
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody WerehouseOperationModel werehouseOperationModel) {
        werehouseOperationService.save(werehouseOperationModel);
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody WerehouseOperationModel werehouseOperationModel) {
        werehouseOperationService.update(id, werehouseOperationModel);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        werehouseOperationRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }

}
