import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly apiUrl = 'https://localhost:7018/api/produtos';

  constructor(private http: HttpClient) { }

  salvarProduto(produto: any) {
    return this.http.post(this.apiUrl, produto);
  }

  getProdutos() {
    return this.http.get(this.apiUrl);
  }

  getProdutoPorCodigo(codigo: number) {
    return this.http.get(`${this.apiUrl}/${codigo}`);
  }

}