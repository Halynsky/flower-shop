package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.FlowerModel;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.projection.FlowerShortProjection;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.service.FlowerService;
import ua.com.flowershop.util.HibernateUtil;
import ua.com.flowershop.util.annotation.PageableSwagger;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/flowers")
public class FlowerController {

//    TODO: Create FlowerAdminProjection and insert it in to forAdmin
//    TODO: Save and update from admin panel

    @Autowired private FlowerService flowerService;
    @Autowired private FlowerRepository flowerRepository;

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
        return new ResponseEntity<>(flowerRepository.findProjectedBy(), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerFullProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerById(id), OK);
    }

    @PageableSwagger
    @GetMapping("/shop")
    public ResponseEntity<Page<FlowerShortProjection>> getForShop(
        @RequestParam(required = false) String searchTerm,
        @RequestParam(required = false) List<Long> flowerTypeFilters,
        @RequestParam(required = false) List<Long> sizeFilters,
        @RequestParam(required = false) List<Long> colorFilters,
        @PageableDefault(sort = "popularity", direction = Sort.Direction.DESC) Pageable pageRequest) {
        flowerTypeFilters = HibernateUtil.fixEmptyFilter(flowerTypeFilters);
        sizeFilters = HibernateUtil.fixEmptyFilter(sizeFilters);
        colorFilters = HibernateUtil.fixEmptyFilter(colorFilters);

        Sort.Order sortOrder = pageRequest.getSort().get().findFirst().orElse(null);
        if (Objects.nonNull(sortOrder) && sortOrder.getProperty().equals("price")) {
            pageRequest = PageRequest.of(pageRequest.getPageNumber(), pageRequest.getPageSize(), JpaSort.unsafe(sortOrder.getDirection(), "(" + sortOrder.getProperty() + ")"));
        }

        return new ResponseEntity<>(flowerRepository.findProjectedByFilters(searchTerm, flowerTypeFilters, colorFilters, sizeFilters, pageRequest), OK);
    }

    @GetMapping("/{id}/full")
    public ResponseEntity<FlowerFullProjection> getFlowerFullById(@PathVariable Long id) {
        return new ResponseEntity<>(flowerService.getFlowerFullById(id), OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody FlowerModel flower){
        flowerService.updateFlower(id ,flower);
        return new ResponseEntity<>(OK);
    }

    @PostMapping()
    public ResponseEntity<Void> create(@RequestBody FlowerModel flower){
        flowerService.createFlower(flower);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flowerRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }
}
