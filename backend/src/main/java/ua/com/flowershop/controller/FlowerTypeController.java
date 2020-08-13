package ua.com.flowershop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.com.flowershop.model.FlowerTypeModel;
import ua.com.flowershop.projection.FlowerTypeProjection;
import ua.com.flowershop.projection.FlowerTypeImageNameTuple;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.service.FlowerTypeService;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.FLOWER_TYPES_PATH;

@RestController
@RequestMapping(FLOWER_TYPES_PATH)
public class FlowerTypeController {

    @Autowired private FlowerTypeService flowerTypeService;
    @Autowired private FlowerTypeRepository flowerTypeRepository;
    @Autowired private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<FlowerTypeProjection>> getAll() {
        List<FlowerTypeProjection> flowerTypes = flowerTypeRepository.findProjectedByOrderByName();
        return new ResponseEntity<>(flowerTypes, OK);
    }

    @GetMapping("/imageNameTuple")
    public ResponseEntity<List<FlowerTypeImageNameTuple>> getAllWithImage() {
        List<FlowerTypeImageNameTuple> flowerTypes = flowerTypeRepository.findAllProjectedByOrderByName();
        return new ResponseEntity<>(flowerTypes, OK);
    }

    @GetMapping("/isNameFree")
    public ResponseEntity<Void> isNameFree(@RequestParam("name") String name) {
        return new ResponseEntity<>(flowerTypeService.isNameFree(name) ? OK : CONFLICT);
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

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Void> create(@RequestPart(value = "data") String data,
                                       @RequestPart(value = "file", required = false) MultipartFile image) throws IOException {
        FlowerTypeModel flowerTypeModel = objectMapper.readValue(data, FlowerTypeModel.class);
        flowerTypeService.create(flowerTypeModel, image);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestPart(value = "data") String data,
                                       @RequestPart(value = "file", required = false) MultipartFile image) throws IOException {
        FlowerTypeModel flowerTypeModel = objectMapper.readValue(data, FlowerTypeModel.class);
        flowerTypeService.update(id, flowerTypeModel, image);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flowerTypeService.delete(id);
        return new ResponseEntity<>(OK);
    }

}
