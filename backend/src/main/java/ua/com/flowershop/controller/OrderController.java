package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.OrderModel;
import ua.com.flowershop.service.OrderService;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.ORDERS_PATH;

@RestController
@RequestMapping(ORDERS_PATH)
public class OrderController {

    @Autowired private OrderService orderService;

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody OrderModel orderModel) {
        orderService.save(orderModel);
        return new ResponseEntity<>(OK);
    }


}
