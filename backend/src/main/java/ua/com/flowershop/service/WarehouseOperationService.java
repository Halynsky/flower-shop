package ua.com.flowershop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.WarehouseOperation;
import ua.com.flowershop.model.WarehouseOperationModel;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.WarehouseOperationRepository;

import javax.persistence.EntityNotFoundException;

@Service
public class WarehouseOperationService {

    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public void update(Long id, WarehouseOperationModel warehouseOperationModel) {
        WarehouseOperation warehouseOperation = warehouseOperationRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);

        FlowerSize flowerSize = flowerSizeRepository.findById(warehouseOperationModel.getFlowerSizeId())
            .orElseThrow(EntityNotFoundException::new);

        warehouseOperationRepository.save(warehouseOperation
            .setAmount(warehouseOperationModel.getAmount())
            .setFlowerSize(flowerSize));

    }

    public void save(WarehouseOperationModel warehouseOperationModel) {
        FlowerSize flowerSize = flowerSizeRepository.findById(warehouseOperationModel.getFlowerSizeId())
            .orElseThrow(EntityNotFoundException::new);

        warehouseOperationRepository.save(new WarehouseOperation()
            .setAmount(warehouseOperationModel.getAmount())
            .setFlowerSize(flowerSize));
    }

}
