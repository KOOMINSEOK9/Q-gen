package com.s12p31b204.backend.oauth2;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        String redirectUrl;

        String serverName = request.getServerName();

        if ("localhost".equals(serverName)) {
            redirectUrl = "http://localhost:5173/login";
        } else {
            redirectUrl = "https://" + serverName + "/login";
        }

        response.sendRedirect(redirectUrl);
    }
}
