package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.Color;
import ua.com.flowershop.entity.Size;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.ColorModel;
import ua.com.flowershop.model.SizeModel;
import ua.com.flowershop.projection.SizeProjection;
import ua.com.flowershop.repository.ColorRepository;
import ua.com.flowershop.repository.SizeRepository;

import java.util.List;

@Slf4j
@Service
public class ColorService {

    @Autowired private ColorRepository colorRepository;

    public Color update(Long id, ColorModel colorModel) {
        Color color = colorRepository.findById(id).orElseThrow(NotFoundException::new);
        color.setName(colorModel.getName());
        color.setHex(colorModel.getHex());
        return colorRepository.save(color);
    }

}
