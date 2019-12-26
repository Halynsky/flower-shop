package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.BucketItemModel;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.BucketService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.BUCKET_PATH;

@RestController
@RequestMapping(BUCKET_PATH)
public class BucketController {

    @Autowired private SecurityService securityService;
    @Autowired private BucketService bucketService;

    @PostMapping
    public ResponseEntity<Void> post(@RequestBody List<BucketItemModel> bucket) {
        bucketService.post(securityService.getUser(), bucket);
        return new ResponseEntity<>(OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<Void> getBucket() {
        return new ResponseEntity<>(OK);
    }


}
