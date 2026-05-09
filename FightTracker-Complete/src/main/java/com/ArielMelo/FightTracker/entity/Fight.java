package com.ArielMelo.FightTracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Fight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Fighter fighter1;

    @ManyToOne
    private Fighter fighter2;

    @ManyToOne
    private Event event;
}
