import { Routes } from '@angular/router';

import { CadastroProduto } from './cadastro-produto/cadastro-produto';
import { CadastroNota } from './cadastro-nota/cadastro-nota';
import { ListaNotas } from './lista-notas/lista-notas';
import { DetalheNota } from './detalhe-nota/detalhe-nota';
import { Home } from './home/home'; 
import { ListaProdutos } from './lista-produtos/lista-produtos';

export const routes: Routes = [

  { path: '', component: Home }, 
  { path: 'cadastro-produto', component: CadastroProduto },
  { path: 'cadastro-nota', component: CadastroNota },
  { path: 'notas', component: ListaNotas },
  { path: 'notas/:id', component: DetalheNota },
  { path: 'lista-produtos', component: ListaProdutos },
];