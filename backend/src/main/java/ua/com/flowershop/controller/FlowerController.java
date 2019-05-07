package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.service.FlowerService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/flowers")
public class FlowerController {

    @Autowired
    private FlowerService flowerService;

    @GetMapping
    public ResponseEntity<List<FlowerProjection>> getAll() {
        return new ResponseEntity<>(flowerService.getAllFlowers(), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerById(id), OK);
    }
}
