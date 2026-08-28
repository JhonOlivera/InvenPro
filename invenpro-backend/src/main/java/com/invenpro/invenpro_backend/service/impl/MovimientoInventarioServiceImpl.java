package com.invenpro.invenpro_backend.service.impl;

import com.invenpro.invenpro_backend.dto.MovimientoInventarioDto;
import com.invenpro.invenpro_backend.mapper.MovimientoInventarioMapper;
import com.invenpro.invenpro_backend.model.entity.MovimientoInventario;
import com.invenpro.invenpro_backend.model.entity.Producto;
import com.invenpro.invenpro_backend.model.entity.Usuario;
import com.invenpro.invenpro_backend.repository.MovimientoInventarioRepository;
import com.invenpro.invenpro_backend.repository.ProductoRepository;
import com.invenpro.invenpro_backend.repository.UsuarioRepository;
import com.invenpro.invenpro_backend.service.MovimientoInventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientoInventarioServiceImpl implements MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimientoInventarioMapper movimientoMapper;

    @Override
    public List<MovimientoInventarioDto> listarTodos() {
        return movimientoRepository.findAll()
                .stream()
                .map(movimientoMapper::toDto)
                .toList();
    }

    @Override
    public List<MovimientoInventarioDto> listarPorProducto(Long productoId) {
        return movimientoRepository.findByProductoIdOrderByFechaDesc(productoId)
                .stream()
                .map(movimientoMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public MovimientoInventarioDto registrar(MovimientoInventarioDto movimientoDto, String emailUsuario) {
        Producto producto = productoRepository.findById(movimientoDto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + movimientoDto.getProductoId()));

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + emailUsuario));

        int cantidad = movimientoDto.getCantidad();

        if (movimientoDto.getTipo() == MovimientoInventario.TipoMovimiento.SALIDA) {
            if (producto.getStock() < cantidad) {
                throw new RuntimeException(
                        "Stock insuficiente. Stock actual: " + producto.getStock() + ", cantidad solicitada: " + cantidad
                );
            }
            producto.setStock(producto.getStock() - cantidad);
        } else {
            producto.setStock(producto.getStock() + cantidad);
        }

        productoRepository.save(producto);

        MovimientoInventario movimiento = movimientoMapper.toEntity(movimientoDto, producto, usuario);
        movimiento.setId(null);
        MovimientoInventario guardado = movimientoRepository.save(movimiento);

        return movimientoMapper.toDto(guardado);
    }
}