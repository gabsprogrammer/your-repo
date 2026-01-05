import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Home, Heart, Building2, ArrowRight, ShieldCheck, Wrench, Stethoscope, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function Produtos() {
  return (
    <Layout>
      <section className="py-20 min-h-screen">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Nossas Soluções
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Proteção completa para cada momento da sua vida e do seu negócio.
            </p>
            <Link href="/seguradoras">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all">
                Ver todas as seguradoras parceiras <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* Seguro Auto - Large Card */}
            <Card className="md:col-span-2 row-span-2 border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden relative bg-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:rotate-6 transition-transform">
                  <Car className="w-8 h-8" />
                </div>
                <CardTitle className="text-3xl font-heading font-bold text-slate-900">Seguro Auto</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  Proteção completa contra roubo, colisão e terceiros. Viaje tranquilo com assistência 24h e guincho em todo o Brasil.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-green-500" /> Cobertura compreensiva (Colisão, Incêndio, Roubo)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <Wrench className="w-5 h-5 text-green-500" /> Carro reserva e reparo de vidros
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <Heart className="w-5 h-5 text-green-500" /> Danos a terceiros e passageiros
                  </li>
                </ul>
                <div className="pt-4">
                  <Link href="/cotacao">
                    <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                      Cotar Auto Agora <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Seguro Residencial */}
            <Card className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 group bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-heading font-bold text-slate-900">Seguro Residencial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Mais que proteção contra incêndio e roubo. Conte com serviços emergenciais gratuitos como chaveiro, encanador e eletricista.
                </p>
                <Link href="/cotacao">
                  <Button variant="ghost" className="p-0 text-orange-600 hover:text-orange-700 hover:bg-transparent font-semibold">
                    Saiba mais <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Seguro de Vida */}
            <Card className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 group bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-2 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-heading font-bold text-slate-900">Seguro de Vida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">
                  O maior ato de amor é garantir o futuro de quem você ama. Indenizações para imprevistos e suporte financeiro familiar.
                </p>
                <Link href="/cotacao">
                  <Button variant="ghost" className="p-0 text-red-600 hover:text-red-700 hover:bg-transparent font-semibold">
                    Saiba mais <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Seguro Saúde */}
            <Card className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 group bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-heading font-bold text-slate-900">Seguro Saúde</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Cuide do seu bem mais precioso. Planos de saúde completos com ampla rede credenciada e o melhor custo-benefício.
                </p>
                <Link href="/cotacao">
                  <Button variant="ghost" className="p-0 text-teal-600 hover:text-teal-700 hover:bg-transparent font-semibold">
                    Saiba mais <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Seguro Empresarial - Wide Card */}
            <Card className="md:col-span-3 border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 group bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center p-6 md:p-8 gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                    <Building2 className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-heading font-bold mb-2">Seguro Empresarial</h3>
                  <p className="text-slate-300 max-w-2xl">
                    Blindagem para seu patrimônio. Proteção para estoque, equipamentos e responsabilidade civil para seu negócio não parar.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/cotacao">
                    <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 font-bold">
                      Proteger meu Negócio
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>
    </Layout>
  );
}
