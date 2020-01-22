package ua.com.flowershop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.WarehouseOperation;
import ua.com.flowershop.entity.WarehouseOperationType;
import ua.com.flowershop.exception.ConflictException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.WarehouseOperationModel;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.WarehouseOperationRepository;
import ua.com.flowershop.repository.WarehouseOperationTypeRepository;

import javax.transaction.Transactional;

@Service
public class WarehouseOperationService {

    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private WarehouseOperationTypeRepository warehouseOperationTypeRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    @Transactional
    public void create(WarehouseOperationModel warehouseOperationModel) {

        FlowerSize flowerSize = flowerSizeRepository.findById(warehouseOperationModel.getFlowerSize().getId())
            .orElseThrow(NotFoundException::new);

        WarehouseOperationType warehouseOperationType = warehouseOperationTypeRepository.findById(warehouseOperationModel.getWarehouseOperationType().getId())
            .orElseThrow(NotFoundException::new);

        warehouseOperationRepository.save(new WarehouseOperation()
            .setAmount(warehouseOperationModel.getAmount())
            .setFlowerSize(flowerSize)
            .setWarehouseOperationType(warehouseOperationType));

        if (warehouseOperationModel.getWarehouseOperationType().getDirection().equals(WarehouseOperationType.Direction.IN)) {
            flowerSize.setAmount(flowerSize.getAmount() + warehouseOperationModel.getAmount());
        } else {
            if (flowerSize.getAvailable() < warehouseOperationModel.getAmount()) {
                throw new ConflictException("Недостатньо доступного товару для проведення операці");
            }
            flowerSize.setAmount(flowerSize.getAmount() - warehouseOperationModel.getAmount());
        }

        flowerSizeRepository.save(flowerSize);
    }

    public void cancel(Long id) {
        WarehouseOperation warehouseOperation = warehouseOperationRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        FlowerSize flowerSize = flowerSizeRepository.findById(warehouseOperation.getFlowerSize().getId())
            .orElseThrow(NotFoundException::new);

        if (warehouseOperation.getWarehouseOperationType().getDirection().equals(WarehouseOperationType.Direction.IN)) {
            if (flowerSize.getAvailable() < warehouseOperation.getAmount()) {
                throw new ConflictException("Недостатньо доступного товару для відміни операці");
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
