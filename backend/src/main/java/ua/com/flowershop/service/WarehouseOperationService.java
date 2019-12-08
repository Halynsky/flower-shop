package ua.com.flowershop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.WarehouseOperation;
import ua.com.flowershop.entity.WarehouseOperationType;
import ua.com.flowershop.model.WarehouseOperationModel;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.WarehouseOperationRepository;
import ua.com.flowershop.repository.WarehouseOperationTypeRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
public class WarehouseOperationService {

    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private WarehouseOperationTypeRepository warehouseOperationTypeRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    @Transactional
    public void add(WarehouseOperationModel warehouseOperationModel) {

        FlowerSize flowerSize = flowerSizeRepository.findById(warehouseOperationModel.getFlowerSize().getId())
            .orElseThrow(EntityNotFoundException::new);

        WarehouseOperationType warehouseOperationType = warehouseOperationTypeRepository.findById(warehouseOperationModel.getWarehouseOperationType().getId())
            .orElseThrow(EntityNotFoundException::new);

        warehouseOperationRepository.save(new WarehouseOperation()
            .setAmount(warehouseOperationModel.getAmount())
            .setFlowerSize(flowerSize)
            .setWarehouseOperationType(warehouseOperationType));

        if (warehouseOperationModel.getWarehouseOperationType().getDirection().equals(WarehouseOperationType.Direction.IN)) {
            flowerSize.setAmount(flowerSize.getAmount() + warehouseOperationModel.getAmount());
        } else {
            flowerSize.setAmount(flowerSize.getAmount() - warehouseOperationModel.getAmount());
        }

        flowerSizeRepository.save(flowerSize);
    }

    public void cancel(Long id) {
        WarehouseOperation warehouseOperation = warehouseOperationRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);

        FlowerSize flowerSize = flowerSizeRepository.findById(warehouseOperation.getFlowerSize().getId())
            .orElseThrow(EntityNotFoundException::new);

        if (warehouseOperation.getWarehouseOperationType().getDirection().equals(WarehouseOperationType.Direction.IN)) {
            if (flowerSize.getAmount() < warehouseOperation.getAmount()) {
                flowerSize.setAmount(0);
            } else {
                flowerSize.setAmount(flowerSize.getAmount() - warehouseOperation.getAmount());
            }
        } else {
            flowerSize.setAmount(flowerSize.getAmount() + warehouseOperation.getAmount());
        }

        warehouseOperation.setIsActive(false);
        warehouseOperationRepository.save(warehouseOperation);
        flowerSizeRepository.save(flowerSize);

    }
}
