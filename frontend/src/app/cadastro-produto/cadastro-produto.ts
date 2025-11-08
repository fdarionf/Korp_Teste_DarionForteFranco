import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ProdutoService } from '../produto';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-produto.html',
  styleUrl: './cadastro-produto.css'
})
export class CadastroProduto {
  
  produtoForm = new FormGroup({
    codigo: new FormControl(0),
    descricao: new FormControl(''),
    saldo: new FormControl(0)
  });

  constructor(private produtoService: ProdutoService) { }

  onSubmit() {

    this.produtoService.salvarProduto(this.produtoForm.value)
      .subscribe({

        next: (resposta: any) => {
          console.log('Produto salvo com sucesso!', resposta);
          alert('Produto salvo com sucesso!');

          this.produtoForm.reset(); 
        },
         
        error: (erro: any) => {
          console.error('Erro ao salvar produto:', erro);
          alert('Erro ao salvar produto: ' + erro.message);
        }
      });
  }
}