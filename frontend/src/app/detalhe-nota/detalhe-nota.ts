import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotaFiscalService } from '../nota-fiscal';

@Component({
  selector: 'app-detalhe-nota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhe-nota.html',
  styleUrl: './detalhe-nota.css'
})
export class DetalheNota implements OnInit {

  nota: any = null;
  numeroNota: number = 0;

  constructor(
    private route: ActivatedRoute,
    private notaFiscalService: NotaFiscalService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.numeroNota = +params['id'];

      if (this.numeroNota) {
        this.buscarNota();
      }
    });
  }

  buscarNota(): void {
    this.notaFiscalService.getNotaPorNumero(this.numeroNota)
      .subscribe({
        next: (resposta: any) => {
          this.nota = resposta;
        },
        error: (erro: any) => {
          console.error('Erro ao buscar detalhe da nota:', erro);
          alert('Erro ao carregar nota.');
        }
      });
  }

  imprimir(): void {
    this.notaFiscalService.imprimirNota(this.numeroNota)
      .subscribe({
        next: (resposta: any) => {
          alert('Nota impressa com sucesso! Status alterado para "Fechada".');
          this.nota = resposta; 
        },
        error: (erro: any) => {
          console.error('Erro ao imprimir nota:', erro);
          alert('Erro ao imprimir: ' + erro.error); 
        }
      });
  }
}