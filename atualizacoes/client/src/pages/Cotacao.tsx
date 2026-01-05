import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronRight, ShieldCheck, User, MapPin, Car, Home, Plane, Heart, Stethoscope, Building2, Loader2, Calendar, Settings } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

export default function Cotacao() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    tipoSeguro: "",
    cep: "",
    // Vehicle specific fields
    tipoVeiculo: "",
    anoVeiculo: "",
    marcaVeiculo: "",
    modeloVeiculo: "",
    zeroKm: false,
    placa: "",
    usoComercial: false,
    blindagem: false,
    kitGas: false,
    beneficioFiscal: false,
    motorista1825: false,
    jaTemSeguro: false,
    dataNascimento: "",
    principalMotorista: true,
    nomeMotorista: "",
    dataNascimentoMotorista: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoSeguroSelect = (tipo: string) => {
    setFormData(prev => ({ ...prev, tipoSeguro: tipo }));
  };

  const handleTipoVeiculoSelect = (tipo: string) => {
    setFormData(prev => ({ ...prev, tipoVeiculo: tipo }));
  };

  const handleAnoVeiculoSelect = (ano: string) => {
    setFormData(prev => ({ ...prev, anoVeiculo: ano }));
  };

  const handleMarcaVeiculoSelect = (marca: string) => {
    setFormData(prev => ({ ...prev, marcaVeiculo: marca, modeloVeiculo: "" })); // Reset model when brand changes
    setModelos([]);
  };

  const handleModeloVeiculoSelect = (modelo: string) => {
    setFormData(prev => ({ ...prev, modeloVeiculo: modelo }));
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (step === 5 && formData.tipoVeiculo && marcas.length === 0) {
      fetchMarcas();
    }
  }, [step, formData.tipoVeiculo, marcas.length]);

  const fetchMarcas = async () => {
    setLoadingMarcas(true);
    try {
      const tipo = formData.tipoVeiculo === 'carro' ? 'carros' : 'motos';
      const response = await fetch(`https://fipeapi.appspot.com/api/1/${tipo}/marcas.json`);
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
    } finally {
      setLoadingMarcas(false);
    }
  };

  useEffect(() => {
    if (step === 6 && formData.marcaVeiculo && modelos.length === 0) {
      fetchModelos();
    }
  }, [step, formData.marcaVeiculo, modelos.length]);

  const fetchModelos = async () => {
    setLoadingModelos(true);
    try {
      const tipo = formData.tipoVeiculo === 'carro' ? 'carros' : 'motos';
      const ano = formData.anoVeiculo.split('/')[0] + '-1'; // e.g. 2020-1
      const response = await fetch(`https://fipeapi.appspot.com/api/1/${tipo}/marcas/${formData.marcaVeiculo}/modelos/${ano}.json`);
      const data = await response.json();
      setModelos(data.modelos || []);
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
    } finally {
      setLoadingModelos(false);
    }
  };

  useEffect(() => {
    if (formData.cep.length === 8) {
      fetchEndereco();
    }
  }, [formData.cep]);

  const fetchEndereco = async () => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`);
      } else {
        setEndereco('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      setEndereco('Erro ao buscar endereço');
    }
  };

  const getMaxStep = () => formData.tipoSeguro === 'automovel' ? 9 : 3;

  const nextStep = () => {
    if (step < getMaxStep()) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/enviar-cotacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cotação enviada com sucesso! Verifique seu WhatsApp.");
        // Reset form or redirect
        setStep(1);
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          cpf: "",
          tipoSeguro: "",
          cep: "",
          tipoVeiculo: "",
          anoVeiculo: "",
          marcaVeiculo: "",
          modeloVeiculo: "",
          zeroKm: false,
          placa: "",
          usoComercial: false,
          blindagem: false,
          kitGas: false,
          beneficioFiscal: false,
          motorista1825: false,
          jaTemSeguro: false,
          dataNascimento: "",
          principalMotorista: true,
          nomeMotorista: "",
          dataNascimentoMotorista: ""
        });
      } else {
        toast.error(data.message || "Erro ao enviar cotação. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const tiposSeguro = [
    { id: "automovel", label: "Automóvel", icon: <Car className="w-6 h-6" /> },
    { id: "residencial", label: "Residencial", icon: <Home className="w-6 h-6" /> },
    { id: "viagem", label: "Seguro Viagem", icon: <Plane className="w-6 h-6" /> },
    { id: "vida", label: "Seguro de Vida", icon: <Heart className="w-6 h-6" /> },
    { id: "saude", label: "Saúde", icon: <Stethoscope className="w-6 h-6" /> },
    { id: "empresarial", label: "Empresarial", icon: <Building2 className="w-6 h-6" /> },
  ];

  const getSteps = () => {
    if (formData.tipoSeguro === 'automovel') {
      return [
        { label: "Seus Dados", icon: User },
        { label: "Tipo de Seguro", icon: ShieldCheck },
        { label: "Tipo Veículo", icon: Car },
        { label: "Ano", icon: Calendar },
        { label: "Marca", icon: Car },
        { label: "Modelo", icon: Car },
        { label: "Detalhes", icon: Settings },
        { label: "Localização", icon: MapPin },
        { label: "Motorista", icon: User }
      ];
    } else {
      return [
        { label: "Seus Dados", icon: User },
        { label: "Tipo de Seguro", icon: ShieldCheck },
        { label: "Endereço", icon: MapPin }
      ];
    }
  };

  const steps = getSteps();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12 space-y-4">
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
              Cotação Online Rápida
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto">
              Preencha seus dados para receber propostas personalizadas das melhores seguradoras do mercado.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2 hidden md:block max-w-4xl mx-auto right-0"></div>

            <div className="flex justify-between w-full max-w-4xl">
              {steps.map((stepInfo, index) => {
                const stepNumber = index + 1;
                const IconComponent = stepInfo.icon;
                return (
                  <div key={stepNumber} className={`flex flex-col items-center gap-2 ${step >= stepNumber ? 'text-primary' : 'text-slate-400'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${
                      step >= stepNumber ? 'border-primary text-primary shadow-lg shadow-primary/20' : 'border-slate-200 text-slate-300'
                    }`}>
                      {step > stepNumber ? <Check className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
                    </div>
                    <span className="font-medium text-sm">{stepInfo.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-none shadow-xl shadow-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-12">
              
              {/* Step 1: Seus Dados */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Quem é você?</h2>
                    <p className="text-slate-500">Precisamos te conhecer para personalizar sua oferta.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input 
                        id="nome" 
                        name="nome" 
                        placeholder="Seu nome completo" 
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.nome}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                      <Input 
                        id="telefone" 
                        name="telefone" 
                        placeholder="(00) 00000-0000" 
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.telefone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF ou CNPJ</Label>
                      <Input 
                        id="cpf" 
                        name="cpf" 
                        placeholder="000.000.000-00" 
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.cpf}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Tipo de Seguro */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Qual seguro você precisa?</h2>
                    <p className="text-slate-500">Selecione o tipo de proteção que você está buscando.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tiposSeguro.map((tipo) => (
                      <div 
                        key={tipo.id}
                        onClick={() => handleTipoSeguroSelect(tipo.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 ${
                          formData.tipoSeguro === tipo.id 
                            ? 'border-primary bg-blue-50 text-primary shadow-md' 
                            : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${
                          formData.tipoSeguro === tipo.id ? 'bg-white' : 'bg-slate-100'
                        }`}>
                          {tipo.icon}
                        </div>
                        <span className="font-medium text-sm text-center">{tipo.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Tipo Veículo */}
              {step === 3 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Qual tipo de veículo?</h2>
                    <p className="text-slate-500">Selecione se é carro ou motocicleta.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div
                      onClick={() => handleTipoVeiculoSelect('carro')}
                      className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 ${
                        formData.tipoVeiculo === 'carro'
                          ? 'border-primary bg-blue-50 text-primary shadow-md'
                          : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <Car className="w-8 h-8" />
                      <span className="font-medium">Carro</span>
                    </div>
                    <div
                      onClick={() => handleTipoVeiculoSelect('moto')}
                      className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 ${
                        formData.tipoVeiculo === 'moto'
                          ? 'border-primary bg-blue-50 text-primary shadow-md'
                          : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-4xl">🏍️</div>
                      <span className="font-medium">Motocicleta</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Ano do Veículo */}
              {step === 4 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Ano do veículo</h2>
                    <p className="text-slate-500">Selecione o ano de fabricação/modelo.</p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <Label htmlFor="anoVeiculo">Ano</Label>
                    <Select value={formData.anoVeiculo} onValueChange={handleAnoVeiculoSelect}>
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20">
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          '2026/2027', '2025/2026', '2024/2025', '2023/2024', '2022/2023',
                          '2021/2022', '2020/2021', '2019/2020', '2018/2019', '2017/2018',
                          '2016/2017', '2015/2016', '2014/2015', '2013/2014', '2012/2013',
                          '2011/2012', '2010/2011', '2009/2010', '2008/2009', '2007/2008',
                          '2006/2007', '2005/2006', '2004/2005', '2003/2004', '2002/2003',
                          '2001/2002'
                        ].map((ano) => (
                          <SelectItem key={ano} value={ano}>
                            {ano}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 5: Marca do Veículo */}
              {step === 5 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Marca do veículo</h2>
                    <p className="text-slate-500">Selecione a marca do seu veículo.</p>
                  </div>

                  {loadingMarcas ? (
                    <div className="flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto max-h-96 overflow-y-auto">
                      {marcas.map((marca: any) => (
                        <div
                          key={marca.id}
                          onClick={() => handleMarcaVeiculoSelect(marca.id)}
                          className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200 hover:scale-105 ${
                            formData.marcaVeiculo === marca.id
                              ? 'border-primary bg-blue-50 text-primary shadow-md'
                              : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-medium">{marca.fipe_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 6: Modelo do Veículo */}
              {step === 6 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Modelo do veículo</h2>
                    <p className="text-slate-500">Selecione o modelo do seu veículo.</p>
                  </div>

                  {loadingModelos ? (
                    <div className="flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto max-h-96 overflow-y-auto">
                      {modelos.map((modelo: any) => (
                        <div
                          key={modelo.id}
                          onClick={() => handleModeloVeiculoSelect(modelo.id)}
                          className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200 hover:scale-105 ${
                            formData.modeloVeiculo === modelo.id
                              ? 'border-primary bg-blue-50 text-primary shadow-md'
                              : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-medium">{modelo.fipe_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 7: Detalhes do Veículo */}
              {step === 7 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Detalhes do veículo</h2>
                    <p className="text-slate-500">Forneça mais informações sobre seu veículo.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="zeroKm">O veículo é zero km?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="zeroKm"
                          checked={formData.zeroKm}
                          onCheckedChange={(checked) => handleCheckboxChange('zeroKm', checked)}
                        />
                        <Label htmlFor="zeroKm">{formData.zeroKm ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="placa">Placa do veículo (opcional)</Label>
                      <Input
                        id="placa"
                        name="placa"
                        placeholder="ABC-1234"
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.placa}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>O veículo é para uso comercial?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.usoComercial}
                          onCheckedChange={(checked) => handleCheckboxChange('usoComercial', checked)}
                        />
                        <Label>{formData.usoComercial ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tem blindagem?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.blindagem}
                          onCheckedChange={(checked) => handleCheckboxChange('blindagem', checked)}
                        />
                        <Label>{formData.blindagem ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>É kit gás?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.kitGas}
                          onCheckedChange={(checked) => handleCheckboxChange('kitGas', checked)}
                        />
                        <Label>{formData.kitGas ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Teve benefício fiscal?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.beneficioFiscal}
                          onCheckedChange={(checked) => handleCheckboxChange('beneficioFiscal', checked)}
                        />
                        <Label>{formData.beneficioFiscal ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Localização de Pernoite */}
              {step === 8 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Onde o veículo pernoita?</h2>
                    <p className="text-slate-500">Informe o CEP do local onde o veículo fica guardado.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP de Pernoite</Label>
                      <Input
                        id="cep"
                        name="cep"
                        placeholder="00000-000"
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.cep}
                        onChange={handleInputChange}
                      />
                      {endereco && (
                        <p className="text-sm text-slate-600 mt-2">{endereco}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Informações do Motorista */}
              {step === 9 && formData.tipoSeguro === 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Informações do motorista</h2>
                    <p className="text-slate-500">Responda as perguntas sobre o motorista principal.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <Label>Algum motorista com idade entre 18 e 25 anos mora com você?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.motorista1825}
                          onCheckedChange={(checked) => handleCheckboxChange('motorista1825', checked)}
                        />
                        <Label>{formData.motorista1825 ? 'Sim' : 'Não'}</Label>
                      </div>
                      <p className="text-xs text-slate-500">É necessário informar se houver outra pessoa que dirige o veículo dentro dessa faixa etária, assim seu seguro vai se estender a ela também.</p>
                    </div>

                    <div className="space-y-2">
                      <Label>O veículo já tem seguro?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.jaTemSeguro}
                          onCheckedChange={(checked) => handleCheckboxChange('jaTemSeguro', checked)}
                        />
                        <Label>{formData.jaTemSeguro ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de nascimento</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Você é o principal motorista do veículo?</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.principalMotorista}
                          onCheckedChange={(checked) => handleCheckboxChange('principalMotorista', checked)}
                        />
                        <Label>{formData.principalMotorista ? 'Sim' : 'Não'}</Label>
                      </div>
                    </div>

                    {formData.principalMotorista && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nomeMotorista">Nome do motorista</Label>
                          <Input
                            id="nomeMotorista"
                            name="nomeMotorista"
                            placeholder="Nome completo"
                            className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                            value={formData.nomeMotorista}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dataNascimentoMotorista">Data de nascimento do motorista</Label>
                          <Input
                            id="dataNascimentoMotorista"
                            name="dataNascimentoMotorista"
                            type="date"
                            className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                            value={formData.dataNascimentoMotorista}
                            onChange={handleInputChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Endereço */}
              {step === 3 && formData.tipoSeguro !== 'automovel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-semibold text-slate-800">Onde você mora?</h2>
                    <p className="text-slate-500">A localização influencia no valor do seguro.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP de Pernoite</Label>
                      <Input 
                        id="cep" 
                        name="cep" 
                        placeholder="00000-000" 
                        className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20"
                        value={formData.cep}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                {step > 1 ? (
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={isLoading}
                    className="h-12 px-8 rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Voltar
                  </Button>
                ) : (
                  <div></div>
                )}
                
                <Button
                  onClick={step === getMaxStep() ? handleSubmit : nextStep}
                  disabled={
                    (step === 2 && !formData.tipoSeguro) ||
                    (step === 3 && !formData.tipoVeiculo) ||
                    (step === 4 && !formData.anoVeiculo) ||
                    (step === 5 && !formData.marcaVeiculo) ||
                    (step === 6 && !formData.modeloVeiculo) ||
                    (step === 8 && !formData.cep) ||
                    (step === 9 && !formData.dataNascimento) ||
                    isLoading
                  }
                  className="h-12 px-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      {step === getMaxStep() ? "Finalizar Cotação" : "Avançar"}
                      {step !== getMaxStep() && <ChevronRight className="ml-2 w-4 h-4" />}
                    </>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Site 100% Seguro</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <User className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Atendimento Humano</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Check className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Cotação em 14 Seguradoras</span>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
