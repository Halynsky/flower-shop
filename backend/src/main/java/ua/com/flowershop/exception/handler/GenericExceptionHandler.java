package ua.com.flowershop.exception.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.exception.RestError;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Slf4j
@ControllerAdvice
public class GenericExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NotFoundException exception, WebRequest request) {
        log.warn(exception.getMessage());
        return new ResponseEntity<>(new RestError(NOT_FOUND.value(), exception.getMessage()), NOT_FOUND);
    }

}
