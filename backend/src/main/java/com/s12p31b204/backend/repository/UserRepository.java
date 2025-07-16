package com.s12p31b204.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.s12p31b204.backend.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
