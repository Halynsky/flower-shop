package ua.com.flowershop.controller;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.projection.FlowerSizeFullProjection;
import ua.com.flowershop.projection.FlowerSizeFullProjectionWithAvailable;
import ua.com.flowershop.projection.FlowerSizeSelectorProjection;
import ua.com.flowershop.projection.FlowerSizeTinyProjection;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.service.FlowerSizeService;
import ua.com.flowershop.util.PoiExporter;
import ua.com.flowershop.util.annotation.PageableSwagger;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.FLOWER_SIZES_PATH;

@RestController
@RequestMapping(FLOWER_SIZES_PATH)
public class FlowerSizeController {

    @Autowired private FlowerSizeRepository flowerSizeRepository;
    @Autowired private FlowerSizeService flowerSizeService;
    @Autowired private PoiExporter poiExporter;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    public ResponseEntity<Page<FlowerSizeFullProjectionWithAvailable>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                                      @RequestParam(required = false) String codePart,
                                                                                      @RequestParam(required = false) String flowerNamePart,
                                                                                      @RequestParam(required = false) List<String> flowerTypeNames,
                                                                                      @RequestParam(required = false) Integer priceFrom,
                                                                                      @RequestParam(required = false) Integer priceTo,
                                                                                      @RequestParam(required = false) String colorNamePart,
                                                                                      @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        Page<FlowerSizeFullProjectionWithAvailable> flowerSizes = flowerSizeService.findForAdminProjectedByFilters(id, codePart, flowerNamePart, flowerTypeNames, priceFrom, priceTo,
            colorNamePart, pageRequest);
        return new ResponseEntity<>(flowerSizes, OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin/asList")
    public ResponseEntity<List<FlowerSizeSelectorProjection>> getAllForAdmin() {
        return new ResponseEntity<>(flowerSizeRepository.findAllForAdminProjectedByOrderByFlowerNameAscSizeNameAsc(), OK);
    }

    @PageableSwagger
    @GetMapping("/shop")
    public ResponseEntity<Page<FlowerSizeFullProjectionWithAvailable>> getForShop(
        @RequestParam(required = false) String searchTerm,
        @RequestParam(required = false) List<Long> flowerTypeFilters,
        @RequestParam(required = false) List<Long> sizeFilters,
        @RequestParam(required = false) List<Long> colorFilters,
        @PageableDefault(sort = "popularity", direction = Sort.Direction.DESC) Pageable pageRequest) {
        return new ResponseEntity<>(flowerSizeService.getForShop(searchTerm, flowerTypeFilters, sizeFilters, colorFilters, pageRequest), OK);
    }

    @PageableSwagger
    @GetMapping("/shop/{id}")
    public ResponseEntity<FlowerSizeFullProjection> getForShop(@PathVariable Long id) {
        return new ResponseEntity<>(flowerSizeRepository.findProjectedById(id), OK);
    }

    @GetMapping("/byIds")
    public ResponseEntity<List<FlowerSizeTinyProjection>> getByIds(@RequestParam(required = false) List<Long> ids) {
        return new ResponseEntity<>(flowerSizeRepository.findProjectedByIdIn(ids), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/export/excel")
    @PageableSwagger
    public ResponseEntity<Void> exportAllToExcel(@RequestParam(required = false) Long id,
                                                 @RequestParam(required = false) String codePart,
                                                 @RequestParam(required = false) String flowerNamePart,
                                                 @RequestParam(required = false) List<String> flowerTypeNames,
                                                 @RequestParam(required = false) Integer priceFrom,
                                                 @RequestParam(required = false) Integer priceTo,
                                                 @RequestParam(required = false) String colorNamePart,
                                                 @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest,
                                                 HttpServletResponse response) throws IOException {
        List<FlowerSize> leftovers = flowerSizeRepository.getAllLeftovers(id, codePart, flowerNamePart, flowerTypeNames, priceFrom, priceTo, colorNamePart, pageRequest.getSort());
        Workbook workbook = poiExporter.exportLeftoversToExcel(leftovers, null);
        response.setHeader("Content-disposition", "attachment; filename=Orders.xlsx");
        workbook.write(response.getOutputStream());
        return new ResponseEntity<>(OK);
    }

}
