package ua.com.flowershop.util;

public final class ErrorMessages {

    private ErrorMessages(){}

    public static final String ERR_MSG_PASS_MINIMUM_REQUIREMENTS = "Password doesn't match minimum security requirements";
    public static final String EMAIL_VALIDATION_ERROR_MESSAGE = "Email is not a valid";
    public static final String EMAIL_REQUIRED_VALIDATION_ERROR_MESSAGE = "Email is required";
    public static final String NAME_PATTERN_ERROR_MESSAGE = "May contain only letters, numbers and characters: ' -";

    public static final String BAD_CREDENTIALS_MSG = "Email or password is incorrect";
    public static final String SESSION_TIMED_OUT_MSG = "Your session has timed out. Please log in again";
    public static final String ACCOUNT_DELETED_MSG = "Account has been deleted";
    public static final String ACCOUNT_NOT_ACTIVATED_MSG = "Account is not activated. Please proceed to confirm your email";
    public static final String ACCOUNT_BLOCKED_MSG = "Account is blocked. Please contact support";
    public static final String INVALID_ACTIVATION_LINK = "Invalid activation link";
    public static final String CREDENTIALS_EXPIRED_MSG = "Password has been expired. Please change it";
}
