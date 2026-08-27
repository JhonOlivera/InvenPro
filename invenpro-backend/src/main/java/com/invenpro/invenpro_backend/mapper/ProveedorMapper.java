package com.invenpro.invenpro_backend.mapper;

import com.invenpro.invenpro_backend.dto.ProveedorDto;
import com.invenpro.invenpro_backend.model.entity.Proveedor;
import org.springframework.stereotype.Component;

@Component
public class ProveedorMapper {

    public ProveedorDto toDto(Proveedor proveedor) {
        if (proveedor == null) {
            return null;
        }
        return ProveedorDto.builder()
                .id(proveedor.getId())
                .nombre(proveedor.getNombre())
                .telefono(proveedor.getTelefono())
                .email(proveedor.getEmail())
                .build();
    }

    public Proveedor toEntity(ProveedorDto dto) {
        if (dto == null) {
            return null;
        }
        return Proveedor.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .build();
    }
}