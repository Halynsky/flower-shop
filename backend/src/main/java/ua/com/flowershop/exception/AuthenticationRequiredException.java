package ua.com.flowershop.exception;

public class AuthenticationRequiredException extends RuntimeException {

    public AuthenticationRequiredException() {
        super("Необхідно авторизуватися");
    }

    public AuthenticationRequiredException(String message) {
        super(message);
    }

    public AuthenticationRequiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
