package com.invenpro.invenpro_backend.service;

import com.invenpro.invenpro_backend.dto.ProductoDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductoService {

    List<ProductoDto> listarTodos();

    Page<ProductoDto> listarPaginado(Pageable pageable);

    ProductoDto buscarPorId(Long id);

    ProductoDto crear(ProductoDto productoDto);

    ProductoDto actualizar(Long id, ProductoDto productoDto);

    void eliminar(Long id);

    List<ProductoDto> listarConStockBajo();
}