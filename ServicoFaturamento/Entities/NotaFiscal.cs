using System.Collections.Generic;

namespace ServicoFaturamento.Entities
{
    public class NotaFiscal
    {
        public int Numeracao { get; set; }
        public StatusNota Status { get; set; }
        public List<ItemNotaFiscal> ListaProdutos { get; set; }


        public NotaFiscal()
        {
            ListaProdutos = new List<ItemNotaFiscal>();
            Status = StatusNota.Aberta;
        }
    }
}
