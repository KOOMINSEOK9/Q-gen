package com.s12p31b204.backend.oauth2;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.s12p31b204.backend.util.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {


        if (authentication == null || !authentication.isAuthenticated()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        Long userId = customUserDetails.getUserId();
        String username = customUserDetails.getUsername();

//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
//        GrantedAuthority auth = iterator.next();
//        String role = auth.getAuthority();

        String token = jwtUtil.createJwt(username, userId,3 * 60 * 60 * 1000L);

        response.addCookie(createCookie("Authorization", token));

        String redirectUrl;

        String serverName = request.getServerName();

        if ("localhost".equals(serverName)) {
            redirectUrl = "http://localhost:5173/"; // 로그인 성공 시 리다이렉션(로컬)
        } else {
            redirectUrl = "https://" + serverName + "/"; // 로그인 성공 시 리다이렉션(서버)
        }

        response.sendRedirect(redirectUrl);
        log.info("Authentication Success");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 60 * 60);
        // cookie.setSecure(ture)
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
