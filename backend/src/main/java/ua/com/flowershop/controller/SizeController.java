package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.projection.SizeProjection;
import ua.com.flowershop.service.SizeService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/sizes")
public class SizeController {
    @Autowired
    private SizeService sizeService;

    @GetMapping
    public ResponseEntity<List<SizeProjection>> getAll() {
        return new ResponseEntity<>(sizeService.getAllSizes(), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SizeProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(sizeService.getSizeById(id), OK);
    }
}