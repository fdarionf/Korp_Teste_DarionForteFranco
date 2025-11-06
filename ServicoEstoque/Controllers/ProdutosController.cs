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

        [HttpGet("{codigo}")] // Responde a GET "api/produtos/123"
        public IActionResult GetProdutoPorCodigo(int codigo)
        {
            var ProductFound = _productsDB.FirstOrDefault(p => p.Codigo == codigo);

            if(ProductFound == null)
            {
                return NotFound();
            }
            return Ok(ProductFound);
        }
    }
}
