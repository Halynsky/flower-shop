package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.projection.UserAdminProjection;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.util.annotation.PageableSwagger;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.USERS_PATH;

@RestController
@RequestMapping(USERS_PATH)
public class UserController {

    @Autowired private UserRepository userRepository;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    @PageableSwagger
    public ResponseEntity<Page<UserAdminProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                    @RequestParam(required = false) String namePart,
                                                                    @RequestParam(required = false) String emailPart,
                                                                    @RequestParam(required = false) Boolean isEnabled,
                                                                    @RequestParam(required = false) Boolean isVirtual,
                                                                    @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(userRepository.findProjectedBy(id, namePart, emailPart, pageRequest), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserAdminProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(userRepository.findProjectedById(id), OK);
    }

}
