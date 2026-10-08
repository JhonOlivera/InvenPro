export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  mensaje: string;
  detalles?: string[];
}
