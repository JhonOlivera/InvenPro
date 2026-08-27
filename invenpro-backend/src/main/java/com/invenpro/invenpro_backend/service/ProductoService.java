package com.invenpro.invenpro_backend.service;

import com.invenpro.invenpro_backend.dto.ProductoDto;

import java.util.List;

public interface ProductoService {

    List<ProductoDto> listarTodos();

    ProductoDto buscarPorId(Long id);

    ProductoDto crear(ProductoDto productoDto);

    ProductoDto actualizar(Long id, ProductoDto productoDto);

    void eliminar(Long id);

    List<ProductoDto> listarConStockBajo();
}