package ua.com.flowershop.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class JsonAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    @Autowired private ObjectMapper objectMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        Credentials credentials;
        try {
            credentials = objectMapper.readValue(request.getInputStream(), Credentials.class);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException();
        }

        return getAuthenticationManager().authenticate(
            new UsernamePasswordAuthenticationToken(
                credentials.getEmail().toLowerCase(),
                credentials.getPassword()
            ));
    }

    @Data
    private static class Credentials {
        private String email;
        private String password;
    }

}
