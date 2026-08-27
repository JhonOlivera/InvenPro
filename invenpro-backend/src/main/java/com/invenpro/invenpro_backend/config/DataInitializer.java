package com.invenpro.invenpro_backend.config;

import com.invenpro.invenpro_backend.model.entity.Usuario;
import com.invenpro.invenpro_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail("admin@invenpro.com").isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .email("admin@invenpro.com")
                    .password(passwordEncoder.encode("admin123"))
                    .rol(Usuario.Rol.ADMIN)
                    .build();

            usuarioRepository.save(admin);
            System.out.println(">>> Usuario ADMIN creado: admin@invenpro.com / admin123");
        }
    }
}