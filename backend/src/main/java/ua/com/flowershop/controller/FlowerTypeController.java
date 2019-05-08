package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.projection.FlowerTypeProjection;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.service.FlowerTypeService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/flowerTypes")
public class FlowerTypeController {

    @Autowired
    private FlowerTypeService flowerTypeService;
    @Autowired
    private FlowerTypeRepository flowerTypeRepository;

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
    public ResponseEntity<FlowerTypeProjection> byName(@PathVariable String name) {
        return new ResponseEntity<>(flowerTypeService.getFlowerTypeByName(name), OK);
    }

    @GetMapping("/searchByName/{name}")
    public ResponseEntity<List<FlowerTypeProjection>> searchByName(@PathVariable String name) {
        return new ResponseEntity<>(flowerTypeRepository.findProjectedByNameStartingWith(name), OK);
    }

}
