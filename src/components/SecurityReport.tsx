import React, { useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle, Globe, WholeWord as WordPress, Shield as ShieldIcon, Users, BookOpen, Target, Printer, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

// Define types for our data
export type RiskLevel = 'Alto' | 'Médio' | 'Baixo';
export type SecurityStatus = 'positive' | 'negative';

export interface SecurityQuestionData {
  icon: keyof typeof iconMap;
  question: string;
  answer: string;
  status: SecurityStatus;
}

export interface ReportData {
  date?: string;
  riskLevel: RiskLevel;
  companyName?: string;
  companyLogo?: string;
  executiveSummary: string;
  securityQuestions: SecurityQuestionData[];
  recommendations: string[];
}

// Map of icon names to components
export const iconMap = {
  Globe,
  WordPress,
  ShieldIcon,
  CheckCircle,
  Users,
  Shield,
  BookOpen,
  Target,
  AlertTriangle
};

function RiskBadge({ level }: { level: RiskLevel }) {
  const colors = {
    Alto: 'bg-red-900/20 text-red-400 border-red-800/30',
    Médio: 'bg-yellow-900/20 text-yellow-400 border-yellow-800/30',
    Baixo: 'bg-green-900/20 text-green-400 border-green-800/30'
  };

  const icons = {
    Alto: <AlertTriangle className="w-4 h-4" />,
    Médio: <Shield className="w-4 h-4" />,
    Baixo: <CheckCircle className="w-4 h-4" />
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${colors[level]}`}>
      {icons[level]}
      <span className="font-medium">{level}</span>
    </span>
  );
}

function SecurityQuestion({ 
  iconName, 
  question, 
  answer, 
  status 
}: { 
  iconName: keyof typeof iconMap, 
  question: string, 
  answer: string,
  status: SecurityStatus
}) {
  const Icon = iconMap[iconName];
  
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="p-2 bg-blue-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <h3 className="font-medium text-gray-200">{question}</h3>
        <p className={`mt-1 text-sm ${status === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
          {answer}
        </p>
      </div>
    </div>
  );
}

// Default data for the report
export const defaultReportData: ReportData = {
  date: new Date().toLocaleDateString('pt-BR'),
  riskLevel: 'Alto',
  companyName: 'Triton InfoSec',
  companyLogo: 'https://lucasgates.github.io/TRITON%20LOGOTIPOS-01.png',
  executiveSummary: 'Com base na nossa avaliação abrangente, identificamos várias áreas que requerem atenção imediata para garantir a segurança da infraestrutura digital da organização. Este relatório destaca os principais pontos de vulnerabilidade e fornece recomendações para mitigação de riscos.',
  securityQuestions: [
    {
      icon: 'Globe',
      question: 'URL em escopo',
      answer: 'tritoninfosec.com',
      status: 'positive'
    },
    {
      icon: 'WordPress',
      question: 'O site utiliza WordPress?',
      answer: 'Sim, versão atual',
      status: 'positive'
    },
    {
      icon: 'ShieldIcon',
      question: 'O site possui WAF?',
      answer: 'Sim, CloudFlare implementado',
      status: 'positive'
    },
    {
      icon: 'CheckCircle',
      question: 'O site é atualizado regularmente?',
      answer: 'Sim, atualizações mensais',
      status: 'positive'
    },
    {
      icon: 'Users',
      question: 'Os usuários utilizam MFA?',
      answer: 'Não implementado',
      status: 'negative'
    },
    {
      icon: 'Shield',
      question: 'O site contém dados sensíveis?',
      answer: 'Sim, dados de clientes',
      status: 'negative'
    },
    {
      icon: 'BookOpen',
      question: 'Desenvolvedores fazem cursos de segurança?',
      answer: 'Não regularmente',
      status: 'negative'
    },
    {
      icon: 'Target',
      question: 'São realizados testes de penetração?',
      answer: 'Anualmente',
      status: 'positive'
    }
  ],
  recommendations: [
    'Implementar autenticação multi-fator (MFA) para todos os usuários',
    'Aumentar a frequência de treinamentos de segurança para desenvolvedores',
    'Revisar e atualizar políticas de proteção de dados sensíveis',
    'Manter a regularidade das atualizações de segurança'
  ]
};

interface SecurityReportProps {
  data?: Partial<ReportData>;
}

function SecurityReport({ data = {} }: SecurityReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Merge default data with provided data
  const reportData: ReportData = {
    ...defaultReportData,
    ...data,
    securityQuestions: data.securityQuestions || defaultReportData.securityQuestions,
    recommendations: data.recommendations || defaultReportData.recommendations
  };

  // Setup print handler
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Relatório de Segurança - ${reportData.companyName}`,
    // Optional callback after print
    onAfterPrint: () => console.log('Print completed'),
  });

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Print Controls */}
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Printer className="w-5 h-5" />
          <span>Imprimir PDF</span>
        </button>
      </div>

      {/* Printable Report Content */}
      <div 
        ref={reportRef} 
        className="max-w-4xl mx-auto bg-gray-900 print:bg-white print:text-black"
      >
        <div className="print:shadow-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 print:text-black">
            <h1 className="text-3xl font-bold text-gray-100 print:text-black">{reportData.companyName}</h1>
            {reportData.companyLogo && (
              <img src={reportData.companyLogo} alt={`${reportData.companyName} Logo`} className="h-12" />
            )}
          </div>

          {/* Report Header */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 print:bg-white print:border-gray-300">
            <h2 className="text-2xl font-bold text-gray-100 print:text-black mb-4">Relatório Executivo de Segurança Cibernética</h2>
            <p className="text-gray-400 print:text-gray-600 mb-6">Data: {reportData.date}</p>
            
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h4 className="text-gray-300 print:text-gray-700 font-medium">Nível de Risco Geral:</h4>
                <RiskBadge level={reportData.riskLevel} />
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-100 print:text-black">Resumo Executivo</h3>
              <p className="text-gray-300 print:text-gray-700">
                {reportData.executiveSummary}
              </p>
            </div>
          </div>

          {/* Security Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportData.securityQuestions.map((question, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 print:bg-gray-100 print:border-gray-300"
              >
                <div className="p-2 bg-blue-900/20 print:bg-blue-100 rounded-lg">
                  {React.createElement(iconMap[question.icon], { 
                    className: "w-6 h-6 text-blue-400 print:text-blue-600" 
                  })}
                </div>
                <div>
                  <h3 className="font-medium text-gray-200 print:text-gray-800">{question.question}</h3>
                  <p className={`mt-1 text-sm ${
                    question.status === 'positive' 
                      ? 'text-green-400 print:text-green-700' 
                      : 'text-red-400 print:text-red-700'
                  }`}>
                    {question.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6 print:bg-white print:border-gray-300">
            <h3 className="text-xl font-bold text-gray-100 print:text-black mb-4">Recomendações Principais</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 print:text-gray-700">
              {reportData.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityReport;