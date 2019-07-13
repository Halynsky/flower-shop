package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.WerehouseOperationModel;
import ua.com.flowershop.projection.WerehouseOperationProjection;
import ua.com.flowershop.repository.WerehouseOperationRepository;
import ua.com.flowershop.service.WerehouseOperationService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/werehouseOperations")
public class WerehouseOperationController {

    @Autowired private WerehouseOperationRepository werehouseOperationRepository;
    @Autowired private WerehouseOperationService werehouseOperationService;

    @GetMapping
    public ResponseEntity<List<WerehouseOperationProjection>> getAll() {
        List<WerehouseOperationProjection> werehouseOperations = werehouseOperationRepository.findProjectedBy();
        return new ResponseEntity<>(werehouseOperations, OK);
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
