package com.invenpro.invenpro_backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Reemplaza al BasicAuthenticationEntryPoint por defecto de Spring Security,
 * que agrega el header "WWW-Authenticate: Basic" a cada 401. Ese header hace
 * que el navegador (sobre todo Chrome) muestre su propio dialogo nativo de
 * usuario/contrasena en vez de dejar que el formulario de login del
 * frontend maneje el error. Aqui se responde 401 sin ese header.
 *
 * El cuerpo se escribe como string literal (sin ObjectMapper) porque este
 * proyecto no expone un bean de Jackson inyectable en este punto del
 * arranque; evita esa dependencia en vez de perseguirla.
 */
@Component
public class SpaAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("""
                {"timestamp":"%s","status":401,"error":"Credenciales invalidas","mensaje":"Email o contrasena incorrectos","detalles":null}"""
                .formatted(LocalDateTime.now()));
    }
}
