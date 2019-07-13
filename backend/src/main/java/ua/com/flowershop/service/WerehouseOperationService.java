package ua.com.flowershop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.WerehouseOperation;
import ua.com.flowershop.model.WerehouseOperationModel;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.WerehouseOperationRepository;

import javax.persistence.EntityNotFoundException;

@Service
public class WerehouseOperationService {

    @Autowired private WerehouseOperationRepository werehouseOperationRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public void update(Long id, WerehouseOperationModel werehouseOperationModel) {
        WerehouseOperation werehouseOperation = werehouseOperationRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        FlowerSize flowerSize = flowerSizeRepository.findById(werehouseOperationModel.getFlowerSizeId())
                .orElseThrow(EntityNotFoundException::new);

        werehouseOperationRepository.save(werehouseOperation
                .setAmount(werehouseOperationModel.getAmount())
                .setFlowerSize(flowerSize));

    }

    public void save(WerehouseOperationModel werehouseOperationModel) {
        FlowerSize flowerSize = flowerSizeRepository.findById(werehouseOperationModel.getFlowerSizeId())
                .orElseThrow(EntityNotFoundException::new);

        werehouseOperationRepository.save(new WerehouseOperation()
                .setAmount(werehouseOperationModel.getAmount())
                .setFlowerSize(flowerSize));
    }

}
