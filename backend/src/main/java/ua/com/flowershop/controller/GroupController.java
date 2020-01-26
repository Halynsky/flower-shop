package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.GroupModel;
import ua.com.flowershop.projection.GroupAdminProjection;
import ua.com.flowershop.projection.GroupProjection;
import ua.com.flowershop.projection.GroupProjectionFull;
import ua.com.flowershop.repository.GroupRepository;
import ua.com.flowershop.service.GroupService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.GROUPS_PATH;

@RestController
@RequestMapping(GROUPS_PATH)
public class GroupController {

    @Autowired private GroupRepository groupRepository;
    @Autowired private GroupService groupService;

    @GetMapping("/forAdmin")
    public ResponseEntity<List<GroupAdminProjection>> getAllForAdmin() {
        return new ResponseEntity<>(groupRepository.findForAdminProjectedOrderByName(), OK);
    }

    @GetMapping
    public ResponseEntity<List<GroupProjectionFull>> getAll() {
        return new ResponseEntity<>(groupRepository.findProjectedByOrderByName(), OK);
    }

    @GetMapping("byFlowerType/{flowerTypeId}")
    public ResponseEntity<List<GroupProjection>> getByFlowerTypeId(@PathVariable Long flowerTypeId) {
        return new ResponseEntity<>(groupRepository.findProjectedByFlowerTypeId(flowerTypeId), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupProjectionFull> getById(@PathVariable Long id) {
        return new ResponseEntity<>(groupRepository.findProjectedById(id).orElseThrow(NotFoundException::new), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody GroupModel groupModel) {
        groupService.create(groupModel);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody GroupModel groupModel) {
        groupService.update(id, groupModel);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        groupRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }
}
