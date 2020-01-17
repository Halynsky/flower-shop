package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.IdAmountTuple;
import ua.com.flowershop.model.OrderContactsChangeRequestModel;
import ua.com.flowershop.model.OrderModel;
import ua.com.flowershop.model.OrderStatusChangeRequestModel;
import ua.com.flowershop.projection.OrderAdminProjection;
import ua.com.flowershop.projection.OrderProjection;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.OrderService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.ORDERS_PATH;

@RestController
@RequestMapping(ORDERS_PATH)
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private SecurityService securityService;


    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    @PageableSwagger
    public ResponseEntity<Page<OrderAdminProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                     @RequestParam(required = false) List<String> statusNames,
                                                                     @RequestParam(required = false) Long userId,
                                                                     @RequestParam(required = false) String userNamePart,
                                                                     @RequestParam(required = false) String userFacebookNicknamePart,
                                                                     @RequestParam(required = false) String phonePart,
                                                                     @RequestParam(required = false) LocalDateTime createdFrom,
                                                                     @RequestParam(required = false) LocalDateTime createdTo,
                                                                     @RequestParam(required = false) LocalDateTime closedFrom,
                                                                     @RequestParam(required = false) LocalDateTime closedTo,
                                                                     @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(orderRepository.findForAdminProjectedByFilters(id, statusNames, userId, userNamePart, userFacebookNicknamePart, phonePart, createdFrom, createdTo, closedFrom, closedTo, pageRequest), OK);
    }

    @PostMapping
    public ResponseEntity<Long> create(@RequestBody OrderModel orderModel) {
        return new ResponseEntity<>(orderService.create(orderModel), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/confirmPayment")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long id, @RequestBody(required = false) LocalDateTime paid) {
        orderService.confirmPayment(id, paid);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/changeStatus")
    public ResponseEntity<Void> changeStatus(@PathVariable Long id, @RequestBody OrderStatusChangeRequestModel orderStatusChangeRequest) {
        orderService.changeStatus(id, orderStatusChangeRequest);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/changeContacts")
    public ResponseEntity<Void> changeContacts(@PathVariable Long id, @RequestBody OrderContactsChangeRequestModel orderContactsChangeRequest) {
        orderService.changeContacts(id, orderContactsChangeRequest);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/changeNote")
    public ResponseEntity<Void> changeNote(@PathVariable Long id, @RequestBody(required=false) String note) {
        orderService.changeNote(id, note);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/merge")
    public ResponseEntity<Void> merge(@PathVariable Long id, @RequestBody String otherId) {
        orderService.merge(id, Long.parseLong(otherId));
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/split")
    public ResponseEntity<Void> split(@PathVariable Long id, @RequestBody List <Long> orderItemIds) {
        orderService.split(id, orderItemIds);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/items")
    public ResponseEntity<Void> updateItems(@PathVariable Long id, @RequestBody List <IdAmountTuple> orderItems) {
        orderService.updateItems(id, orderItems);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/discount")
    public ResponseEntity<Void> updateDiscount(@PathVariable Long id, @RequestBody String discount) {
        orderService.updateDiscount(id, Integer.parseInt(discount));
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my")
    @PageableSwagger
    public ResponseEntity<Page<OrderProjection>> getMyOrders(@PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(orderRepository.findProjectedByUserEmailOrderByCreatedDesc(securityService.getCurrentUserEmail(), pageRequest) ,OK);
    }

}
