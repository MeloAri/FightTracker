package com.ArielMelo.FightTracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(

        @Email(message = "Email inválido")
        @NotBlank(message = "Email obrigatório")
        String email,

        @NotBlank(message = "Senha obrigatória")
        String password
) {}
