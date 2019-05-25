package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.Color;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.ColorModel;
import ua.com.flowershop.projection.ColorAdminProjection;
import ua.com.flowershop.projection.ColorProjection;
import ua.com.flowershop.repository.ColorRepository;
import ua.com.flowershop.service.ColorService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/colors")
public class ColorController {

    @Autowired
    private ColorRepository colorRepository;
    @Autowired
    private ColorService colorService;

    @GetMapping("/forAdmin")
    public ResponseEntity<List<ColorAdminProjection>> getAllForAdmin() {
        List<ColorAdminProjection> colors = colorRepository.findForAdminProjectedBy();
        return new ResponseEntity<>(colors, OK);
    }

    @GetMapping
    public ResponseEntity<List<ColorProjection>> getAll() {
        List<ColorProjection> colors = colorRepository.findProjectedBy();
        return new ResponseEntity<>(colors, OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColorProjection> getById(@PathVariable Long id) {
        ColorProjection color = colorRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
        return new ResponseEntity<>(color, OK);
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody ColorModel colorModel) {
        colorRepository.save(Color.of(colorModel));
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody ColorModel colorModel) {
        colorService.update(id, colorModel);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        colorRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }
}
