package ua.com.flowershop.exception.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.exception.RestError;

import java.nio.file.AccessDeniedException;

import static org.springframework.http.HttpStatus.*;

@Slf4j
@RestControllerAdvice
public class GenericExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NotFoundException exception, WebRequest request) {
        log.debug(exception.getMessage());
        return new ResponseEntity<>(new RestError(NOT_FOUND.value(), exception.getMessage()), NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException exception, WebRequest request) {
        log.debug(exception.getMessage());
        return new ResponseEntity<>(new RestError(FORBIDDEN.value(), exception.getMessage()), FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAccessDeniedException(AuthenticationException exception, WebRequest request) {
        log.debug(exception.getMessage());
        return new ResponseEntity<>(new RestError(UNAUTHORIZED.value(), exception.getMessage()), UNAUTHORIZED);
    }

}
