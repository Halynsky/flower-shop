package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.Size;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.SizeModel;
import ua.com.flowershop.projection.SizeProjection;
import ua.com.flowershop.repository.SizeRepository;

import java.util.List;

@Slf4j
@Service
public class SizeService {

    @Autowired private SizeRepository sizeRepository;

    public List<SizeProjection> getAllSizes() {
        return sizeRepository.findProjectedByOrderByName();
    }

    public SizeProjection getSizeById(Long id) {
        return sizeRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public Size update(Long id, SizeModel sizeModel) {
        Size size = sizeRepository.findById(id).orElseThrow(NotFoundException::new);
        size.setName(sizeModel.getName());
        return sizeRepository.save(size);
    }

    public Boolean isNameFree(String name) {
        return !sizeRepository.existsByName(name);
    }

}
