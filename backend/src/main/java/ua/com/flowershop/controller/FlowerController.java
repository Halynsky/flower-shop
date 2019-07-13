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
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.projection.FlowerShortProjection;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.service.FlowerService;
import ua.com.flowershop.util.HibernateUtil;
import ua.com.flowershop.util.annotation.PageableSwagger;

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
    public ResponseEntity<List<FlowerFullProjection>> getAllForAdmin() {
        return new ResponseEntity<>(flowerService.findForAdmin(), OK);
    }

    @GetMapping
    public ResponseEntity<List<FlowerProjection>> getAll() {
        return new ResponseEntity<>(flowerRepository.findProjectedBy(), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlowerProjection> getById(@PathVariable Long id) {
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

}
