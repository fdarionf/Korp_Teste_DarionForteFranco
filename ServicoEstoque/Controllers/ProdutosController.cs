using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServicoEstoque.Entities;
using System.Linq;

namespace ServicoEstoque.Controllers
{
    [Route("api/produtos")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private static List<Produto> _productsDB = new List<Produto>();

        [HttpPost]
        public IActionResult CadastrarProduto([FromBody] Produto produto)
        {

            _productsDB.Add(produto);
            return CreatedAtAction(nameof(GetProdutoPorCodigo), new { codigo = produto.Codigo }, produto);
        }

        [HttpGet("{codigo}")]
        public IActionResult GetProdutoPorCodigo(int codigo)
        {
            var ProductFound = _productsDB.FirstOrDefault(p => p.Codigo == codigo);

            if(ProductFound == null)
            {
                return NotFound();
            }
            return Ok(ProductFound);
        }

        [HttpPost("{codigo}/debitar-estoque")]
        public IActionResult DebitarEstoque(int codigo, [FromBody] DebitoRequest request)
        {
            var produto = _productsDB.FirstOrDefault(p => p.Codigo == codigo);
            if (produto == null)
            {
                return NotFound("Produto não encontrado.");
            }

            if (produto.Saldo < request.Quantidade)
            {
                return BadRequest("Estoque insuficiente.");
            }

            produto.Saldo = produto.Saldo - request.Quantidade;

            return Ok(produto);
        }
    }
}
