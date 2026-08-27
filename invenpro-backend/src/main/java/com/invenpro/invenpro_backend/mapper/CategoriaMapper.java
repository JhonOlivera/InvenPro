package com.invenpro.invenpro_backend.mapper;

import com.invenpro.invenpro_backend.dto.CategoriaDto;
import com.invenpro.invenpro_backend.model.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public CategoriaDto toDto(Categoria categoria) {
        if (categoria == null) {
            return null;
        }
        return CategoriaDto.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .build();
    }

    public Categoria toEntity(CategoriaDto dto) {
        if (dto == null) {
            return null;
        }
        return Categoria.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .build();
    }
}