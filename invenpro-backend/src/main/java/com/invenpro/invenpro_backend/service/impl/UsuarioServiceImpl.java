package com.invenpro.invenpro_backend.service.impl;

import com.invenpro.invenpro_backend.dto.UsuarioDto;
import com.invenpro.invenpro_backend.exception.RecursoNoEncontradoException;
import com.invenpro.invenpro_backend.exception.ReglaDeNegocioException;
import com.invenpro.invenpro_backend.mapper.UsuarioMapper;
import com.invenpro.invenpro_backend.model.entity.Usuario;
import com.invenpro.invenpro_backend.repository.UsuarioRepository;
import com.invenpro.invenpro_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioDto> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDto)
                .toList();
    }

    @Override
    public UsuarioDto buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con id: " + id));
        return usuarioMapper.toDto(usuario);
    }

    @Override
    public UsuarioDto crear(UsuarioDto usuarioDto) {
        if (usuarioRepository.findByEmail(usuarioDto.getEmail()).isPresent()) {
            throw new ReglaDeNegocioException("Ya existe un usuario con el email: " + usuarioDto.getEmail());
        }
        validarPassword(usuarioDto.getPassword(), true);

        Usuario usuario = usuarioMapper.toEntity(usuarioDto);
        usuario.setId(null);
        usuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));

        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(guardado);
    }

    @Override
    public UsuarioDto actualizar(Long id, UsuarioDto usuarioDto) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con id: " + id));

        existente.setNombre(usuarioDto.getNombre());
        existente.setEmail(usuarioDto.getEmail());
        existente.setRol(usuarioDto.getRol());

        boolean cambiaPassword = usuarioDto.getPassword() != null && !usuarioDto.getPassword().isBlank();
        validarPassword(usuarioDto.getPassword(), false);
        if (cambiaPassword) {
            existente.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(existente);
        return usuarioMapper.toDto(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * La contraseña no tiene @NotBlank/@Size en el DTO porque en edición se
     * deja vacía para no cambiarla. En creación sí es obligatoria; en edición
     * solo se valida la longitud si efectivamente se envió una nueva.
     */
    private void validarPassword(String password, boolean obligatoria) {
        boolean vacia = password == null || password.isBlank();
        if (vacia) {
            if (obligatoria) {
                throw new ReglaDeNegocioException("La contraseña es obligatoria");
            }
            return;
        }
        if (password.length() < 6) {
            throw new ReglaDeNegocioException("La contraseña debe tener al menos 6 caracteres");
        }
    }
}