package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.Size;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.SizeModel;
import ua.com.flowershop.projection.SizeAdminProjection;
import ua.com.flowershop.projection.SizeProjection;
import ua.com.flowershop.repository.SizeRepository;
import ua.com.flowershop.service.SizeService;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.SIZES_PATH;

@RestController
@RequestMapping(SIZES_PATH)
public class SizeController {

    @Autowired private SizeRepository sizeRepository;
    @Autowired private SizeService sizeService;

    @GetMapping("/forAdmin")
    public ResponseEntity<List<SizeAdminProjection>> getAllForAdmin() {
        List<SizeAdminProjection> colors = sizeRepository.findForAdminProjectedBy();
        return new ResponseEntity<>(colors, OK);
    }

    @GetMapping
    public ResponseEntity<List<SizeProjection>> getAll() {
        return new ResponseEntity<>(sizeService.getAllSizes(), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SizeAdminProjection> getById(@PathVariable Long id) {
        SizeAdminProjection size = sizeRepository.findForAdminProjectedById(id).orElseThrow(NotFoundException::new);
        return new ResponseEntity<>(size, OK);
    }

    @GetMapping("/isNameFree")
    public ResponseEntity<Void> isNameFree(@RequestParam("name") String name) {
        return new ResponseEntity<>(sizeService.isNameFree(name) ? OK : CONFLICT);
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody SizeModel sizeModel) {
        sizeRepository.save(Size.of(sizeModel));
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody SizeModel sizeModel) {
        sizeService.update(id, sizeModel);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sizeRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }

}
