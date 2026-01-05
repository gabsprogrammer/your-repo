import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronRight, ShieldCheck, User, MapPin, Car, Home, Plane, Heart, Stethoscope, Building2, Loader2, Search, Bike } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

// Interfaces para tipagem
interface VeiculoData {
  tipo: 'carro' | 'moto' | '';
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  anoModelo: string;
  cor: string;
  combustivel: string;
  zeroKm: boolean;
  usoComercial: boolean;
  kitGas: boolean;
  logoMarca: string;
}

interface MotoristaData {
  cepPernoite: string;
  enderecoResumido: string;
  motoristaJovem: boolean; // 18-25 anos
  veiculoJaSegurado: boolean;
  dataNascimento: string;
  ehPrincipalCondutor: boolean;
  nomePrincipalCondutor: string;
  nascPrincipalCondutor: string;
}

export default function Cotacao() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isConsultingPlaca, setIsConsultingPlaca] = useState(false);
  const [placaConsultada, setPlacaConsultada] = useState(false);
  const [isConsultingCep, setIsConsultingCep] = useState(false);
  
  // Dados Pessoais (Passo 1)
  const [personalData, setPersonalData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  // Tipo de Seguro (Passo 2)
  const [tipoSeguro, setTipoSeguro] = useState("");

  // Dados do Veículo (Passo 3 - Apenas para Auto)
  const [veiculoData, setVeiculoData] = useState<VeiculoData>({
    tipo: '',
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    anoModelo: '',
    cor: '',
    combustivel: '',
    zeroKm: false,
    usoComercial: false,
    kitGas: false,
    logoMarca: ''
  });

  // Dados do Motorista/Localização (Passo 4 - Apenas para Auto)
  const [motoristaData, setMotoristaData] = useState<MotoristaData>({
    cepPernoite: '',
    enderecoResumido: '',
    motoristaJovem: false,
    veiculoJaSegurado: false,
    dataNascimento: '',
    ehPrincipalCondutor: true,
    nomePrincipalCondutor: '',
    nascPrincipalCondutor: ''
  });

  // Lista de anos para select (2027 até 1980)
  const anosFabricacao = Array.from({ length: 48 }, (_, i) => {
    const ano = 2027 - i;
    return `${ano}/${ano + 1}`;
  });

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleVeiculoChange = (field: keyof VeiculoData, value: any) => {
    setVeiculoData(prev => ({ ...prev, [field]: value }));
  };

  const handleMotoristaChange = (field: keyof MotoristaData, value: any) => {
    setMotoristaData(prev => ({ ...prev, [field]: value }));
  };

  // Consulta de Placa
  const consultarPlaca = async () => {
    if (veiculoData.placa.length < 7) {
      toast.error("Digite uma placa válida");
      return;
    }

    setIsConsultingPlaca(true);
    try {
      const response = await fetch(`/api/consultar-placa/${veiculoData.placa}`);
      const data = await response.json();

      if (data && !data.error) {
        // Extrair dados da resposta da API (baseado no puixada.txt)
        const fipeDados = data.fipe?.dados?.[0] || {};
        const extraDados = data.extra || {};
        
        setVeiculoData(prev => ({
          ...prev,
          marca: data.MARCA || data.marca || "",
          modelo: fipeDados.texto_modelo || data.MODELO || "",
          ano: data.ano || "",
          anoModelo: data.ano && data.anoModelo ? `${data.ano}/${data.anoModelo}` : "",
          cor: data.cor || "",
          combustivel: fipeDados.combustivel || extraDados.combustivel || "",
          logoMarca: data.logo || ""
        }));
        setPlacaConsultada(true);
        toast.success("Veículo encontrado!");
      } else {
        toast.error("Veículo não encontrado. Preencha manualmente.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao consultar placa.");
    } finally {
      setIsConsultingPlaca(false);
    }
  };

  // Consulta de CEP
  const consultarCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsConsultingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setMotoristaData(prev => ({ ...prev, enderecoResumido: endereco }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsConsultingCep(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return personalData.nome && personalData.telefone && personalData.cpf;
      case 2:
        return tipoSeguro;
      case 3:
        return veiculoData.placa && veiculoData.tipo && veiculoData.marca && veiculoData.modelo && veiculoData.anoModelo;
      case 4:
        return motoristaData.cepPernoite && motoristaData.dataNascimento;
      default:
        return false;
    }
  };

  const nextStep = () => {
    // Se não for Automóvel, pula do passo 2 direto para envio
    if (step === 2 && tipoSeguro !== 'automovel') {
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Montar payload completo
    const payload = {
      ...personalData,
      tipoSeguro,
      veiculo: tipoSeguro === 'automovel' ? veiculoData : null,
      motorista: tipoSeguro === 'automovel' ? motoristaData : null
    };

    try {
      const response = await fetch('/api/enviar-cotacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Solicitação enviada! Verifique seu WhatsApp.");
        // Reset básico para evitar loop
        setStep(1);
        setPersonalData({ nome: "", email: "", telefone: "", cpf: "" });
        setTipoSeguro("");
      } else {
        toast.error(data.message || "Erro ao enviar.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const tiposSeguroOptions = [
    { id: "automovel", label: "Automóvel", icon: <Car className="w-6 h-6" /> },
    { id: "residencial", label: "Residencial", icon: <Home className="w-6 h-6" /> },
    { id: "viagem", label: "Seguro Viagem", icon: <Plane className="w-6 h-6" /> },
    { id: "vida", label: "Seguro de Vida", icon: <Heart className="w-6 h-6" /> },
    { id: "saude", label: "Saúde", icon: <Stethoscope className="w-6 h-6" /> },
    { id: "empresarial", label: "Empresarial", icon: <Building2 className="w-6 h-6" /> },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
              Cotação Online Inteligente
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto">
              Preencha os dados e receba propostas das 14 melhores seguradoras.
            </p>
          </div>

          {/* Progress Steps (Dinâmico) */}
          <div className="flex justify-center items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2 hidden md:block max-w-2xl mx-auto right-0"></div>
            
            <div className="flex justify-between w-full max-w-2xl">
              {/* Step 1: Dados */}
              <StepIndicator step={1} currentStep={step} icon={<User className="w-6 h-6" />} label="Seus Dados" />
              
              {/* Step 2: Tipo */}
              <StepIndicator step={2} currentStep={step} icon={<ShieldCheck className="w-6 h-6" />} label="Tipo de Seguro" />
              
              {/* Steps Extras apenas para Auto */}
              {tipoSeguro === 'automovel' && (
                <>
                  <StepIndicator step={3} currentStep={step} icon={<Car className="w-6 h-6" />} label="Veículo" />
                  <StepIndicator step={4} currentStep={step} icon={<MapPin className="w-6 h-6" />} label="Perfil" />
                </>
              )}
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-none shadow-xl shadow-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-12">
              
              {/* STEP 1: DADOS PESSOAIS */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-2xl font-heading font-semibold text-slate-800 text-center">Quem é você?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input name="nome" value={personalData.nome} onChange={handlePersonalChange} placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input name="email" type="email" value={personalData.email} onChange={handlePersonalChange} placeholder="seu@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone / WhatsApp</Label>
                      <Input name="telefone" value={personalData.telefone} onChange={handlePersonalChange} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF ou CNPJ</Label>
                      <Input name="cpf" value={personalData.cpf} onChange={handlePersonalChange} placeholder="000.000.000-00" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: TIPO DE SEGURO */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-2xl font-heading font-semibold text-slate-800 text-center">Qual proteção você precisa?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tiposSeguroOptions.map((tipo) => (
                      <div 
                        key={tipo.id}
                        onClick={() => setTipoSeguro(tipo.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 ${
                          tipoSeguro === tipo.id 
                            ? 'border-primary bg-blue-50 text-primary shadow-md' 
                            : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${tipoSeguro === tipo.id ? 'bg-white' : 'bg-slate-100'}`}>
                          {tipo.icon}
                        </div>
                        <span className="font-medium text-sm text-center">{tipo.label}</span>
                      </div>
                    ))}
                  </div>
                  {tipoSeguro && tipoSeguro !== 'automovel' && (
                    <p className="text-center text-slate-500 mt-4 bg-blue-50 p-4 rounded-lg">
                      ℹ️ Para este tipo de seguro, um especialista entrará em contato via WhatsApp para entender melhor sua necessidade.
                    </p>
                  )}
                </div>
              )}

              {/* STEP 3: DADOS DO VEÍCULO (Apenas Auto) */}
              {step === 3 && tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-2xl font-heading font-semibold text-slate-800 text-center">Detalhes do Veículo</h2>
                  
                  {/* Tipo de Veículo */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div 
                      onClick={() => handleVeiculoChange('tipo', 'carro')}
                      className={`cursor-pointer px-6 py-3 rounded-full border-2 flex items-center gap-2 ${veiculoData.tipo === 'carro' ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}
                    >
                      <Car className="w-5 h-5" /> Carro
                    </div>
                    <div 
                      onClick={() => handleVeiculoChange('tipo', 'moto')}
                      className={`cursor-pointer px-6 py-3 rounded-full border-2 flex items-center gap-2 ${veiculoData.tipo === 'moto' ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}
                    >
                      <Bike className="w-5 h-5" /> Moto
                    </div>
                  </div>

                  {/* Consulta Placa */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Placa do Veículo *</Label>
                      <Input
                        value={veiculoData.placa}
                        onChange={(e) => handleVeiculoChange('placa', e.target.value.toUpperCase())}
                        placeholder="ABC1D23"
                        maxLength={7}
                        required
                      />
                    </div>
                    <Button onClick={consultarPlaca} disabled={isConsultingPlaca || !veiculoData.placa} className="mb-0.5">
                      {isConsultingPlaca ? <Loader2 className="animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Dados Automáticos/Manuais - Aparece após consultar placa */}
                  {placaConsultada && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Marca</Label>
                          <Input value={veiculoData.marca} onChange={(e) => handleVeiculoChange('marca', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Modelo</Label>
                          <Input value={veiculoData.modelo} onChange={(e) => handleVeiculoChange('modelo', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Ano Modelo</Label>
                          <Select onValueChange={(v) => handleVeiculoChange('anoModelo', v)} value={veiculoData.anoModelo}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              {anosFabricacao.map(ano => <SelectItem key={ano} value={ano}>{ano}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Cor</Label>
                          <Input value={veiculoData.cor} onChange={(e) => handleVeiculoChange('cor', e.target.value)} />
                        </div>
                      </div>

                      {/* Tipo de Veículo */}
                      <div className="flex justify-center gap-4 mb-6">
                        <div
                          onClick={() => handleVeiculoChange('tipo', 'carro')}
                          className={`cursor-pointer px-6 py-3 rounded-full border-2 flex items-center gap-2 ${veiculoData.tipo === 'carro' ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}
                        >
                          <Car className="w-5 h-5" /> Carro
                        </div>
                        <div
                          onClick={() => handleVeiculoChange('tipo', 'moto')}
                          className={`cursor-pointer px-6 py-3 rounded-full border-2 flex items-center gap-2 ${veiculoData.tipo === 'moto' ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}
                        >
                          <Bike className="w-5 h-5" /> Moto
                        </div>
                      </div>

                      {/* Opções */}
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>É Zero KM?</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={veiculoData.zeroKm ? "default" : "outline"}
                              className={veiculoData.zeroKm ? "bg-green-500 hover:bg-green-600" : ""}
                              onClick={() => handleVeiculoChange('zeroKm', true)}
                            >
                              Sim
                            </Button>
                            <Button
                              type="button"
                              variant={!veiculoData.zeroKm ? "default" : "outline"}
                              className={!veiculoData.zeroKm ? "bg-red-500 hover:bg-red-600" : ""}
                              onClick={() => handleVeiculoChange('zeroKm', false)}
                            >
                              Não
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tipo de uso</Label>
                          <Select onValueChange={(v) => handleVeiculoChange('usoComercial', v === 'comercial')} value={veiculoData.usoComercial ? 'comercial' : 'particular'}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="particular">Particular</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Possui kit gás?</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={veiculoData.kitGas ? "default" : "outline"}
                              className={veiculoData.kitGas ? "bg-green-500 hover:bg-green-600" : ""}
                              onClick={() => handleVeiculoChange('kitGas', true)}
                            >
                              Sim
                            </Button>
                            <Button
                              type="button"
                              variant={!veiculoData.kitGas ? "default" : "outline"}
                              className={!veiculoData.kitGas ? "bg-red-500 hover:bg-red-600" : ""}
                              onClick={() => handleVeiculoChange('kitGas', false)}
                            >
                              Não
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {veiculoData.logoMarca && (
                    <div className="flex justify-center mt-4">
                      <img src={veiculoData.logoMarca} alt="Marca" className="h-16 object-contain opacity-80" />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: PERFIL MOTORISTA (Apenas Auto) */}
              {step === 4 && tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-2xl font-heading font-semibold text-slate-800 text-center">Perfil do Condutor</h2>
                  
                  {/* CEP Pernoite */}
                  <div className="space-y-2">
                    <Label>CEP de Pernoite</Label>
                    <Input 
                      value={motoristaData.cepPernoite} 
                      onChange={(e) => {
                        handleMotoristaChange('cepPernoite', e.target.value);
                        if(e.target.value.length >= 8) consultarCep(e.target.value);
                      }}
                      placeholder="00000-000" 
                    />
                    {isConsultingCep && <span className="text-xs text-blue-500">Buscando endereço...</span>}
                    {motoristaData.enderecoResumido && (
                      <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {motoristaData.enderecoResumido}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 pt-4">
                    <SwitchItem 
                      label="Motorista entre 18 e 25 anos reside com você?" 
                      checked={motoristaData.motoristaJovem} 
                      onChange={(v) => handleMotoristaChange('motoristaJovem', v)} 
                    />
                    
                    <SwitchItem 
                      label="Veículo já possui seguro? (Renovação)" 
                      checked={motoristaData.veiculoJaSegurado} 
                      onChange={(v) => handleMotoristaChange('veiculoJaSegurado', v)} 
                    />

                    <div className="space-y-2">
                      <Label>Sua Data de Nascimento</Label>
                      <Input 
                        type="date" 
                        value={motoristaData.dataNascimento} 
                        onChange={(e) => handleMotoristaChange('dataNascimento', e.target.value)} 
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <SwitchItem 
                        label="Você é o principal condutor?" 
                        checked={motoristaData.ehPrincipalCondutor} 
                        onChange={(v) => handleMotoristaChange('ehPrincipalCondutor', v)} 
                      />
                      
                      {!motoristaData.ehPrincipalCondutor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in">
                          <div className="space-y-2">
                            <Label>Nome do Condutor</Label>
                            <Input 
                              value={motoristaData.nomePrincipalCondutor} 
                              onChange={(e) => handleMotoristaChange('nomePrincipalCondutor', e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Data Nasc. Condutor</Label>
                            <Input 
                              type="date" 
                              value={motoristaData.nascPrincipalCondutor} 
                              onChange={(e) => handleMotoristaChange('nascPrincipalCondutor', e.target.value)} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                {step > 1 ? (
                  <Button variant="outline" onClick={prevStep} disabled={isLoading}>Voltar</Button>
                ) : (
                  <div></div>
                )}
                
                <Button
                  onClick={step === 4 || (step === 2 && tipoSeguro !== 'automovel') ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {step === 4 || (step === 2 && tipoSeguro !== 'automovel') ? "Finalizar Cotação" : "Avançar"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

// Componentes Auxiliares
function StepIndicator({ step, currentStep, icon, label }: { step: number, currentStep: number, icon: React.ReactNode, label: string }) {
  const isActive = currentStep >= step;
  return (
    <div className={`flex flex-col items-center gap-2 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${
        isActive ? 'border-primary text-primary shadow-lg' : 'border-slate-200 text-slate-300'
      }`}>
        {isActive && currentStep > step ? <Check className="w-6 h-6" /> : icon}
      </div>
      <span className="font-medium text-sm hidden md:block">{label}</span>
    </div>
  );
}

function SwitchItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
      <Label className="cursor-pointer flex-1">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
