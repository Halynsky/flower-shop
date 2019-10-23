package ua.com.flowershop.exception;

import org.springframework.security.authentication.AccountStatusException;

public class AccountIsNotActivatedException extends AccountStatusException {

    public AccountIsNotActivatedException() {
        super("Account is not activated");
    }

    public AccountIsNotActivatedException(String msg) {
        super(msg);
    }

    public AccountIsNotActivatedException(String msg, Throwable t) {
        super(msg, t);
    }

}


