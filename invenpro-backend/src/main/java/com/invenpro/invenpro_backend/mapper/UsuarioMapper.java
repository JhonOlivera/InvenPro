package com.invenpro.invenpro_backend.mapper;

import com.invenpro.invenpro_backend.dto.UsuarioDto;
import com.invenpro.invenpro_backend.model.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioDto toDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        return UsuarioDto.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }

    public Usuario toEntity(UsuarioDto dto) {
        if (dto == null) {
            return null;
        }
        return Usuario.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .rol(dto.getRol())
                .build();
    }
}