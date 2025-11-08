using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServicoFaturamento.Entities;
using ServicoFaturamento.Entities.Enums;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ServicoFaturamento.Controllers
{
    [Route("api/notasfiscais")]
    [ApiController]
    public class NotasFiscaisController : ControllerBase
    {
        private static List<NotaFiscal> _notasFiscaisDB = new List<NotaFiscal>();
        private static int _numeroNota = 1;

        private readonly IHttpClientFactory _httpClientFactory;

        public NotasFiscaisController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public IActionResult CadastroNotaFiscal([FromBody] List<ItemNotaFiscal> itensDaNota)
        {
            var novaNota = new NotaFiscal();
            novaNota.Numeracao = _numeroNota;
            _numeroNota++;
            novaNota.Status = StatusNota.Aberta;
            novaNota.ListaProdutos = itensDaNota;
            _notasFiscaisDB.Add(novaNota);
            return CreatedAtAction(nameof(GetNotaFiscalPorNumero), new { numero = novaNota.Numeracao }, novaNota);
        }

        [HttpGet("{numero}")]
        public IActionResult GetNotaFiscalPorNumero(int numero)
        {
            var notaEncontrada = _notasFiscaisDB.FirstOrDefault(n => n.Numeracao == numero);

            if (notaEncontrada == null)
            {
                return NotFound();
            }

            return Ok(notaEncontrada);
        }

        [HttpPost("{numero}/imprimir")]
        public async Task<IActionResult> ImprimirNota(int numero)
        {
            var notaParaImprimir = _notasFiscaisDB.FirstOrDefault(n => n.Numeracao == numero);

            if (notaParaImprimir == null)
            {
                return NotFound("Nota fiscal não encontrada.");
            }

            if (notaParaImprimir.Status != StatusNota.Aberta)
            {
                return BadRequest("Impressão não permitida. A nota fiscal já está Fechada.");
            }

            var urlServicoEstoque = "https://localhost:7018";
            var httpClient = _httpClientFactory.CreateClient();

            foreach (var item in notaParaImprimir.ListaProdutos)
            {
                var debitoRequest = new { Quantidade = item.Quantidade };
                var jsonBody = JsonSerializer.Serialize(debitoRequest);
                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                var urlEndpoint = $"{urlServicoEstoque}/api/produtos/{item.CodigoProduto}/debitar-estoque";

                var response = await httpClient.PostAsync(urlEndpoint, content);

                if (!response.IsSuccessStatusCode)
                {
                    var erroMsg = await response.Content.ReadAsStringAsync();
                    return BadRequest($"Falha ao debitar estoque para o produto {item.CodigoProduto}: {erroMsg}");
                }
            }
            notaParaImprimir.Status = StatusNota.Fechada;

            return Ok(notaParaImprimir);
        }

        [HttpGet]
        public IActionResult GetTodasNotas()
        {
            return Ok(_notasFiscaisDB);
        }
    }
}