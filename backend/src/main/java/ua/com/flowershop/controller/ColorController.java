package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.ColorProjection;
import ua.com.flowershop.repository.ColorRepository;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/colors")
public class ColorController {

    @Autowired
    private ColorRepository colorRepository;

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

}
