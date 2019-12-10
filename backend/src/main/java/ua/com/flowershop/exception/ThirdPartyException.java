package ua.com.flowershop.exception;

public class ThirdPartyException extends Exception {

    public ThirdPartyException() {
        super("Unknown error with 3rd party API");
    }

    public ThirdPartyException(String message) {
        super(message);
    }

    public ThirdPartyException(String message, Throwable cause) {
        super(message, cause);
    }
}
