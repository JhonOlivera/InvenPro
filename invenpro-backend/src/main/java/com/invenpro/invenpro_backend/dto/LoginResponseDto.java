package com.invenpro.invenpro_backend.dto;

import com.invenpro.invenpro_backend.model.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDto {
    private String nombre;
    private String email;
    private Usuario.Rol rol;
}