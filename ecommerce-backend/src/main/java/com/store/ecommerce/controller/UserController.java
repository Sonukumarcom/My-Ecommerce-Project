package com.store.ecommerce.controller;

import com.store.ecommerce.dto.response.ApiResponse;
import com.store.ecommerce.dto.user.UserProfileResponse;
import com.store.ecommerce.dto.user.UserUpdateRequest;
import com.store.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        UserProfileResponse profile =
                userService.getCurrentUserProfile(userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserUpdateRequest request) {

        UserProfileResponse updated =
                userService.updateUserProfile(
                        userDetails.getUsername(),
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        updated,
                        "Profile updated successfully"
                )
        );
    }
}