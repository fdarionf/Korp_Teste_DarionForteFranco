using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServicoFaturamento.Entities;

namespace ServicoFaturamento.Controllers
{
    [Route("api/notasfiscais")]
    [ApiController]
    public class NotasFiscaisController : ControllerBase
    {

        private static List<NotaFiscal> _notasFiscaisDB = new List<NotaFiscal>();
        private static int _numeroNota = 1;

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
    }
}
