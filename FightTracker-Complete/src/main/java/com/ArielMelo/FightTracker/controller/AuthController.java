package com.ArielMelo.FightTracker.controller;

import com.ArielMelo.FightTracker.dto.AuthRequest;
import com.ArielMelo.FightTracker.dto.AuthResponse;
import com.ArielMelo.FightTracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED) // 🔥 201 - criado
    public AuthResponse register(@Valid @RequestBody AuthRequest request) {
        return new AuthResponse(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return new AuthResponse(authService.login(request));
    }
}

