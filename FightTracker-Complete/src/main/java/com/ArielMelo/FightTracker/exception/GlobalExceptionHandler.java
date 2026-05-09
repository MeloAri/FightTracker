package com.ArielMelo.FightTracker.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntime(RuntimeException ex) {
        return ResponseEntity.badRequest().body(
                Map.of(
                        "error", ex.getMessage(),
                        "status", 400
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneric(Exception ex) {
        return ResponseEntity.internalServerError().body(
                Map.of(
                        "error", "Erro interno no servidor",
                        "status", 500
                )
        );
    }
}