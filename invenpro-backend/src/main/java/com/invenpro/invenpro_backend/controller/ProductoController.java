package com.invenpro.invenpro_backend.controller;

import com.invenpro.invenpro_backend.dto.ProductoDto;
import com.invenpro.invenpro_backend.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoDto>> listarTodos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping("/paginado")
    public ResponseEntity<Page<ProductoDto>> listarPaginado(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamano
    ) {
        Pageable pageable = PageRequest.of(pagina, tamano);
        return ResponseEntity.ok(productoService.listarPaginado(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProductoDto> crear(@Valid @RequestBody ProductoDto productoDto) {
        ProductoDto creado = productoService.crear(productoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> actualizar(@PathVariable Long id, @Valid @RequestBody ProductoDto productoDto) {
        return ResponseEntity.ok(productoService.actualizar(id, productoDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<ProductoDto>> listarConStockBajo() {
        return ResponseEntity.ok(productoService.listarConStockBajo());
    }
}