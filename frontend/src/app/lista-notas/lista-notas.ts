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
    this.carregarNotas();
  }

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

  onImprimir(numeroNota: number): void {
    this.notaFiscalService.imprimirNota(numeroNota)
      .subscribe({
        next: (resposta: any) => {
          alert('Nota impressa com sucesso! Status alterado para "Fechada".');
          this.carregarNotas(); 
        },
        error: (erro: any) => {
          console.error('Erro ao imprimir nota:', erro);
          alert('Erro ao imprimir: ' + (erro.error || erro.message));
        }
      });
  }
}