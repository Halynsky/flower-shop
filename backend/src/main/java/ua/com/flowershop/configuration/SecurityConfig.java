package ua.com.flowershop.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import ua.com.flowershop.security.AuthenticationFailEntryPoint;
import ua.com.flowershop.security.DatabaseUserService;
import ua.com.flowershop.security.JsonAuthenticationFilter;

import static ua.com.flowershop.util.Constants.SLASH;
import static ua.com.flowershop.util.Path.*;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired private DatabaseUserService databaseUserService;
    @Autowired private AuthenticationFailEntryPoint authenticationFailEntryPoint;
    @Autowired private AuthenticationSuccessHandler authenticationSuccessHandler;
    @Autowired private AuthenticationFailureHandler authenticationFailureHandler;
    @Autowired private LogoutSuccessHandler logoutSuccessHandler;
    @Autowired private Environment environment;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JsonAuthenticationFilter authenticationFilter() throws Exception {
        JsonAuthenticationFilter authenticationFilter = new JsonAuthenticationFilter();
        authenticationFilter.setAuthenticationSuccessHandler(authenticationSuccessHandler);
        authenticationFilter.setAuthenticationFailureHandler(authenticationFailureHandler);
        authenticationFilter.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher(SLASH + AUTH_PATH + "/login", "POST"));
        authenticationFilter.setAuthenticationManager(authenticationManagerBean());
        return authenticationFilter;
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .antMatcher(SLASH + API + SLASH + "**")
            .authorizeRequests()
            .antMatchers(SLASH + IMAGES_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + AUTH_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + USERS_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + SOCIAL_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + ARTICLES_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + COLORS_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + SIZES_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + FLOWER_SIZES_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + FLOWER_TYPES_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + FLOWERS_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + WAREHOUSE_OPERATIONS_PATH + SLASH + "**").permitAll()
            .antMatchers(SLASH + ORDERS_PATH + SLASH + "**").permitAll()
            .anyRequest().authenticated()
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(authenticationFailEntryPoint)
            .and()
            .logout().logoutUrl(SLASH + AUTH_PATH + "/logout").logoutSuccessHandler(logoutSuccessHandler)
            .and()
            .sessionManagement().maximumSessions(1);

        http.requiresChannel()
            .requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
            .requiresSecure();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(databaseUserService).passwordEncoder(passwordEncoder());
        auth.authenticationProvider(authProvider());
    }

    @Bean
    public DaoAuthenticationProvider authProvider()  {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(databaseUserService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
            .antMatchers(HttpMethod.GET, "/*")
            .antMatchers(HttpMethod.GET, IMAGES_PATH + "/**")
            // for Angular
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
