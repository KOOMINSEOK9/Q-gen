package com.s12p31b204.backend.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s12p31b204.backend.domain.User;
import com.s12p31b204.backend.oauth2.CustomOAuth2User;
import com.s12p31b204.backend.dto.GoogleResponse;
import com.s12p31b204.backend.dto.OAuth2Response;
import com.s12p31b204.backend.dto.UserDto;
import com.s12p31b204.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        log.info(oAuth2User.toString());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if(registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId(); // 사용자를 식별할 아이디값

        User existUser = userRepository.findByUsername(username);
        if(existUser == null) {
            User user = new User(oAuth2Response.getEmail(), username, oAuth2Response.getName());
            userRepository.save(user);
        } else {
            existUser.update(oAuth2Response.getEmail(), oAuth2Response.getName());
            username = existUser.getUsername();
        }
        UserDto userDto = new UserDto(username, oAuth2Response.getName());

        return new CustomOAuth2User(userDto);
    }
}
