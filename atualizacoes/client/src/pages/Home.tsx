import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, ThumbsUp, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import PartnersCarousel from "@/components/PartnersCarousel";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-70 pointer-events-none animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-200/10 rounded-full blur-3xl opacity-70 pointer-events-none animate-pulse duration-[7000ms]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/40 rounded-full blur-3xl opacity-30 pointer-events-none animate-spin-slow"></div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Mais de 10 anos de experiência
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-900 leading-[1.1] tracking-tight">
                Segurança que <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  acompanha você
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                A corretora certa para lhe assegurar e estar sempre perto de você. Cuidamos do que é importante para que você viva sem preocupações.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/cotacao">
                  <Button className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 bg-primary hover:bg-primary/90">
                    Cotar Agora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="https://wa.me/5581997012344" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="h-14 px-8 rounded-full text-lg border-slate-200 hover:bg-slate-50 hover:text-primary transition-all">
                    <Phone className="mr-2 w-5 h-5" />
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>14 Seguradoras</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Atendimento Nacional</span>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center animate-in slide-in-from-right-10 duration-1000 fade-in">
              {/* Image Container with Neumorphic/Glassmorphism effect */}
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                <img 
                  src="/images/hero_new.jpg" 
                  alt="Consultor Madureira Seguros" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Card 1 */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Proteção Total</p>
                      <p className="text-slate-900 font-bold">Cobertura Personalizada</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute top-1/2 -left-12 w-32 h-32 bg-primary rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <PartnersCarousel />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Por que escolher a Madureira?
            </h2>
            <p className="text-slate-500 text-lg">
              Combinamos tecnologia e atendimento humano para oferecer a melhor experiência em seguros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: "Agilidade na Cotação",
                desc: "Receba propostas das principais seguradoras em tempo recorde, sem burocracia."
              },
              {
                icon: <ThumbsUp className="w-8 h-8 text-primary" />,
                title: "Personalização Real",
                desc: "Analisamos seu perfil para oferecer coberturas que realmente fazem sentido para você."
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Suporte Completo",
                desc: "Estaremos ao seu lado em todos os momentos, principalmente quando você mais precisar."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-none shadow-lg shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-50/50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            Pronto para proteger o que é seu?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Faça uma cotação agora mesmo e descubra como é fácil ter tranquilidade com a Madureira Seguros.
          </p>
          <Link href="/cotacao">
            <Button className="h-16 px-10 rounded-full text-lg bg-white text-primary hover:bg-blue-50 shadow-2xl transition-all hover:scale-105 font-bold">
              Solicitar Cotação Grátis
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
