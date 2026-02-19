import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import axios from 'axios';

const ConversaoMoedasPage = () => {
  const [valor, setValor] = useState('');
  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [resultado, setResultado] = useState<number | null>(null);
  const [taxa, setTaxa] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moedas = [
    { code: 'BRL', name: 'Real Brasileiro' },
    { code: 'USD', name: 'Dólar Americano' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Iene Japonês' },
    { code: 'ARS', name: 'Peso Argentino' },
    { code: 'CAD', name: 'Dólar Canadense' },
    { code: 'AUD', name: 'Dólar Australiano' },
  ];

  const converter = async () => {
    if (!valor || parseFloat(valor) <= 0) {
      setError('Digite um valor válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${moedaOrigem}`
      );
      
      const taxaConversao = response.data.rates[moedaDestino];
      const valorConvertido = parseFloat(valor) * taxaConversao;
      
      setTaxa(taxaConversao);
      setResultado(valorConvertido);
    } catch (err) {
      setError('Erro ao buscar taxa de câmbio');
    } finally {
      setLoading(false);
    }
  };

  const inverterMoedas = () => {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
    setResultado(null);
    setTaxa(null);
  };

  return (
    <div className="container">
      <PageHeader
        title="Conversão de Moedas"
        subtitle="Converta valores entre diferentes moedas"
        icon="currency_exchange"
      />

      {error && (
        <div className="alert alert-error">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">swap_horiz</span>
          Conversor
        </h2>
        
        <div className="grid grid-3">
          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              className="form-control"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>De</label>
            <select
              className="form-control"
              value={moedaOrigem}
              onChange={(e) => setMoedaOrigem(e.target.value)}
            >
              {moedas.map((moeda) => (
                <option key={moeda.code} value={moeda.code}>
                  {moeda.code} - {moeda.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Para</label>
            <select
              className="form-control"
              value={moedaDestino}
              onChange={(e) => setMoedaDestino(e.target.value)}
            >
              {moedas.map((moeda) => (
                <option key={moeda.code} value={moeda.code}>
                  {moeda.code} - {moeda.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="btn-group">
          <Button
            variant="primary"
            icon="currency_exchange"
            onClick={converter}
            disabled={loading}
          >
            {loading ? 'Convertendo...' : 'Converter'}
          </Button>
          <Button
            variant="secondary"
            icon="swap_horiz"
            onClick={inverterMoedas}
          >
            Inverter Moedas
          </Button>
        </div>
      </div>

      {resultado !== null && (
        <div className="card">
          <h2>
            <span className="material-symbols-outlined">check_circle</span>
            Resultado
          </h2>
          <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              <strong>{parseFloat(valor).toFixed(2)} {moedaOrigem}</strong> =
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
              {resultado.toFixed(2)} {moedaDestino}
            </div>
            {taxa && (
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Taxa de câmbio: 1 {moedaOrigem} = {taxa.toFixed(4)} {moedaDestino}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversaoMoedasPage;
