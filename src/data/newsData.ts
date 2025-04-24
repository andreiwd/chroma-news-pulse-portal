
export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
  isBreaking?: boolean;
  isHighlight?: boolean;
  views?: number;
}

const newsData: NewsArticle[] = [
  {
    id: 1,
    title: "Inteligência Artificial revoluciona setor de saúde",
    excerpt: "Nova tecnologia permite diagnósticos mais precisos e tratamentos personalizados",
    content: "Pesquisadores de várias universidades conseguiram desenvolver um novo algoritmo de inteligência artificial que promete revolucionar o diagnóstico médico. O sistema foi testado em mais de 50 hospitais e demonstrou uma taxa de precisão superior a 95% na identificação precoce de doenças. A tecnologia utiliza aprendizado profundo para analisar exames de imagem e dados do paciente, oferecendo recomendações personalizadas de tratamento.",
    category: "tech",
    image: "https://source.unsplash.com/800x400/?artificial-intelligence,health",
    author: "Maria Silva",
    publishedAt: "2024-04-20T08:30:00",
    tags: ["inteligência artificial", "saúde", "tecnologia"],
    isHighlight: true,
    views: 4582
  },
  {
    id: 2,
    title: "Brasil conquista medalha de ouro em competição internacional",
    excerpt: "Seleção brasileira supera adversários e garante primeiro lugar no pódio",
    content: "A seleção brasileira conquistou a medalha de ouro no campeonato mundial após uma vitória impressionante na final contra a equipe favorita. Os atletas brasileiros demonstraram determinação e técnica superiores, estabelecendo um novo recorde na competição. Esta é a terceira vez consecutiva que o Brasil alcança o lugar mais alto do pódio neste torneio.",
    category: "sports",
    image: "https://source.unsplash.com/800x400/?olympics,medal",
    author: "João Oliveira",
    publishedAt: "2024-04-21T15:45:00",
    tags: ["esportes", "olimpíadas", "medalha de ouro"],
    isBreaking: true,
    views: 8934
  },
  {
    id: 3,
    title: "Senado aprova nova reforma econômica",
    excerpt: "Medidas prometem impulsionar crescimento e geração de empregos",
    content: "Em sessão extraordinária, o Senado Federal aprovou um pacote de reformas econômicas que visa estimular o crescimento do país e gerar novos postos de trabalho. Entre as medidas aprovadas estão a simplificação tributária para pequenas empresas e incentivos fiscais para setores estratégicos. Economistas estimam que as mudanças possam aumentar o PIB em até 2% nos próximos anos.",
    category: "politics",
    image: "https://source.unsplash.com/800x400/?senate,politics",
    author: "Ana Rodrigues",
    publishedAt: "2024-04-19T11:20:00",
    tags: ["política", "economia", "reforma"],
    views: 3254
  },
  {
    id: 4,
    title: "Mercado financeiro bate recorde histórico",
    excerpt: "Índices econômicos atingem maior patamar dos últimos 10 anos",
    content: "O principal índice da bolsa de valores alcançou hoje seu maior valor histórico, superando a marca anterior estabelecida há uma década. Analistas atribuem o desempenho excepcional à combinação de resultados positivos das maiores empresas do país e ao cenário internacional favorável. Investidores estão otimistas quanto às perspectivas para o restante do ano.",
    category: "economy",
    image: "https://source.unsplash.com/800x400/?stockmarket,finance",
    author: "Ricardo Mendes",
    publishedAt: "2024-04-22T09:15:00",
    tags: ["economia", "mercado financeiro", "investimentos"],
    views: 5621
  },
  {
    id: 5,
    title: "Novo filme quebra recordes de bilheteria",
    excerpt: "Produção nacional supera expectativas e conquista público internacional",
    content: "O mais recente lançamento do cinema nacional estabeleceu um novo recorde de bilheteria ao arrecadar mais de R$ 50 milhões em seu fim de semana de estreia. O longa, que aborda temas da cultura brasileira com uma perspectiva contemporânea, também tem recebido críticas positivas no exterior e já garantiu distribuição em mais de 30 países.",
    category: "entertainment",
    image: "https://source.unsplash.com/800x400/?movie,cinema",
    author: "Carolina Ferreira",
    publishedAt: "2024-04-20T18:30:00",
    tags: ["cinema", "entretenimento", "cultura"],
    isHighlight: true,
    views: 7832
  },
  {
    id: 6,
    title: "Descoberta arqueológica revela civilização desconhecida",
    excerpt: "Pesquisadores encontram ruínas de antiga cidade com tecnologia avançada",
    content: "Uma equipe internacional de arqueólogos descobriu os restos de uma civilização até então desconhecida, que existiu há aproximadamente 12.000 anos. As ruínas revelam uma sociedade com conhecimentos avançados de engenharia e astronomia, desafiando teorias existentes sobre o desenvolvimento humano. Artefatos encontrados no local sugerem que esta civilização pode ter influenciado outras culturas antigas.",
    category: "science",
    image: "https://source.unsplash.com/800x400/?archaeology,ruins",
    author: "Paulo Santos",
    publishedAt: "2024-04-18T14:10:00",
    tags: ["arqueologia", "história", "ciência"],
    views: 4128
  },
  {
    id: 7,
    title: "Conferência climática define novas metas para redução de carbono",
    excerpt: "Países concordam em implementar medidas mais rigorosas contra aquecimento global",
    content: "Representantes de 195 países reunidos na Conferência do Clima chegaram a um acordo histórico para reduzir as emissões de carbono em 50% até 2035. O pacto inclui mecanismos de financiamento para apoiar nações em desenvolvimento na transição para energias limpas e estabelece penalidades para países que não cumprirem as metas estabelecidas.",
    category: "environment",
    image: "https://source.unsplash.com/800x400/?climate,conference",
    author: "Mariana Costa",
    publishedAt: "2024-04-17T16:45:00",
    tags: ["meio ambiente", "clima", "sustentabilidade"],
    isHighlight: true,
    views: 3987
  },
  {
    id: 8,
    title: "Estudo revela benefícios inesperados de nova dieta",
    excerpt: "Pesquisadores descobrem que padrão alimentar pode fortalecer o sistema imunológico",
    content: "Uma pesquisa conduzida por cientistas da Universidade Federal revelou que uma nova abordagem dietética não apenas ajuda na perda de peso, mas também fortalece significativamente o sistema imunológico. O estudo acompanhou 500 participantes por dois anos e constatou uma redução de 60% nas infecções comuns entre aqueles que seguiram o novo padrão alimentar, rico em alimentos fermentados e compostos antioxidantes.",
    category: "health",
    image: "https://source.unsplash.com/800x400/?diet,healthy-food",
    author: "Beatriz Lopes",
    publishedAt: "2024-04-19T10:30:00",
    tags: ["saúde", "alimentação", "imunidade"],
    views: 6523
  },
  {
    id: 9,
    title: "Empresa brasileira de tecnologia recebe investimento bilionário",
    excerpt: "Startup nacional atrai atenção de investidores internacionais com solução inovadora",
    content: "Uma startup brasileira especializada em soluções de inteligência artificial para o agronegócio recebeu um aporte de US$ 1,5 bilhão de um grupo de investidores liderado por um dos maiores fundos de venture capital do mundo. Este é o maior investimento já recebido por uma empresa de tecnologia na América Latina e coloca a startup na lista das 'unicórnios' globais.",
    category: "tech",
    image: "https://source.unsplash.com/800x400/?startup,technology",
    author: "Fernando Gomes",
    publishedAt: "2024-04-21T08:50:00",
    tags: ["tecnologia", "startups", "investimentos"],
    views: 5183
  },
  {
    id: 10,
    title: "Equipe feminina quebra recordes em campeonato mundial",
    excerpt: "Atletas brasileiras superam marcas históricas e consolidam liderança",
    content: "A equipe feminina brasileira estabeleceu três novos recordes mundiais durante sua participação no campeonato internacional realizado este fim de semana. As atletas demonstraram performance excepcional em todas as categorias, garantindo a liderança no quadro geral de medalhas. O desempenho histórico reposiciona o Brasil como uma potência emergente na modalidade.",
    category: "sports",
    image: "https://source.unsplash.com/800x400/?women,sports",
    author: "Camila Alves",
    publishedAt: "2024-04-22T14:15:00",
    tags: ["esportes", "mulheres", "recordes"],
    isBreaking: true,
    views: 7241
  },
  {
    id: 11,
    title: "Nova lei de proteção ambiental divide opinião de especialistas",
    excerpt: "Legislação aprovada gera debate sobre equilíbrio entre desenvolvimento e conservação",
    content: "A nova legislação ambiental aprovada ontem tem dividido opiniões entre especialistas e organizações do setor. Enquanto alguns defendem que as medidas trazem maior equilíbrio entre desenvolvimento econômico e proteção da natureza, críticos argumentam que as flexibilizações podem comprometer áreas sensíveis. A lei entrará em vigor em 90 dias e prevê uma revisão de seus impactos após dois anos.",
    category: "politics",
    image: "https://source.unsplash.com/800x400/?environment,law",
    author: "Roberto Souza",
    publishedAt: "2024-04-18T17:20:00",
    tags: ["política", "meio ambiente", "legislação"],
    views: 2875
  },
  {
    id: 12,
    title: "Economistas alertam para riscos de nova bolha financeira",
    excerpt: "Especialistas apontam semelhanças com padrões que precederam crises anteriores",
    content: "Um grupo de renomados economistas publicou um estudo alertando para sinais que podem indicar a formação de uma nova bolha financeira nos mercados globais. O documento aponta semelhanças preocupantes com os padrões observados antes das crises de 2008 e 2000, incluindo valorização excessiva de ativos tecnológicos e alavancagem elevada. Os especialistas recomendam maior cautela aos investidores nos próximos meses.",
    category: "economy",
    image: "https://source.unsplash.com/800x400/?financial-crisis,economy",
    author: "Luciana Cardoso",
    publishedAt: "2024-04-17T09:45:00",
    tags: ["economia", "mercado financeiro", "crise"],
    isHighlight: true,
    views: 8937
  },
  {
    id: 13,
    title: "Festival de música anuncia lineup com estrelas internacionais",
    excerpt: "Evento promete reunir grandes nomes da música mundial em edição especial",
    content: "Os organizadores do maior festival de música do país anunciaram hoje o lineup completo do evento, que contará com a participação de várias estrelas internacionais em sua edição comemorativa de 20 anos. Entre as atrações confirmadas estão três bandas que nunca se apresentaram no Brasil e o retorno de um ícone da música pop após uma década afastado dos palcos. A venda de ingressos começa na próxima semana.",
    category: "entertainment",
    image: "https://source.unsplash.com/800x400/?music-festival,concert",
    author: "Diego Lima",
    publishedAt: "2024-04-20T16:30:00",
    tags: ["música", "festival", "entretenimento"],
    views: 9124
  },
  {
    id: 14,
    title: "Missão espacial privada atinge marco histórico",
    excerpt: "Empresa consegue pousar veículo não tripulado em lua de Júpiter",
    content: "Uma empresa privada de exploração espacial conseguiu pousar com sucesso uma sonda não tripulada em uma das luas de Júpiter, estabelecendo um marco histórico na exploração do sistema solar. Esta é a primeira vez que uma organização não-governamental alcança um corpo celeste tão distante. A sonda já começou a transmitir dados e imagens que podem trazer novas informações sobre a possibilidade de vida fora da Terra.",
    category: "science",
    image: "https://source.unsplash.com/800x400/?space,jupiter",
    author: "Rafael Torres",
    publishedAt: "2024-04-19T07:50:00",
    tags: ["espaço", "ciência", "exploração"],
    isBreaking: true,
    views: 6782
  },
  {
    id: 15,
    title: "Relatório alerta para aceleração do degelo nos polos",
    excerpt: "Dados mostram que derretimento de geleiras está ocorrendo em ritmo sem precedentes",
    content: "Um relatório publicado por uma coalizão internacional de cientistas revela que o derretimento das calotas polares está ocorrendo 60% mais rápido do que as previsões mais pessimistas indicavam há cinco anos. As novas medições, realizadas com tecnologia de satélite de alta precisão, sugerem que o aumento do nível dos oceanos pode ser mais severo e rápido do que o anteriormente estimado, afetando centenas de milhões de pessoas em zonas costeiras nas próximas décadas.",
    category: "environment",
    image: "https://source.unsplash.com/800x400/?arctic,melting-ice",
    author: "Carla Martins",
    publishedAt: "2024-04-18T13:15:00",
    tags: ["meio ambiente", "clima", "aquecimento global"],
    views: 4571
  },
  {
    id: 16,
    title: "Novo tratamento contra câncer mostra resultados promissores",
    excerpt: "Terapia experimental apresenta taxa de remissão de 70% em casos avançados",
    content: "Um tratamento experimental contra câncer desenvolvido por cientistas brasileiros tem mostrado resultados extraordinários em testes clínicos iniciais. A nova terapia, que combina imunoterapia com uma abordagem genética personalizada, conseguiu uma taxa de remissão de 70% em pacientes com casos avançados que não respondiam mais aos tratamentos convencionais. Os pesquisadores aguardam aprovação para expandir os testes para um grupo maior de pacientes.",
    category: "health",
    image: "https://source.unsplash.com/800x400/?cancer-research,medicine",
    author: "Amanda Rocha",
    publishedAt: "2024-04-21T11:40:00",
    tags: ["saúde", "câncer", "pesquisa médica"],
    isHighlight: true,
    views: 7845
  },
  {
    id: 17,
    title: "Empresa lança smartphone com bateria revolucionária",
    excerpt: "Novo aparelho promete autonomia de uma semana com uma única carga",
    content: "Uma grande fabricante de eletrônicos anunciou hoje o lançamento de um smartphone equipado com uma tecnologia de bateria revolucionária, capaz de manter o aparelho funcionando por até uma semana com uma única carga. A nova bateria utiliza um composto desenvolvido com grafeno e outros nanomateriais, oferecendo não apenas maior duração, mas também carregamento completo em menos de 15 minutos. O dispositivo chegará ao mercado brasileiro no próximo mês.",
    category: "tech",
    image: "https://source.unsplash.com/800x400/?smartphone,technology",
    author: "Henrique Oliveira",
    publishedAt: "2024-04-22T10:30:00",
    tags: ["tecnologia", "smartphones", "inovação"],
    isBreaking: true,
    views: 8934
  },
  {
    id: 18,
    title: "Atleta quebra recorde mundial após superar lesão grave",
    excerpt: "Esportista retorna às competições com performance histórica",
    content: "Um ano após sofrer uma lesão que ameaçou encerrar sua carreira, o atleta brasileiro retornou às competições e quebrou o recorde mundial que estava imbatível há duas décadas. A recuperação surpreendente é creditada a um tratamento inovador desenvolvido por uma equipe multidisciplinar de médicos esportivos e fisioterapeutas. Sua história de superação já está sendo adaptada para um documentário.",
    category: "sports",
    image: "https://source.unsplash.com/800x400/?athlete,record",
    author: "Gustavo Ramos",
    publishedAt: "2024-04-17T18:20:00",
    tags: ["esportes", "superação", "recorde mundial"],
    views: 6127
  },
  {
    id: 19,
    title: "Debates sobre reforma constitucional ganham força no Congresso",
    excerpt: "Parlamentares discutem possibilidade de mudanças em pontos controversos da Constituição",
    content: "O Congresso Nacional iniciou uma série de audiências públicas para discutir uma possível reforma em pontos específicos da Constituição Federal. Entre os temas em debate estão o sistema eleitoral, a organização dos poderes e questões tributárias. Especialistas em direito constitucional foram convidados a apresentar análises e recomendações sobre os impactos das mudanças propostas na sociedade brasileira.",
    category: "politics",
    image: "https://source.unsplash.com/800x400/?congress,constitution",
    author: "Marcelo Vieira",
    publishedAt: "2024-04-19T15:10:00",
    tags: ["política", "constituição", "reforma"],
    views: 3698
  },
  {
    id: 20,
    title: "Banco Central adota medidas para conter inflação",
    excerpt: "Autoridade monetária eleva taxa de juros em resposta a pressões inflacionárias",
    content: "O Banco Central anunciou hoje um aumento de 0,75 ponto percentual na taxa básica de juros, em uma decisão unânime do comitê de política monetária. A medida, mais agressiva do que esperava o mercado, visa conter pressões inflacionárias que têm se intensificado nos últimos meses. Em comunicado, a autoridade monetária sinalizou que novos ajustes podem ser necessários caso as expectativas de inflação continuem acima da meta estabelecida.",
    category: "economy",
    image: "https://source.unsplash.com/800x400/?central-bank,finance",
    author: "Renata Castro",
    publishedAt: "2024-04-20T19:45:00",
    tags: ["economia", "inflação", "juros"],
    views: 5283
  },
  {
    id: 21,
    title: "Série de streaming brasileira conquista prêmio internacional",
    excerpt: "Produção nacional é reconhecida em uma das principais premiações da indústria",
    content: "Uma série brasileira produzida por uma plataforma de streaming foi premiada em uma das mais prestigiadas cerimônias do setor audiovisual mundial. A produção, que aborda tensões sociais em uma grande metrópole brasileira, recebeu elogios pela direção, roteiro e atuações. Este é o maior reconhecimento internacional alcançado por uma série produzida no Brasil e deve abrir caminho para novas produções nacionais no mercado global.",
    category: "entertainment",
    image: "https://source.unsplash.com/800x400/?streaming,series",
    author: "Juliana Peixoto",
    publishedAt: "2024-04-18T22:30:00",
    tags: ["entretenimento", "streaming", "premiação"],
    views: 7428
  },
  {
    id: 22,
    title: "Cientistas identificam novo método para captura de carbono",
    excerpt: "Técnica promete reduzir custo e aumentar eficiência no combate às mudanças climáticas",
    content: "Pesquisadores de uma universidade brasileira desenvolveram um novo método para captura e armazenamento de carbono que pode reduzir significativamente os custos e aumentar a eficiência desta tecnologia crucial para combater as mudanças climáticas. O processo utiliza materiais abundantes e de baixo custo, e já atraiu o interesse de indústrias com alto volume de emissões. Os testes em escala industrial devem começar nos próximos meses.",
    category: "science",
    image: "https://source.unsplash.com/800x400/?carbon-capture,climate",
    author: "Eduardo Martins",
    publishedAt: "2024-04-21T12:20:00",
    tags: ["ciência", "clima", "tecnologia verde"],
    isHighlight: true,
    views: 5124
  },
  {
    id: 23,
    title: "Desmatamento na Amazônia registra menor taxa em 5 anos",
    excerpt: "Dados de satélite mostram redução significativa na perda de cobertura florestal",
    content: "O monitoramento por satélite da Amazônia brasileira registrou a menor taxa de desmatamento dos últimos cinco anos no primeiro trimestre de 2024. A redução de 42% em comparação com o mesmo período do ano anterior é atribuída ao aumento da fiscalização, novas políticas de preservação e maior cooperação internacional. Especialistas alertam, entretanto, que é necessário manter os esforços para consolidar esta tendência positiva.",
    category: "environment",
    image: "https://source.unsplash.com/800x400/?amazon,forest",
    author: "Patrícia Lima",
    publishedAt: "2024-04-17T10:40:00",
    tags: ["meio ambiente", "Amazônia", "desmatamento"],
    views: 4867
  },
  {
    id: 24,
    title: "Estudo relaciona qualidade do sono a menor risco de doenças crônicas",
    excerpt: "Pesquisa acompanhou mais de 10 mil pessoas por uma década",
    content: "Uma pesquisa de longo prazo que acompanhou mais de 10 mil pessoas ao longo de uma década estabeleceu uma forte correlação entre a qualidade do sono e a redução no risco de desenvolvimento de doenças crônicas como diabetes, hipertensão e condições cardíacas. O estudo demonstrou que indivíduos com padrões consistentes de sono de qualidade apresentaram um risco até 37% menor de desenvolver estas condições, independentemente de outros fatores de estilo de vida.",
    category: "health",
    image: "https://source.unsplash.com/800x400/?sleep,health",
    author: "Cristina Nunes",
    publishedAt: "2024-04-19T08:15:00",
    tags: ["saúde", "sono", "doenças crônicas"],
    views: 6734
  },
  {
    id: 25,
    title: "Nova tecnologia permite carros elétricos recargarem em 5 minutos",
    excerpt: "Inovação remove um dos principais obstáculos à adoção em massa de veículos elétricos",
    content: "Uma empresa de tecnologia anunciou o desenvolvimento de um sistema de carregamento ultrarrápido capaz de recarregar completamente a bateria de um carro elétrico em apenas cinco minutos. A tecnologia, que utiliza novos materiais condutores e um sistema avançado de refrigeração, promete eliminar uma das principais barreiras para a adoção em massa de veículos elétricos. Os primeiros postos de carregamento com a nova tecnologia devem ser instalados em rodovias estratégicas ainda este ano.",
    category: "tech",
    image: "https://source.unsplash.com/800x400/?electric-car,charging",
    author: "Leonardo Ribeiro",
    publishedAt: "2024-04-22T09:30:00",
    tags: ["tecnologia", "carros elétricos", "sustentabilidade"],
    isBreaking: true,
    views: 9351
  }
];

export default newsData;
