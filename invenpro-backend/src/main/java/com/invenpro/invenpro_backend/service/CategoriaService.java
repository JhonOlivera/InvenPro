package com.invenpro.invenpro_backend.service;

import com.invenpro.invenpro_backend.dto.CategoriaDto;

import java.util.List;

public interface CategoriaService {

    List<CategoriaDto> listarTodas();

    CategoriaDto buscarPorId(Long id);

    CategoriaDto crear(CategoriaDto categoriaDto);

    CategoriaDto actualizar(Long id, CategoriaDto categoriaDto);

    void eliminar(Long id);
}