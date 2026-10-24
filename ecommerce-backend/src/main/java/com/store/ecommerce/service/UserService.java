package com.store.ecommerce.service;

import com.store.ecommerce.dto.user.UserProfileResponse;
import com.store.ecommerce.dto.user.UserUpdateRequest;

public interface UserService {

    UserProfileResponse getCurrentUserProfile(String email);

    UserProfileResponse updateUserProfile(
            String email,
            UserUpdateRequest request
    );
}