package ua.com.flowershop.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ua.com.flowershop.model.SecurityUserModel;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;

@Component
public class AuthenticationSuccess implements AuthenticationSuccessHandler {

    @Autowired private ObjectMapper objectMapper;
    @Autowired private SecurityService securityService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        httpServletResponse.setCharacterEncoding(Charset.defaultCharset().name());
        objectMapper.writeValue(httpServletResponse.getWriter(), SecurityUserModel.of(securityService.getUser()));
    }
}
