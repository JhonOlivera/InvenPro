package com.invenpro.invenpro_backend.dto;

import com.invenpro.invenpro_backend.model.entity.MovimientoInventario;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoInventarioDto {

    private Long id;

    @NotNull(message = "El producto es obligatorio")
    private Long productoId;

    private String productoNombre;

    @NotNull(message = "El tipo de movimiento es obligatorio")
    private MovimientoInventario.TipoMovimiento tipo;

    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    private LocalDateTime fecha;

    private Long usuarioId;

    private String usuarioNombre;
}