package com.invenpro.invenpro_backend.service.impl;

import com.invenpro.invenpro_backend.dto.UsuarioDto;
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
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        return usuarioMapper.toDto(usuario);
    }

    @Override
    public UsuarioDto crear(UsuarioDto usuarioDto) {
        if (usuarioRepository.findByEmail(usuarioDto.getEmail()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuarioDto.getEmail());
        }

        Usuario usuario = usuarioMapper.toEntity(usuarioDto);
        usuario.setId(null);
        usuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));

        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(guardado);
    }

    @Override
    public UsuarioDto actualizar(Long id, UsuarioDto usuarioDto) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        existente.setNombre(usuarioDto.getNombre());
        existente.setEmail(usuarioDto.getEmail());
        existente.setRol(usuarioDto.getRol());

        if (usuarioDto.getPassword() != null && !usuarioDto.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(existente);
        return usuarioMapper.toDto(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}