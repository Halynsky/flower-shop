package ua.com.flowershop.exception.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import ua.com.flowershop.exception.*;

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

    @ExceptionHandler(ThirdPartyException.class)
    public ResponseEntity<Object> handleThirdPartyException(ThirdPartyException exception, WebRequest request) {
        log.debug(exception.getMessage());
        return new ResponseEntity<>(new RestError(BAD_REQUEST.value(), exception.getMessage()), BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationRequiredException.class)
    public ResponseEntity<Object> handleAuthenticationRequiredException(AuthenticationRequiredException exception, WebRequest request) {
        log.debug(exception.getMessage());
        return new ResponseEntity<>(new RestError(BAD_REQUEST.value(), exception.getMessage()), BAD_REQUEST);
    }

    @ExceptionHandler({InternalServerException.class})
    public ResponseEntity<Object> handleInternalError(InternalServerException exception, WebRequest request) {
        log.error(exception.getMessage());
        return new ResponseEntity<>(new RestError(INTERNAL_SERVER_ERROR.value(), exception.getMessage()), INTERNAL_SERVER_ERROR);
    }

}
