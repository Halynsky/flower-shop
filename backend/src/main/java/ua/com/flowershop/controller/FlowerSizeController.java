package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.projection.FlowerSizeFullProjection;
import ua.com.flowershop.projection.FlowerSizeTinyProjection;
import ua.com.flowershop.repository.FlowerSizeRepository;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.FLOWER_SIZES_PATH;

@RestController
@RequestMapping(FLOWER_SIZES_PATH)
public class FlowerSizeController {

    @Autowired private FlowerSizeRepository flowerSizeRepository;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    public ResponseEntity<Page<FlowerSizeFullProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                         @RequestParam(required = false) String flowerNamePart,
                                                                         @RequestParam(required = false) List<String> flowerTypeNames,
                                                                         @RequestParam(required = false) Integer priceFrom,
                                                                         @RequestParam(required = false) Integer priceTo,
                                                                         @RequestParam(required = false) String colorNamePart,
                                                                         @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        Page<FlowerSizeFullProjection> flowerSizes = flowerSizeRepository.findForAdminProjectedByFilters(id, flowerNamePart, flowerTypeNames, priceFrom, priceTo,
            colorNamePart, pageRequest);
        return new ResponseEntity<>(flowerSizes, OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin/asList")
    public ResponseEntity<List<FlowerSizeTinyProjection>> getAllForAdmin() {
        return new ResponseEntity<>(flowerSizeRepository.findAllForAdminProjectedByOrderByFlowerNameAscSizeNameAsc(), OK);
    }

    @GetMapping("/byIds")
    public ResponseEntity<List<FlowerSizeTinyProjection>> getByIds(@RequestParam(required = false) List<Long> ids) {
        return new ResponseEntity<>(flowerSizeRepository.findProjectedByIdIn(ids), OK);
    }

}
