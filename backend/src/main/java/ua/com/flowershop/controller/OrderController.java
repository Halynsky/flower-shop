package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.OrderModel;
import ua.com.flowershop.projection.OrderAdminProjection;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.service.OrderService;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.ORDERS_PATH;

@RestController
@RequestMapping(ORDERS_PATH)
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    public ResponseEntity<Page<OrderAdminProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                     @RequestParam(required = false) List<String> statusNames,
                                                                     @RequestParam(required = false) String userNamePart,
                                                                     @RequestParam(required = false) String userFacebookNicknamePart,
                                                                     @RequestParam(required = false) String phonePart,
                                                                     @RequestParam(required = false) LocalDateTime createdFrom,
                                                                     @RequestParam(required = false) LocalDateTime createdTo,
                                                                     @RequestParam(required = false) LocalDateTime closedFrom,
                                                                     @RequestParam(required = false) LocalDateTime closedTo,
                                                                     @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(orderRepository.findForAdminProjectedByFilters(id, statusNames, userNamePart, userFacebookNicknamePart, phonePart, createdFrom, createdTo, closedFrom, closedTo, pageRequest), OK);
    }

    @PostMapping
    public ResponseEntity<Long> create(@RequestBody OrderModel orderModel) {
        return new ResponseEntity<>(orderService.create(orderModel), OK);
    }


}
