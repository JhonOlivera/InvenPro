package com.invenpro.invenpro_backend.service.impl;

import com.invenpro.invenpro_backend.dto.ProveedorDto;
import com.invenpro.invenpro_backend.exception.RecursoNoEncontradoException;
import com.invenpro.invenpro_backend.mapper.ProveedorMapper;
import com.invenpro.invenpro_backend.model.entity.Proveedor;
import com.invenpro.invenpro_backend.repository.ProveedorRepository;
import com.invenpro.invenpro_backend.service.ProveedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProveedorServiceImpl implements ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    @Override
    public List<ProveedorDto> listarTodos() {
        return proveedorRepository.findAll()
                .stream()
                .map(proveedorMapper::toDto)
                .toList();
    }

    @Override
    public ProveedorDto buscarPorId(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor no encontrado con id: " + id));
        return proveedorMapper.toDto(proveedor);
    }

    @Override
    public ProveedorDto crear(ProveedorDto proveedorDto) {
        Proveedor proveedor = proveedorMapper.toEntity(proveedorDto);
        proveedor.setId(null);
        Proveedor guardado = proveedorRepository.save(proveedor);
        return proveedorMapper.toDto(guardado);
    }

    @Override
    public ProveedorDto actualizar(Long id, ProveedorDto proveedorDto) {
        Proveedor existente = proveedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor no encontrado con id: " + id));

        existente.setNombre(proveedorDto.getNombre());
        existente.setTelefono(proveedorDto.getTelefono());
        existente.setEmail(proveedorDto.getEmail());

        Proveedor actualizado = proveedorRepository.save(existente);
        return proveedorMapper.toDto(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!proveedorRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Proveedor no encontrado con id: " + id);
        }
        proveedorRepository.deleteById(id);
    }
}