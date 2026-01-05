import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "wouter";

const seguradoras = [
  {
    name: "Porto Seguro",
    logo: "/images/porto_seguro.jpg",
    description: "Líder de mercado, reconhecida pela excelência em serviços e ampla rede de benefícios. Oferece assistência residencial completa e descontos em diversos estabelecimentos."
  },
  {
    name: "SulAmérica",
    logo: "/images/sulamerica.jpg",
    description: "Tradição e solidez com mais de 125 anos de história. Especialista em seguro saúde e auto, com foco em gestão de riscos e bem-estar integral."
  },
  {
    name: "Bradesco Seguros",
    logo: "/images/bradesco.jpg",
    description: "Parte de um dos maiores grupos financeiros da América Latina. Destaca-se pela capilaridade e opções flexíveis de coberturas para todos os perfis."
  },
  {
    name: "Allianz",
    logo: "/images/allianz.jpg",
    description: "Gigante global presente em mais de 70 países. Traz inovação e robustez financeira, sendo referência em seguros corporativos e de grandes riscos."
  },
  {
    name: "Tokio Marine",
    logo: "/images/tokio_marine.jpg",
    description: "Seguradora japonesa com forte atuação no Brasil. Conhecida pela agilidade no pagamento de indenizações e produtos modulares de alta qualidade."
  },
  {
    name: "HDI Seguros",
    logo: "/images/hdi.jpg",
    description: "Focada em tecnologia e atendimento humanizado. Seus bate-prontos são referência em rapidez na vistoria e liberação de reparos."
  },
  {
    name: "Liberty Seguros",
    logo: "/images/liberty.jpg",
    description: "Compromisso com a integridade e foco no cliente. Oferece o Clube Liberty com vantagens exclusivas e coberturas diferenciadas para vidros."
  },
  {
    name: "Sompo Seguros",
    logo: "/images/sompo.jpg",
    description: "Excelência japonesa em seguros. Especialista em seguros empresariais e transportes, com soluções personalizadas para nichos específicos."
  },
  {
    name: "Mapfre",
    logo: "/images/mapfre.jpg",
    description: "Multinacional espanhola com forte presença global. Oferece um portfólio completo e programas de fidelidade atrativos para seus segurados."
  },
  {
    name: "Azul Seguros",
    logo: "/images/azul.jpg",
    description: "Pertencente ao grupo Porto Seguro, foca em custo-benefício sem abrir mão da qualidade. Ideal para quem busca proteção essencial com preço justo."
  },
  {
    name: "Suhai Seguradora",
    logo: "/images/suhai.jpg",
    description: "Especialista em furto e roubo. A melhor opção para veículos antigos, modificados ou com alto índice de sinistralidade, com aceitação facilitada."
  },
  {
    name: "Aliro Seguro",
    logo: "/images/aliro.jpg",
    description: "Marca da Liberty Seguros focada em simplicidade. Produtos enxutos e diretos, perfeitos para quem quer proteção descomplicada."
  },
  {
    name: "Darwin Seguros",
    logo: "/images/darwin.png",
    description: "Insurtech inovadora que usa tecnologia e dados para oferecer preços justos baseados no seu comportamento ao volante. 100% digital e ágil."
  }
];

export default function Seguradoras() {
  return (
    <Layout>
      <section className="py-20 min-h-screen bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Nossas Seguradoras Parceiras
            </h1>
            <p className="text-xl text-slate-600">
              Trabalhamos apenas com as melhores do mercado para garantir sua tranquilidade absoluta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seguradoras.map((seguradora, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="h-20 flex items-center justify-center p-2 bg-slate-50 rounded-lg mb-4 group-hover:bg-blue-50 transition-colors">
                    <img 
                      src={seguradora.logo} 
                      alt={seguradora.name} 
                      className="max-h-full max-w-[180px] object-contain mix-blend-multiply"
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    {seguradora.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {seguradora.description}
                  </p>
                  
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
