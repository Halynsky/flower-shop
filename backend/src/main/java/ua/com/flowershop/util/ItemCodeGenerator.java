package ua.com.flowershop.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.repository.FlowerSizeRepository;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

@Service
public class ItemCodeGenerator {

    private static final int MAX_GROUP_SYMBOLS = 3;
    private static final int MAX_ID_SYMBOLS = 4;

    @Autowired private FlowerSizeRepository flowerSizeRepository;

    @PostConstruct
    public void init() {
        insertFlowerSizeCodesForOldObjects();
    }

    public String generateCode(Long flowerTypeId, Long flowerSizeId) {
        String flowerTypeIdLiteral = flowerTypeId.toString();
        String flowerSizeIdLiteral = flowerSizeId.toString();

        while (flowerTypeIdLiteral.length() < MAX_GROUP_SYMBOLS) {
            flowerTypeIdLiteral = "0" + flowerTypeIdLiteral;
        }

        while (flowerSizeIdLiteral.length() < MAX_ID_SYMBOLS) {
            flowerSizeIdLiteral = "0" + flowerSizeIdLiteral;
        }

        return flowerTypeIdLiteral + flowerSizeIdLiteral;
    }

    @Transactional
    public void insertFlowerSizeCodesForOldObjects() {
        Map<Long, List<FlowerSize>> groupedFlowerSizes = flowerSizeRepository.findAllByCodeIsNull().stream()
            .collect(groupingBy(FlowerSize::getId));
        groupedFlowerSizes.forEach((flowerId, flowerSizes) -> {
            int index = 0;
            for (FlowerSize flowerSize : flowerSizes) {
                flowerSize.setCode(generateCode(flowerSize.getFlower().getFlowerType().getId(), flowerSize.getId()));
                index++;
                flowerSizeRepository.save(flowerSize);
            }
        });
    }

}
