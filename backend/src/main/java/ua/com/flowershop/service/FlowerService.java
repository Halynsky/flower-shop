package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.repository.FlowerRepository;

import java.util.List;

@Slf4j
@Service
public class FlowerService {

    @Autowired
    private FlowerRepository flowerRepository;

    public List<FlowerFullProjection> findForAdmin() {
        return flowerRepository.findForAdminProjectedBy();
    }

    public FlowerProjection getFlowerById(Long id) {
        return flowerRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public FlowerFullProjection getFlowerFullById(Long id) {
        return flowerRepository.findFullProjectedById(id).orElseThrow(NotFoundException::new);
    }

}
