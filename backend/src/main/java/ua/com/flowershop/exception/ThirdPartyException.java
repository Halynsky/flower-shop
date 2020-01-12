package ua.com.flowershop.exception;

public class ThirdPartyException extends Exception {

    public ThirdPartyException() {
        super("Невідома помилка при роботі з API стороннього сервісу");
    }

    public ThirdPartyException(String message) {
        super(message);
    }

    public ThirdPartyException(String message, Throwable cause) {
        super(message, cause);
    }
}
