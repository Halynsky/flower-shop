package ua.com.flowershop.exception;

public class ConflictException extends RuntimeException {

    public ConflictException() {
        super("Конфлік данних");
    }

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
