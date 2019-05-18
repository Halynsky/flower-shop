package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.projection.FlowerShortProjection;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.service.FlowerService;
import ua.com.flowershop.util.HibernateUtil;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/flowers")
public class FlowerController {

    @Autowired
    private FlowerService flowerService;
    @Autowired
    private FlowerRepository flowerRepository;

    @GetMapping("/forAdmin")
    public ResponseEntity<List<FlowerProjection>> getAllForAdmin() {
        return new ResponseEntity<>(flowerService.getAllFlowers(), OK);
    }

    @GetMapping
    public ResponseEntity<List<FlowerProjection>> getAll() {
        return new ResponseEntity<>(flowerService.getAllFlowers(), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerById(id), OK);
    }

    @GetMapping("/shop")
    public ResponseEntity<List<FlowerShortProjection>> getForShop(
            @RequestParam(required = false) List<Long> flowerTypeFilters,
            @RequestParam(required = false) List<Long> sizeFilters,
            @RequestParam(required = false) List<Long> colorFilters) {
        flowerTypeFilters = HibernateUtil.fixEmptyFilter(flowerTypeFilters);
        sizeFilters = HibernateUtil.fixEmptyFilter(sizeFilters);
        colorFilters = HibernateUtil.fixEmptyFilter(colorFilters);
        return new ResponseEntity<>(flowerRepository.findProjectedByFilters(flowerTypeFilters, colorFilters, sizeFilters), OK);
    }

    @GetMapping("/{id}/full")
    public ResponseEntity<FlowerFullProjection> getFlowerFullById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerFullById(id), OK);
    }

}
