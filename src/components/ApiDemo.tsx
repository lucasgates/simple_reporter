import React, { useState } from 'react';
import { ReportData, defaultReportData, RiskLevel, SecurityStatus, iconMap } from './SecurityReport';
import { Copy, Send, Check, AlertCircle } from 'lucide-react';

function ApiDemo() {
  const [formData, setFormData] = useState<ReportData>({...defaultReportData});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.securityQuestions];
    
    if (field === 'status') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        status: value as SecurityStatus
      };
    } else if (field === 'icon') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        icon: value as keyof typeof iconMap
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      securityQuestions: updatedQuestions
    }));
  };

  const handleRecommendationChange = (index: number, value: string) => {
    const updatedRecommendations = [...formData.recommendations];
    updatedRecommendations[index] = value;
    
    setFormData(prev => ({
      ...prev,
      recommendations: updatedRecommendations
    }));
  };

  const addRecommendation = () => {
    setFormData(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, '']
    }));
  };

  const removeRecommendation = (index: number) => {
    const updatedRecommendations = [...formData.recommendations];
    updatedRecommendations.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      recommendations: updatedRecommendations
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      icon: 'Shield' as keyof typeof iconMap,
      question: '',
      answer: '',
      status: 'positive' as SecurityStatus
    };
    
    setFormData(prev => ({
      ...prev,
      securityQuestions: [...prev.securityQuestions, newQuestion]
    }));
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...formData.securityQuestions];
    updatedQuestions.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      securityQuestions: updatedQuestions
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setReportUrl(null);
    
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccess(true);
        setReportUrl(result.reportUrl);
      } else {
        setError(result.error || 'Failed to create report');
      }
    } catch (err) {
      console.error('Error creating report:', err);
      setError('An error occurred while creating the report');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (reportUrl) {
      navigator.clipboard.writeText(reportUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Criar Relatório de Segurança</h1>
        
        {success && reportUrl && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-400 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Relatório criado com sucesso!</h3>
                <p className="text-gray-300 mb-4">Seu relatório está disponível no link abaixo:</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="text" 
                    value={reportUrl} 
                    readOnly 
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={reportUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-block"
                  >
                    Ver Relatório
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">Erro</h3>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="companyName" className="block text-gray-300 mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
                />
              </div>
              
              <div>
                <label htmlFor="companyLogo" className="block text-gray-300 mb-2">URL do Logo</label>
                <input
                  type="text"
                  id="companyLogo"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="riskLevel" className="block text-gray-300 mb-2">Nível de Risco</label>
              <select
                id="riskLevel"
                name="riskLevel"
                value={formData.riskLevel}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              >
                <option value="Alto">Alto</option>
                <option value="Médio">Médio</option>
                <option value="Baixo">Baixo</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="executiveSummary" className="block text-gray-300 mb-2">Resumo Executivo</label>
              <textarea
                id="executiveSummary"
                name="executiveSummary"
                value={formData.executiveSummary}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
          </div>
          
          {/* Security Questions */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-100">Questões de Segurança</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                + Adicionar Questão
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.securityQuestions.map((question, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-gray-300 font-medium">Questão #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-400 mb-1 text-sm">Ícone</label>
                      <select
                        value={question.icon}
                        onChange={(e) => handleQuestionChange(index, 'icon', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-gray-300"
                      >
                        {Object.keys(iconMap).map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-1 text-sm">Status</label>
                      <select
                        value={question.status}
                        onChange={(e) => handleQuestionChange(index, 'status', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-gray-300"
                      >
                        <option value="positive">Positivo</option>
                        <option value="negative">Negativo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-1 text-sm">Pergunta</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-1 text-sm">Resposta</label>
                    <input
                      type="text"
                      value={question.answer}
                      onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-100">Recomendações</h2>
              <button
                type="button"
                onClick={addRecommendation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                + Adicionar Recomendação
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={recommendation}
                    onChange={(e) => handleRecommendationChange(index, e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeRecommendation(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium ${
                loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Gerar Relatório</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApiDemo;