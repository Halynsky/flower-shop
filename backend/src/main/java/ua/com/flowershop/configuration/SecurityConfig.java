package ua.com.flowershop.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .anyRequest().permitAll()
            .and().csrf().disable();
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
            // for angular
            .antMatchers(HttpMethod.GET, "/vendor.js")
            .antMatchers(HttpMethod.GET, "/styles.js")
            .antMatchers(HttpMethod.GET, "/polyfills.js")
            .antMatchers(HttpMethod.GET, "/inline.js")
            .antMatchers(HttpMethod.GET, "/scripts.js")
            .antMatchers(HttpMethod.GET, "/main.js")
            // for Swagger
            .antMatchers(HttpMethod.GET, "/swagger-*/**")
            .antMatchers(HttpMethod.GET, "/webjars*/**")
            .antMatchers(HttpMethod.GET, "/v2/api-docs");
    }

}
