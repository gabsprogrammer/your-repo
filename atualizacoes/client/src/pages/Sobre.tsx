import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Trophy, HeartHandshake } from "lucide-react";

export default function Sobre() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Sobre Nós
            </h1>
            <p className="text-xl text-slate-600">
              Conheça a história e os valores que fazem da Madureira Seguros a escolha certa para sua proteção.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div className="relative animate-in slide-in-from-left-10 duration-1000 fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="/images/sobre_nos.png" 
                  alt="Equipe Madureira Seguros" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="font-heading font-bold text-2xl">Parceria e Confiança</p>
                  <p className="text-white/90">Desde o primeiro aperto de mão.</p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-semibold uppercase">Excelência</p>
                    <p className="text-slate-900 font-bold text-lg">Premiada</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-1000 fade-in delay-200">
              <div className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-primary">
                  CONOSCO VOCÊ TEM APOIO TOTAL
                </h2>
                
                <div className="prose prose-lg text-slate-600">
                  <p>
                    Desejamos que você tenha uma experiência totalmente verdadeira e diferenciada ao contratar seu seguro conosco.
                  </p>
                  <p>
                    Com isso estamos prontos para lhe oferecer um atendimento personalizado, rápido, transparente e um seguro sob medida para você.
                  </p>
                  <p>
                    A qualificação das operações e a filosofia de trabalho se refletem no crescimento contínuo do volume de serviços prestados por nós, nos suportes 24h/7 e no aumento da produção e do número de clientes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  "Atendimento 24h/7",
                  "Suporte Personalizado",
                  "Transparência Total",
                  "Crescimento Contínuo"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg shadow-slate-100 hover:-translate-y-2 transition-all duration-300 bg-slate-50">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-4">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900">Compromisso</h3>
                <p className="text-slate-500">
                  Nosso compromisso é com a sua tranquilidade. Trabalhamos incansavelmente para garantir que você esteja sempre protegido.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-100 hover:-translate-y-2 transition-all duration-300 bg-slate-50">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900">Proximidade</h3>
                <p className="text-slate-500">
                  Acreditamos em relacionamentos duradouros. Conhecemos cada cliente pelo nome e entendemos suas necessidades únicas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-100 hover:-translate-y-2 transition-all duration-300 bg-slate-50">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-4">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900">Excelência</h3>
                <p className="text-slate-500">
                  Buscamos a excelência em cada detalhe, desde a cotação até o suporte no momento do sinistro.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
