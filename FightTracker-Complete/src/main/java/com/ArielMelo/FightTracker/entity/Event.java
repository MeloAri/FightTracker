package com.ArielMelo.FightTracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDateTime date;

    private String location;

    /**
     * Modalidade: MMA | Boxe | Jiu-Jitsu | Muay Thai | Wrestling | Kickboxing | Judô | etc.
     */
    private String category;

    /**
     * Origem: ESPN_MMA | ESPN_BOXING | MANUAL
     */
    @Column(length = 20)
    private String source;

    /**
     * ID externo da ESPN — evita duplicatas ao sincronizar
     */
    @Column(name = "external_id", unique = true)
    private String externalId;

    @ManyToOne
    @JoinColumn(name = "fighter_id")
    private Fighter fighter;
}
