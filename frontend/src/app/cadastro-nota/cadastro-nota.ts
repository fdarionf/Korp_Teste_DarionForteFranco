import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NotaFiscalService } from '../nota-fiscal';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../produto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-nota',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-nota.html',
  styleUrl: './cadastro-nota.css'
})

export class CadastroNota {
  notaForm: FormGroup;
  constructor(
    private notaFiscalService: NotaFiscalService,
    private produtoService: ProdutoService,
    private router: Router
  ) {
    this.notaForm = new FormGroup({
      itens: new FormArray([
        this.criarItemFormGroup()
      ])
    });
  }

  get itens() {
    return this.notaForm.get('itens') as FormArray;
  }

  onCodigoBlur(index: number): void {
    const itemGroup = this.itens.at(index) as FormGroup;
    const codigo = itemGroup.get('codigoProduto')?.value;

    if (codigo) {
      this.produtoService.getProdutoPorCodigo(codigo)
        .subscribe({
          next: (produto: any) => {
            itemGroup.patchValue({
              descricaoProduto: produto.descricao 
            });
          },
          error: (erro: any) => {
            itemGroup.patchValue({ descricaoProduto: 'Produto não encontrado' });
          }
        });
    }
  }

  criarItemFormGroup(): FormGroup {
    return new FormGroup({
      codigoProduto: new FormControl(0),
      quantidade: new FormControl(1),
      descricaoProduto: new FormControl('')
    });
  }

  adicionarItem() {
    const itens = this.notaForm.get('itens') as FormArray;
    itens.push(this.criarItemFormGroup());
  }

  onSubmit() {
    const itensParaSalvar = this.notaForm.getRawValue().itens;

    this.notaFiscalService.salvarNota(itensParaSalvar)
      .subscribe({
        next: (resposta: any) => {

          const numeroDaNovaNota = resposta.numeracao;

          this.router.navigate(['/notas', numeroDaNovaNota]);
        },
        error: (erro: any) => {
          console.error('Erro ao salvar Nota Fiscal:', erro);
          alert('Erro ao salvar Nota Fiscal: ' + erro.message);
        }
      });
  }
}