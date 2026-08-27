package com.invenpro.invenpro_backend.service.impl;

import com.invenpro.invenpro_backend.dto.CategoriaDto;
import com.invenpro.invenpro_backend.mapper.CategoriaMapper;
import com.invenpro.invenpro_backend.model.entity.Categoria;
import com.invenpro.invenpro_backend.repository.CategoriaRepository;
import com.invenpro.invenpro_backend.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    @Override
    public List<CategoriaDto> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(categoriaMapper::toDto)
                .toList();
    }

    @Override
    public CategoriaDto buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + id));
        return categoriaMapper.toDto(categoria);
    }

    @Override
    public CategoriaDto crear(CategoriaDto categoriaDto) {
        Categoria categoria = categoriaMapper.toEntity(categoriaDto);
        categoria.setId(null); // aseguramos que sea un insert, no un update
        Categoria guardada = categoriaRepository.save(categoria);
        return categoriaMapper.toDto(guardada);
    }

    @Override
    public CategoriaDto actualizar(Long id, CategoriaDto categoriaDto) {
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + id));

        existente.setNombre(categoriaDto.getNombre());
        existente.setDescripcion(categoriaDto.getDescripcion());

        Categoria actualizada = categoriaRepository.save(existente);
        return categoriaMapper.toDto(actualizada);
    }

    @Override
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoria no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}