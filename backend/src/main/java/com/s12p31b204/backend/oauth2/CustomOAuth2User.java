package com.s12p31b204.backend.oauth2;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.s12p31b204.backend.dto.UserDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {

    private final UserDto userDto;
    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // 비어있는 권한 목록
    }

    @Override
    public String getName() {
        return userDto.getNickname();
    }

    public String getUsername() {
        return userDto.getUsername();
    }
}
