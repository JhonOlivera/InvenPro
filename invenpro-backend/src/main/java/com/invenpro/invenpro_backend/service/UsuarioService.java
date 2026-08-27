package com.invenpro.invenpro_backend.service;

import com.invenpro.invenpro_backend.dto.UsuarioDto;

import java.util.List;

public interface UsuarioService {

    List<UsuarioDto> listarTodos();

    UsuarioDto buscarPorId(Long id);

    UsuarioDto crear(UsuarioDto usuarioDto);

    UsuarioDto actualizar(Long id, UsuarioDto usuarioDto);

    void eliminar(Long id);
}