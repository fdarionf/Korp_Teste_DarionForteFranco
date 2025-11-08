import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService { 

  private readonly apiUrl = 'https://localhost:7049/api/notasfiscais';
  constructor(private http: HttpClient) { }

  getNotas() {
    return this.http.get(this.apiUrl);
  }

  salvarNota(itensDaNota: any[]) {
    return this.http.post(this.apiUrl, itensDaNota);
  }

  imprimirNota(numeroNota: number) {
    return this.http.post(`${this.apiUrl}/${numeroNota}/imprimir`, {});
  }

  getNotaPorNumero(numero: number) {
    return this.http.get(`${this.apiUrl}/${numero}`);
  }
}