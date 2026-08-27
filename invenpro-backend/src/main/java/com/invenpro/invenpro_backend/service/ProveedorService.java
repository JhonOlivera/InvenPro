package com.invenpro.invenpro_backend.service;

import com.invenpro.invenpro_backend.dto.ProveedorDto;

import java.util.List;

public interface ProveedorService {

    List<ProveedorDto> listarTodos();

    ProveedorDto buscarPorId(Long id);

    ProveedorDto crear(ProveedorDto proveedorDto);

    ProveedorDto actualizar(Long id, ProveedorDto proveedorDto);

    void eliminar(Long id);
}