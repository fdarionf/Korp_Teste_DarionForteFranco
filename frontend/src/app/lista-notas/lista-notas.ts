import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotaFiscalService } from '../nota-fiscal';

@Component({
  selector: 'app-lista-notas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-notas.html',
  styleUrl: './lista-notas.css'
})
export class ListaNotas implements OnInit {

  notas: any[] = [];

  constructor(private notaFiscalService: NotaFiscalService) { }

  ngOnInit(): void {
    this.carregarNotas(); // 1. Movido para um método separado
  }

  // Método para carregar (ou recarregar) as notas da API
  carregarNotas(): void {
    this.notaFiscalService.getNotas()
      .subscribe({
        next: (resposta: any) => {
          this.notas = resposta;
        },
        error: (erro: any) => {
          console.error('Erro ao buscar notas fiscais:', erro);
          alert('Não foi possível carregar as notas.');
        }
      });
  }

  // --- 2. ADICIONE ESTE MÉTODO ---
  // Será chamado pelo botão "Imprimir"
  onImprimir(numeroNota: number): void {
    this.notaFiscalService.imprimirNota(numeroNota)
      .subscribe({
        next: (resposta: any) => {
          alert('Nota impressa com sucesso! Status alterado para "Fechada".');
          // 3. Recarrega a lista da API para mostrar a mudança
          this.carregarNotas(); 
        },
        error: (erro: any) => {
          console.error('Erro ao imprimir nota:', erro);
          alert('Erro ao imprimir: ' + (erro.error || erro.message));
        }
      });
  }
}