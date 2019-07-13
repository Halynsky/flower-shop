package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.model.FlowerTypeModel;
import ua.com.flowershop.projection.FlowerTypeProjection;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.service.FlowerTypeService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/flowerTypes")
public class FlowerTypeController {

    @Autowired private FlowerTypeService flowerTypeService;
    @Autowired private FlowerTypeRepository flowerTypeRepository;

    @GetMapping
    public ResponseEntity<List<FlowerTypeProjection>> getAll() {
        List<FlowerTypeProjection> flowerTypes = flowerTypeRepository.findProjectedByOrderByName();
        return new ResponseEntity<>(flowerTypes, OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerTypeProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerTypeService.getFlowerType(id), OK);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<FlowerTypeProjection> getByName(@PathVariable String name) {
        return new ResponseEntity<>(flowerTypeService.getFlowerTypeByName(name), OK);
    }

    @GetMapping("/search/byName/{name}")
    public ResponseEntity<List<FlowerTypeProjection>> searchByName(@PathVariable String name) {
        return new ResponseEntity<>(flowerTypeRepository.findProjectedByNameStartingWith(name), OK);
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody FlowerTypeModel flowerTypeModel) {
        flowerTypeRepository.save(FlowerType.of(flowerTypeModel));
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody FlowerTypeModel flowerTypeModel) {
        flowerTypeService.update(id, flowerTypeModel);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flowerTypeRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }

}
