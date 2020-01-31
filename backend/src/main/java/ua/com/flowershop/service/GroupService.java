package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.entity.Group;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.GroupModel;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.repository.GroupRepository;

@Slf4j
@Service
public class GroupService {

    @Autowired private GroupRepository groupRepository;
    @Autowired private FlowerTypeRepository flowerTypeRepository;

    public void create(GroupModel groupModel) {
        Group group = new Group();
        FlowerType flowerType = flowerTypeRepository.findById(groupModel.getFlowerType().getId()).orElseThrow(NotFoundException::new);
        group.setName(groupModel.getName())
            .setNameSingle(groupModel.getNameSingle())
            .setNameOriginal(groupModel.getNameOriginal())
            .setNameOriginalSingle(groupModel.getNameOriginalSingle())
            .setFlowerType(flowerType)
            .setDescription(groupModel.getDescription());
        groupRepository.save(group);
    }

    public Group update(Long id, GroupModel groupModel) {
        Group group = groupRepository.findById(id).orElseThrow(NotFoundException::new);
        FlowerType flowerType = flowerTypeRepository.findById(groupModel.getFlowerType().getId()).orElseThrow(NotFoundException::new);
        group.setName(groupModel.getName())
            .setNameSingle(groupModel.getNameSingle())
            .setNameOriginal(groupModel.getNameOriginal())
            .setNameOriginalSingle(groupModel.getNameOriginalSingle())
            .setFlowerType(flowerType)
            .setDescription(groupModel.getDescription());
        return groupRepository.save(group);
    }


}
