package ua.com.flowershop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.com.flowershop.model.FlowerModel;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.projection.FlowerSizeFullProjection;
import ua.com.flowershop.projection.FlowerWithAvailableFlagProjection;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.service.FlowerService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.FLOWERS_PATH;

@RestController
@RequestMapping(FLOWERS_PATH)
public class FlowerController {

    @Autowired private FlowerService flowerService;
    @Autowired private FlowerRepository flowerRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;
    @Autowired private ObjectMapper objectMapper;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    public ResponseEntity<Page<FlowerFullProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                     @RequestParam(required = false) String flowerNamePart,
                                                                     @RequestParam(required = false) String flowerOriginalNamePart,
                                                                     @RequestParam(required = false) List<String> flowerTypeNames,
                                                                     @RequestParam(required = false) String groupNamePart,
                                                                     @RequestParam(required = false) Integer sizeFrom,
                                                                     @RequestParam(required = false) Integer sizeTo,
                                                                     @RequestParam(required = false) Integer heightFrom,
                                                                     @RequestParam(required = false) Integer heightTo,
                                                                     @RequestParam(required = false) Integer popularityFrom,
                                                                     @RequestParam(required = false) Integer popularityTo,
                                                                     @RequestParam(required = false) String colorNamePart,
                                                                     @RequestParam(required = false) LocalDateTime createdFrom,
                                                                     @RequestParam(required = false) LocalDateTime createdTo,
                                                                     @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(flowerService.findForAdmin(id, flowerNamePart, flowerOriginalNamePart, flowerTypeNames, groupNamePart, sizeFrom, sizeTo, heightFrom,
            heightTo, popularityFrom, popularityTo, colorNamePart, createdFrom, createdTo, pageRequest), OK);
    }

    @GetMapping
    public ResponseEntity<List<FlowerProjection>> getAll() {
        return new ResponseEntity<>(flowerRepository.findProjectedByOrderByName(), OK);
    }

    @GetMapping("/forSelector")
    public ResponseEntity<List<FlowerProjection>> getForSelector() {
        return new ResponseEntity<>(flowerRepository.findProjectedByOrderByName(), OK);
    }

    @GetMapping("/{id}/flowerSizes")
    public ResponseEntity<List<FlowerSizeFullProjection>> getAllFlowerSize(@PathVariable Long id) {
        return new ResponseEntity<>(flowerSizeRepository.findProjectedByFlowerId(id), OK);
    }

    @GetMapping("/isNameOriginalFree")
    public ResponseEntity<Void> isNameOriginalFree(@RequestParam("name") String name) {
        return new ResponseEntity<>(flowerService.isNameOriginalFree(name) ? OK : CONFLICT);
    }

    @GetMapping("/isNameFree")
    public ResponseEntity<Void> isNameFree(@RequestParam("name") String name) {
        return new ResponseEntity<>(flowerService.isNameFree(name) ? OK : CONFLICT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerFullProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerById(id), OK);
    }

    @PageableSwagger
    @GetMapping("/shop")
    public ResponseEntity<Page<FlowerWithAvailableFlagProjection>> getForShop(
        @RequestParam(required = false) String searchTerm,
        @RequestParam(required = false) List<Long> flowerTypeFilters,
        @RequestParam(required = false) List<Long> sizeFilters,
        @RequestParam(required = false) List<Long> colorFilters,
        @PageableDefault(sort = "popularity", direction = Sort.Direction.DESC) Pageable pageRequest) {

        return new ResponseEntity<>(flowerService.getForShop(searchTerm, flowerTypeFilters, colorFilters, sizeFilters, pageRequest), OK);
    }

    @GetMapping("/{id}/full")
    public ResponseEntity<FlowerFullProjection> getFlowerFullById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerFullById(id), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Void> create(@RequestPart(value = "data") String data,
                                       @RequestPart(value = "file", required = false) MultipartFile image) throws IOException {
        FlowerModel flowerModel = objectMapper.readValue(data, FlowerModel.class);
        flowerService.create(flowerModel, image);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestPart(value = "data") String data,
                                       @RequestPart(value = "file", required = false) MultipartFile image) throws IOException {
        FlowerModel flowerModel = objectMapper.readValue(data, FlowerModel.class);
        flowerService.update(id, flowerModel, image);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flowerRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }
}
