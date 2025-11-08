import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../produto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css'
})
export class ListaProdutos implements OnInit {

  produtos: any[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.getProdutos()
      .subscribe({
        next: (resposta: any) => {
          this.produtos = resposta;
        },
        error: (erro: any) => {
          console.error('Erro ao buscar produtos:', erro);
          alert('Não foi possível carregar os produtos.');
        }
      });
  }
}