package ua.com.flowershop.util.mail;

import lombok.extern.slf4j.Slf4j;
import nz.net.ultraq.thymeleaf.LayoutDialect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import ua.com.flowershop.entity.User;

import javax.annotation.PostConstruct;

import static ua.com.flowershop.util.Constants.SLASH;
import static ua.com.flowershop.util.Path.*;

@Slf4j
@Service
public class MailService {

    // Defaults
    private static final String COMPANY_NAME = "Mery Flowers";
    private static final String COMPANY_PHONE = "+380507072637";
    private static final String SIGNATURE = "З повагою, Mery Flowers";
    private static final String THANK_YOU_FOR_JOIN = "Дякуємо за те що приєднались до нас!";
    private static final String LOGO_URL = "/assets/icons/logo/icon-192x192.png";

    private static final String SUPPORT_EMAIL = "meryflowers@gmail.com";
    private static final String SUPPORT_TEXT = "Якщо у вас виникли якісь запитання, ви можете звязатись з нами";

    private static final String SECRET_KEY_PARAM = "?secretKey=";

    // Templates
    private static final String NOTICE_TEMPLATE = "parts/notice";
    private static final String CONFIRMATION_TEMPLATE = "parts/confirmation";

    // Template parts keys
    private static final String TITLE = "title";
    private static final String BODY = "body";
    private static final String CONFIRM_URL = "confirmUrl";
    private static final String CONFIRM_BTN_TEXT = "confirmBtnText";
    private static final String USER_NAME = "userName";

    // Template CSS Keys
    private static final String CONTENT_ALIGN = "contentAlign";

    @Autowired private MailClient mailClient;
    @Autowired private TemplateEngine templateEngine;

    @Value("${site.url}") private String siteUrl;
    @Value("${site.url.full}") private String siteUrlFull;

    private Context contextTemplate() {
        Context context = new Context();
        context.setVariable("siteUrl", siteUrl);
        context.setVariable("siteUrlFull", siteUrlFull);
        context.setVariable("logoUrl", siteUrlFull + LOGO_URL);
        context.setVariable("supportText", SUPPORT_TEXT);
        context.setVariable("supportEmail", SUPPORT_EMAIL);
        context.setVariable("signature", SIGNATURE);
        context.setVariable("companyName", COMPANY_NAME);
        context.setVariable("companyPhone", COMPANY_PHONE);
        context.setVariable("homeImproveAddress", COMPANY_PHONE);
        context.setVariable(CONTENT_ALIGN, "center");
        return context;
    }

    @PostConstruct
    private void init() {
        templateEngine.addDialect(new LayoutDialect());
    }

    /**
     * Send registration email to new user.
     *
     * @param user new customer
     */
    public void sendRegistrationConfirmEmail(User user) {
        Context context = contextTemplate();
        context.setVariable(USER_NAME, user.getName());
        context.setVariable(TITLE, THANK_YOU_FOR_JOIN);
        context.setVariable(BODY, "Для завершення реєстрації, вам потрібно підтвердити свою поштову адресу щоб ми переконались що це саме ви.");
        context.setVariable(CONFIRM_URL, siteUrl + SLASH + CONFIRM + SLASH + ACTIVATION + SECRET_KEY_PARAM + user.getSecretKey());
        context.setVariable(CONFIRM_BTN_TEXT, "Підтвердити");
        mailClient.sendMail("Підтвердіть реєстрацію", CONFIRMATION_TEMPLATE, context, MailHolder.MessageType.NOREPLY, user.getEmail());
    }


    /**
     * Send email to User that has been updated his password.
     *
     * @param user user that has been updated his password
     */
    public void sendPasswordUpdated(User user) {
        Context context = contextTemplate();
        context.setVariable(USER_NAME, user.getName());
        context.setVariable(TITLE, "Ваш пароль оновлено");
        context.setVariable(BODY, "Якщо ви не сдійснювали данну дію, негайно зверніться в службу підтримки");
        mailClient.sendMail("Ваш пароль оновлено", NOTICE_TEMPLATE, context, MailHolder.MessageType.NOREPLY, user.getEmail());
    }


    /**
     * Send email to User that has been requested password reset.
     *
     * @param user user that has been updated his password
     */
    public void sendPasswordRestore(User user) {
        Context context = contextTemplate();
        context.setVariable(USER_NAME, user.getName());
        context.setVariable(TITLE, "Тепер ви можете оновити свій пароль");
        context.setVariable(BODY, "Ви здыйснили запит на оновлення паролю. Для наступного кроку перейдыть, будь ласка, за посиланням внизу");
        context.setVariable(CONFIRM_URL, siteUrl + SLASH + RESTORE_PASSWORD + SECRET_KEY_PARAM + user.getSecretKey());
        context.setVariable(CONFIRM_BTN_TEXT, "Відновити пароль");
        mailClient.sendMail("Відновлення паролю", CONFIRMATION_TEMPLATE, context, MailHolder.MessageType.NOREPLY, user.getEmail());
    }


    /**
     * Send email to User that has been changed his email address to confirm it.
     *
     * @param user user that has been changed his email address
     */
    public void sendEmailChanged(User user) {
        Context context = contextTemplate();
        context.setVariable(USER_NAME, user.getName());
        context.setVariable(TITLE, "Ви зробили запит на зміну своєї Email адреси");
        context.setVariable(BODY, "Підвердіть, будь ласка, свою нову поштову адресу");
        context.setVariable(CONFIRM_URL, siteUrl + SLASH + CONFIRM + SLASH + EMAIL + SECRET_KEY_PARAM + user.getSecretKey());
        context.setVariable(CONFIRM_BTN_TEXT, "Підтвердити");
        mailClient.sendMail("Запит на зміну Email адреси", CONFIRMATION_TEMPLATE, context, MailHolder.MessageType.NOREPLY, user.getNewEmail());
    }


    /**
     * Send notice email to User that has been changed his email address. Notice will be sent to his old email address.
     *
     * @param user user that has been changed his email address
     */
    public void sendEmailChangedNotice(User user) {
        Context context = contextTemplate();
        context.setVariable(USER_NAME, user.getName());
        context.setVariable(TITLE, "Ви зробили запит на зміну своєї Email адреси yf " + user.getNewEmail());
        context.setVariable(BODY, "Перевірте, будь ласка, вхідні повідомлення в " + user.getNewEmail() + " і підтвердіть свою нову адресу." +
            "<br/>Якщо ви не проводили данну дію, негайно звяжіться з службою підтримки.");
        mailClient.sendMail("Зміна Email адреси аккаунту", NOTICE_TEMPLATE, context, MailHolder.MessageType.NOREPLY, user.getEmail());
    }


       /**
     * Send email to User that his account has been blocked/unblocked
     *
     * @param user user whose account has been blocked/unblocked
     */
    public void sendBlockAccount(User user) {
        Context context = contextTemplate();
        context.setVariable(USER_NAME, user.getName());
        String newStatus = !user.getIsEnabled() ? "заблоковано" : "розблоковано";
        String title = "Ваш аккаунт " + newStatus;
        StringBuilder body = new StringBuilder("Ваш аккаунт на meryflowers.com.ua ");
        body.append(newStatus);
        body.append(".");
        if (!user.getIsEnabled()) {
            body.append(" Ви можете звязатися з службою підтримки щоб оскаржити рішення.");
        }
        context.setVariable(TITLE, title);
        context.setVariable(BODY, body);
        mailClient.sendMail("Ваш аккаунт " + newStatus, NOTICE_TEMPLATE, context, MailHolder.MessageType.NOREPLY, user.getEmail());
    }


    private String highlight(String phrase) {
        return "<b>" + phrase + "</b>";
    }

    private String wrapLink(String phrase, String link) {
        return "<a href= " + link + ">" + phrase + "</a>";
    }


}
