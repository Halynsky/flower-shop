package ua.com.flowershop.controller;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.exception.ConflictException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.*;
import ua.com.flowershop.projection.OrderAdminProjection;
import ua.com.flowershop.projection.OrderProjection;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.OrderService;
import ua.com.flowershop.util.HibernateUtil;
import ua.com.flowershop.util.PoiExporter;
import ua.com.flowershop.util.annotation.PageableSwagger;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import static java.util.Objects.nonNull;
import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.ORDERS_PATH;

@RestController
@RequestMapping(ORDERS_PATH)
public class OrderController {

    private static final List<String> unsafeSortingFields =  Arrays.asList("priceToPay");

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private SecurityService securityService;
    @Autowired private PoiExporter poiExporter;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/forAdmin")
    @PageableSwagger
    public ResponseEntity<Page<OrderAdminProjection>> getAllForAdmin(@RequestParam(required = false) Long id,
                                                                     @RequestParam(required = false) List<String> statusNames,
                                                                     @RequestParam(required = false) Long userId,
                                                                     @RequestParam(required = false) String userNamePart,
                                                                     @RequestParam(required = false) String phonePart,
                                                                     @RequestParam(required = false) LocalDateTime createdFrom,
                                                                     @RequestParam(required = false) LocalDateTime createdTo,
                                                                     @RequestParam(required = false) LocalDateTime closedFrom,
                                                                     @RequestParam(required = false) LocalDateTime closedTo,
                                                                     @RequestParam(required = false) LocalDate sentFrom,
                                                                     @RequestParam(required = false) LocalDate sentTo,
                                                                     @RequestParam(required = false) Integer priceToPayFrom,
                                                                     @RequestParam(required = false) Integer priceToPayTo,
                                                                     @RequestParam(required = false) Boolean paid,
                                                                     @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        return new ResponseEntity<>(orderRepository.findForAdminProjectedByFilters(id, statusNames, userId, userNamePart, phonePart, createdFrom, createdTo, closedFrom, closedTo, sentFrom, sentTo, priceToPayFrom, priceToPayTo, paid, HibernateUtil.replaceUnsafeFields(pageRequest, unsafeSortingFields)), OK);
    }

    @PostMapping
    public ResponseEntity<Long> create(@Valid @RequestBody OrderModel orderModel) {
        return new ResponseEntity<>(orderService.create(orderModel), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping(value = "/{id}/confirmPayment")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long id, @RequestBody(required = false) String paid) {
        LocalDate paymentDate = nonNull(paid) && !paid.equals("") ? LocalDate.parse(paid,  DateTimeFormatter.ofPattern("dd-MM-yyyy")) : null;
        orderService.confirmPayment(id, paymentDate);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PutMapping("/{id}/changeStatus")
    public ResponseEntity<Void> changeStatus(@PathVariable Long id, @RequestBody OrderStatusChangeRequestModel orderStatusChangeRequest) {
        if(orderStatusChangeRequest.getStatus() == Order.Status.CANCELED_AUTO) {
            throw new ConflictException("Вказано невалідний статус замовлення");
        }
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

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/{id}/export/excel")
    public ResponseEntity<Void> exportToExcel(@PathVariable Long id, HttpServletResponse response) throws IOException {
        Order order = orderRepository.findById(id).orElseThrow(NotFoundException::new);
        Workbook workbook = poiExporter.exportOrderToExcel(order, null);
        response.setHeader("Content-disposition", "attachment; filename=Order" + order.getId() + ".xlsx");
        workbook.write(response.getOutputStream() );
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/export/excel")
    @PageableSwagger
    public ResponseEntity<Void> exportAllToExcel(@RequestParam(required = false) Long id,
                                                 @RequestParam(required = false) List<String> statusNames,
                                                 @RequestParam(required = false) Long userId,
                                                 @RequestParam(required = false) String userNamePart,
                                                 @RequestParam(required = false) String phonePart,
                                                 @RequestParam(required = false) LocalDateTime createdFrom,
                                                 @RequestParam(required = false) LocalDateTime createdTo,
                                                 @RequestParam(required = false) LocalDateTime closedFrom,
                                                 @RequestParam(required = false) LocalDateTime closedTo,
                                                 @RequestParam(required = false) Integer priceToPayFrom,
                                                 @RequestParam(required = false) Integer priceToPayTo,
                                                 @RequestParam(required = false) Boolean paid,
                                                 @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest,
                                                 HttpServletResponse response) throws IOException {
        List<Order> orders = orderRepository.findAllForAdminByFilters(id, statusNames, userId, userNamePart, phonePart, createdFrom, createdTo, closedFrom, closedTo, priceToPayFrom, priceToPayTo, paid, pageRequest.getSort());
        Workbook workbook = poiExporter.exportOrdersToExcel(orders);
        response.setHeader("Content-disposition", "attachment; filename=Orders.xlsx");
        workbook.write(response.getOutputStream());
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping("/createAsAdmin/{userIdToCreateFor}")
    public ResponseEntity<Long> createAsAdmin(@PathVariable Long userIdToCreateFor) {
        return new ResponseEntity<>(orderService.createAsAdmin(userIdToCreateFor), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping("/createAsAdmin")
    public ResponseEntity<Long> createAsAdmin(@RequestBody OrderCreateRequestAdmin orderCreateRequestAdmin) {
        return new ResponseEntity<>(orderService.createAsAdmin(orderCreateRequestAdmin), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping("/sendToEmail/{id}")
    public ResponseEntity<Void> SendToEmail(@PathVariable Long id) {
        orderService.sendToEmail(id);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @PostMapping("/status/processing")
    public ResponseEntity<Integer> changeStatusToProcessingForAll(@RequestParam(required = false) Long id,
                                                                  @RequestParam(required = false) List<String> statusNames,
                                                                  @RequestParam(required = false) Long userId,
                                                                  @RequestParam(required = false) String userNamePart,
                                                                  @RequestParam(required = false) String phonePart,
                                                                  @RequestParam(required = false) LocalDateTime createdFrom,
                                                                  @RequestParam(required = false) LocalDateTime createdTo,
                                                                  @RequestParam(required = false) LocalDateTime closedFrom,
                                                                  @RequestParam(required = false) LocalDateTime closedTo,
                                                                  @RequestParam(required = false) Integer priceToPayFrom,
                                                                  @RequestParam(required = false) Integer priceToPayTo,
                                                                  @RequestParam(required = false) Boolean paid,
                                                                  @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest) {
        List<Order> orders = orderRepository.findAllForAdminByFilters(id, statusNames, userId, userNamePart, phonePart, createdFrom, createdTo, closedFrom, closedTo, priceToPayFrom, priceToPayTo, paid, null);
        orderService.changeStatusToProcessingForAll(orders);
        return new ResponseEntity<>(orders.size(), OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/prepareProcessingBlank")
    @PageableSwagger
    public ResponseEntity<Void> prepareProcessingBlank(@RequestParam(required = false) Long id,
                                                 @RequestParam(required = false) List<String> statusNames,
                                                 @RequestParam(required = false) Long userId,
                                                 @RequestParam(required = false) String userNamePart,
                                                 @RequestParam(required = false) String phonePart,
                                                 @RequestParam(required = false) LocalDateTime createdFrom,
                                                 @RequestParam(required = false) LocalDateTime createdTo,
                                                 @RequestParam(required = false) LocalDateTime closedFrom,
                                                 @RequestParam(required = false) LocalDateTime closedTo,
                                                 @RequestParam(required = false) Integer priceToPayFrom,
                                                 @RequestParam(required = false) Integer priceToPayTo,
                                                 @RequestParam(required = false) Boolean paid,
                                                 @PageableDefault(sort = "id", page = 0, size = 10, direction = Sort.Direction.ASC) Pageable pageRequest,
                                                 HttpServletResponse response) throws IOException {
        List<Order> orders = orderRepository.findAllForAdminByFilters(id, statusNames, userId, userNamePart, phonePart, createdFrom, createdTo, closedFrom, closedTo, priceToPayFrom, priceToPayTo, paid, pageRequest.getSort());
        Workbook workbook = poiExporter.prepareProcessingBlank(orders);
        response.setHeader("Content-disposition", "attachment; filename=Orders.xlsx");
        workbook.write(response.getOutputStream());
        return new ResponseEntity<>(OK);
    }

}
