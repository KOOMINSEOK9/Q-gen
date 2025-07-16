package com.s12p31b204.backend.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.s12p31b204.backend.dto.UserDto;
import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorizaiton = null;

        // 쿠키에서 Authorization 키 값 찾기
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("Authorization")) {
                authorizaiton = cookie.getValue();
            }
        }

        if(authorizaiton == null) {
            log.info("token null");
            filterChain.doFilter(request, response);

            // 필터 넘기고 반드시 메서드 종료해야 함
            return;
        }

        String token = authorizaiton;

        if(jwtUtil.isExpired(token)) {
            log.info("token expired");
            filterChain.doFilter(request, response);

            return;
        }

        String username = jwtUtil.getUsername(token);

        UserDto userDto = new UserDto(username, null);

        CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDto);

        // spring security 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());

        // 세션에 사용자 등록(stateless 로 요청 끝나면 소멸)
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
