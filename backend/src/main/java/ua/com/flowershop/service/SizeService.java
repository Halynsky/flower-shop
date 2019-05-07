package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.SizeProjection;
import ua.com.flowershop.repository.SizeRepository;

import java.util.List;

@Slf4j
@Service
public class SizeService {
    @Autowired
    private SizeRepository sizeRepository;

    public List<SizeProjection> getAllSizes() {
        return sizeRepository.findBy();
    }

    public SizeProjection getSizeById(Long id) {
        return sizeRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }
}
