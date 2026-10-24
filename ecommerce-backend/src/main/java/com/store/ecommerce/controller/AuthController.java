package com.store.ecommerce.controller;

import com.store.ecommerce.dto.response.ApiResponse;
import com.store.ecommerce.entity.Role;
import com.store.ecommerce.entity.User;
import com.store.ecommerce.exception.BadRequestException;
import com.store.ecommerce.repository.RoleRepository;
import com.store.ecommerce.repository.UserRepository;
import com.store.ecommerce.security.JwtUtils;
import com.store.ecommerce.security.UserPrincipal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            UserDetailsService userDetailsService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @RequestBody RegisterRequest request
    ) {

        if (request.firstName == null || request.firstName.isBlank()) {
            throw new BadRequestException("First name is required.");
        }

        if (request.lastName == null || request.lastName.isBlank()) {
            throw new BadRequestException("Last name is required.");
        }

        if (request.email == null || request.email.isBlank()) {
            throw new BadRequestException("Email is required.");
        }

        if (request.password == null || request.password.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters.");
        }

        String email = request.email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already in use.");
        }

        // Find ROLE_USER or create it automatically
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_USER");
                    return roleRepository.save(role);
                });

        User user = new User();
        user.setFirstName(request.firstName.trim());
        user.setLastName(request.lastName.trim());
        user.setEmail(email);
        user.setPhoneNumber(
                request.phoneNumber == null || request.phoneNumber.isBlank()
                        ? null
                        : request.phoneNumber.trim()
        );

        // Password is stored as BCrypt hash
        user.setPasswordHash(passwordEncoder.encode(request.password));

        user.setIsActive(true);
        user.setRoles(Set.of(userRole));

        User savedUser = userRepository.save(user);

        // Create UserPrincipal from saved user
        UserPrincipal principal = UserPrincipal.build(savedUser);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );

        String accessToken = jwtUtils.generateToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(principal);

        Map<String, Object> data = buildAuthResponse(
                savedUser,
                accessToken,
                refreshToken
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Registration successful."));
    }


    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @RequestBody LoginRequest request
    ) {

        if (request.email == null || request.email.isBlank()) {
            throw new BadRequestException("Email is required.");
        }

        if (request.password == null || request.password.isBlank()) {
            throw new BadRequestException("Password is required.");
        }

        String email = request.email.trim().toLowerCase();

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.password
                        )
                );

        UserPrincipal principal =
                (UserPrincipal) authentication.getPrincipal();

        String accessToken = jwtUtils.generateToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(principal);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadRequestException("User not found.")
                );

        Map<String, Object> data = buildAuthResponse(
                user,
                accessToken,
                refreshToken
        );

        return ResponseEntity.ok(
                ApiResponse.success(data, "Login successful.")
        );
    }


    // =========================
    // REFRESH TOKEN
    // =========================
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(
            @RequestBody RefreshTokenRequest request
    ) {

        if (request.refreshToken == null || request.refreshToken.isBlank()) {
            throw new BadRequestException("Refresh token is required.");
        }

        String refreshToken = request.refreshToken;

        if (!jwtUtils.validateJwtToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token.");
        }

        String email = jwtUtils.extractUsername(refreshToken);

        User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() ->
                        new BadRequestException("User not found.")
                );

        UserPrincipal principal = UserPrincipal.build(user);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );

        String newAccessToken = jwtUtils.generateToken(authentication);
        String newRefreshToken = jwtUtils.generateRefreshToken(principal);

        Map<String, String> data = new HashMap<>();
        data.put("accessToken", newAccessToken);
        data.put("refreshToken", newRefreshToken);

        return ResponseEntity.ok(
                ApiResponse.success(data, "Token refreshed successfully.")
        );
    }


    // =========================
    // LOGOUT
    // =========================
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {

        return ResponseEntity.ok(
                ApiResponse.success(null, "Logout successful.")
        );
    }


    // =========================
    // HEALTH
    // =========================
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {

        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put(
                "message",
                "E-Commerce Backend Server is running successfully!"
        );

        return ResponseEntity.ok(response);
    }


    // =========================
    // AUTH RESPONSE BUILDER
    // =========================
    private Map<String, Object> buildAuthResponse(
            User user,
            String accessToken,
            String refreshToken
    ) {

        Map<String, Object> userData = new HashMap<>();

        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());

        userData.put(
                "roles",
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .toList()
        );

        Map<String, Object> data = new HashMap<>();

        data.put("accessToken", accessToken);
        data.put("refreshToken", refreshToken);
        data.put("user", userData);

        return data;
    }


    // =========================
    // REQUEST CLASSES
    // =========================

    public static class RegisterRequest {

        public String firstName;
        public String lastName;
        public String email;
        public String phoneNumber;
        public String password;
    }

    public static class LoginRequest {

        public String email;
        public String password;
    }

    public static class RefreshTokenRequest {

        public String refreshToken;
    }                                           
}                                                                           