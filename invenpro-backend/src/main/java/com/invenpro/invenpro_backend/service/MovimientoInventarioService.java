package com.invenpro.invenpro_backend.service;

import com.invenpro.invenpro_backend.dto.MovimientoInventarioDto;

import java.util.List;

public interface MovimientoInventarioService {

    List<MovimientoInventarioDto> listarTodos();

    List<MovimientoInventarioDto> listarPorProducto(Long productoId);

    MovimientoInventarioDto registrar(MovimientoInventarioDto movimientoDto, String emailUsuario);
}