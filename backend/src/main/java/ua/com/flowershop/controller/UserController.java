package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.UserAdminModel;
import ua.com.flowershop.projection.UserAdminProjection;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.service.UserService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.USERS_PATH;

@RestController
@RequestMapping(USERS_PATH)
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    @PageableSwagger
    public ResponseEntity<Page<UserAdminProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                    @RequestParam(required = false) String namePart,
                                                                    @RequestParam(required = false) String emailPart,
                                                                    @RequestParam(required = false) String phonePart,
                                                                    @RequestParam(required = false) Boolean isEnabled,
                                                                    @RequestParam(required = false) Boolean isVirtual,
                                                                    @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(userRepository.findProjectedBy(id, namePart, emailPart, phonePart, pageRequest), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserAdminProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(userRepository.findProjectedById(id), OK);
    }

    @GetMapping("/isEmailFree")
    public ResponseEntity<Void> isEmailFree(@RequestParam String email) {
        return new ResponseEntity<>(!userRepository.existsByEmail(email) ? OK : CONFLICT);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody UserAdminModel user){
        userService.update(id ,user);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping()
    public ResponseEntity<Void> create(@RequestBody UserAdminModel user){
        userService.createVirtual(user);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @DeleteMapping("/{id}/disabled")
    public ResponseEntity<Void> updateDisabled(@PathVariable Long id, @RequestParam Boolean disabled) {
        userService.updateDisabled(id, disabled);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/merge")
    public ResponseEntity<Void> merge(@PathVariable Long id, @RequestBody String otherId) {
        userService.merge(id, Long.parseLong(otherId));
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/changeNote")
    public ResponseEntity<Void> changeNote(@PathVariable Long id, @RequestBody(required=false) String note) {
        userService.changeNote(id, note);
        return new ResponseEntity<>(OK);
    }


    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping("/{id}/activation/request")
    public ResponseEntity<Void> resendActivationRequest(@PathVariable Long id){
        userService.resendActivationRequest(id);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping("/{id}/password/restore/request")
    public ResponseEntity<Void> resendPasswordRestoredRequest(@PathVariable Long id){
        userService.passwordRestoreRequest(id);
        return new ResponseEntity<>(OK);
    }

}
