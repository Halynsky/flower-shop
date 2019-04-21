package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.service.FlowerTypeService;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("flowerTypes")
public class FlowerTypeController {

    @Autowired
    private FlowerTypeService flowerTypeService;
    @Autowired
    private FlowerTypeRepository flowerTypeRepository;

    @GetMapping
    public ResponseEntity<List<FlowerType>> getAll() {
        List<FlowerType> flowerTypes = flowerTypeService.getAllFlowerTypes();
        return new ResponseEntity<>(flowerTypes, OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerType> getById(@PathVariable long id) {
        FlowerType flowerType = flowerTypeService.getFlowerType(id);
        return new ResponseEntity<>(flowerType, OK);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<FlowerType> byName(@PathVariable String name) {
        FlowerType flowerType = flowerTypeRepository.findByName(name);
        HttpStatus status = flowerType == null ? NOT_FOUND : OK;
        return new ResponseEntity<>(flowerType, status);
    }

    @GetMapping("/searchByName/{name}")
    public ResponseEntity<List<FlowerType>> searchByName(@PathVariable String name) {
        List<FlowerType> flowerTypes = flowerTypeRepository.findByNameStartingWith(name);
        return new ResponseEntity<>(flowerTypes, OK);
    }

}
