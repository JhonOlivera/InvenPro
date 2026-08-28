package com.invenpro.invenpro_backend.controller;

import com.invenpro.invenpro_backend.dto.MovimientoInventarioDto;
import com.invenpro.invenpro_backend.service.MovimientoInventarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@RequiredArgsConstructor
public class MovimientoInventarioController {

    private final MovimientoInventarioService movimientoService;

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioDto>> listarTodos() {
        return ResponseEntity.ok(movimientoService.listarTodos());
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioDto>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(movimientoService.listarPorProducto(productoId));
    }

    @PostMapping
    public ResponseEntity<MovimientoInventarioDto> registrar(
            @Valid @RequestBody MovimientoInventarioDto movimientoDto,
            Authentication authentication
    ) {
        String emailUsuario = authentication.getName();
        MovimientoInventarioDto creado = movimientoService.registrar(movimientoDto, emailUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}