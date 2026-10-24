package com.store.ecommerce.service.impl;

import com.store.ecommerce.dto.user.UserProfileResponse;
import com.store.ecommerce.dto.user.UserUpdateRequest;
import com.store.ecommerce.entity.Role;
import com.store.ecommerce.entity.User;
import com.store.ecommerce.exception.ResourceNotFoundException;
import com.store.ecommerce.repository.UserRepository;
import com.store.ecommerce.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String email) {

        User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "email", email));

        return mapToProfile(user);
    }

    @Override
    public UserProfileResponse updateUserProfile(
            String email,
            UserUpdateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "email", email));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());

        User updatedUser = userRepository.save(user);

        return mapToProfile(updatedUser);
    }

    private UserProfileResponse mapToProfile(User user) {

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );
    }
}