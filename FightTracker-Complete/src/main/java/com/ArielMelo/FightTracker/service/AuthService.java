package com.ArielMelo.FightTracker.service;

import com.ArielMelo.FightTracker.dto.AuthRequest;
import com.ArielMelo.FightTracker.entity.User;
import com.ArielMelo.FightTracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public String register(AuthRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);

        return jwtService.generateToken(user.getEmail());
    }

    public String login(AuthRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        return jwtService.generateToken(user.getEmail());
    }
}