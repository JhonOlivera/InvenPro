package com.invenpro.invenpro_backend.mapper;

import com.invenpro.invenpro_backend.dto.MovimientoInventarioDto;
import com.invenpro.invenpro_backend.model.entity.MovimientoInventario;
import com.invenpro.invenpro_backend.model.entity.Producto;
import com.invenpro.invenpro_backend.model.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class MovimientoInventarioMapper {

    public MovimientoInventarioDto toDto(MovimientoInventario movimiento) {
        if (movimiento == null) {
            return null;
        }
        return MovimientoInventarioDto.builder()
                .id(movimiento.getId())
                .productoId(movimiento.getProducto() != null ? movimiento.getProducto().getId() : null)
                .productoNombre(movimiento.getProducto() != null ? movimiento.getProducto().getNombre() : null)
                .tipo(movimiento.getTipo())
                .cantidad(movimiento.getCantidad())
                .fecha(movimiento.getFecha())
                .usuarioId(movimiento.getUsuario() != null ? movimiento.getUsuario().getId() : null)
                .usuarioNombre(movimiento.getUsuario() != null ? movimiento.getUsuario().getNombre() : null)
                .build();
    }

    public MovimientoInventario toEntity(MovimientoInventarioDto dto, Producto producto, Usuario usuario) {
        if (dto == null) {
            return null;
        }
        return MovimientoInventario.builder()
                .id(dto.getId())
                .producto(producto)
                .tipo(dto.getTipo())
                .cantidad(dto.getCantidad())
                .usuario(usuario)
                .build();
    }
}