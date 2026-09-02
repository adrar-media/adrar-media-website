import type { Locale } from "@/config/i18n";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface LocalizedArticle {
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  intro: string;
  sections: ArticleSection[];
  takeaways: string[];
}

export interface EditorialArticle {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  content: Record<Locale, LocalizedArticle>;
}

/**
 * Articles pédagogiques rédigés à partir de la méthode de travail de l'agence.
 * Ils n'emploient ni statistique externe ni promesse de performance : chaque
 * recommandation peut être vérifiée et appliquée sans transformer une opinion
 * en résultat garanti.
 */
export const articles: EditorialArticle[] = [
  {
    slug: "plan-marketing-local-maroc",
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    readingMinutes: 6,
    content: {
      fr: {
        title: "Construire un plan marketing local au Maroc sans disperser son budget",
        excerpt:
          "Une méthode concrète pour relier objectif commercial, audience locale, message, canaux et mesure avant de produire le premier contenu.",
        metaDescription:
          "Découvrez une méthode claire pour bâtir un plan marketing local au Maroc : objectif, audience, message, canaux, calendrier et indicateurs utiles.",
        category: "Stratégie marketing",
        intro:
          "Un plan marketing local n'est pas une liste de publications. C'est une suite de décisions qui relie un objectif commercial à des actions mesurables, avec les moyens réellement disponibles.",
        sections: [
          {
            heading: "Commencer par une décision commerciale",
            paragraphs: [
              "Avant de choisir Instagram, Google ou une affiche, formulez le résultat attendu en une phrase : obtenir des demandes de devis, remplir une période creuse, lancer une nouvelle offre ou faire revenir des clients existants. Un seul objectif principal rend les arbitrages plus simples.",
              "Ajoutez ensuite une contrainte réelle : zone géographique, capacité de traitement, disponibilité de l'équipe et budget. Une campagne qui génère plus de demandes que l'entreprise ne peut en traiter abîme l'expérience au lieu de créer de la croissance.",
            ],
          },
          {
            heading: "Décrire l'audience avec des situations, pas des étiquettes",
            paragraphs: [
              "Une audience utile ne se résume pas à un âge. Décrivez le moment où la personne cherche une solution, ce qu'elle compare, la preuve dont elle a besoin et ce qui peut la faire hésiter. Cette description guide le contenu bien mieux qu'un profil démographique vague.",
              "Pour une activité locale, la proximité compte aussi : ville, rayon de déplacement, langue de préférence, habitudes de contact et repères connus. Le français, la darija et l'arabe ne jouent pas toujours le même rôle selon le canal et la situation.",
            ],
          },
          {
            heading: "Donner un rôle précis à chaque canal",
            paragraphs: [
              "Le site explique l'offre et rassure. Google capte une intention déjà présente. Les réseaux sociaux entretiennent la familiarité et montrent le travail. WhatsApp accélère la conversation. Utiliser chaque canal pour sa force évite de demander à une publication de faire tout le parcours seule.",
              "Construisez un chemin court : un message clair, une preuve pertinente et une action unique. Le visiteur doit savoir quoi faire ensuite sans chercher un numéro, deviner un prix ou comprendre une navigation complexe.",
            ],
          },
          {
            heading: "Mesurer ce qui aide à décider",
            paragraphs: [
              "Choisissez peu d'indicateurs : demandes qualifiées, appels, rendez-vous, coût par demande lorsque la publicité est active, et origine du contact. Les vues et les abonnés restent utiles pour comprendre la diffusion, mais ne remplacent pas une mesure commerciale.",
              "Prévoyez une revue régulière : ce qui a été publié, ce qui a été vu, ce qui a déclenché une conversation et ce qui doit changer. La mesure sert à améliorer la décision suivante, pas à remplir un rapport.",
            ],
          },
        ],
        takeaways: [
          "Un objectif commercial principal avant le choix des canaux",
          "Une audience décrite par ses situations et ses objections",
          "Un rôle distinct pour le site, la recherche, les réseaux et la messagerie",
          "Des indicateurs reliés aux conversations et aux demandes réelles",
        ],
      },
      en: {
        title: "How to build a focused local marketing plan in Morocco",
        excerpt:
          "A practical way to connect a commercial objective, local audience, message, channels and measurement before producing content.",
        metaDescription:
          "Build a focused local marketing plan in Morocco with a clear objective, audience, message, channel roles, calendar and decision-ready metrics.",
        category: "Marketing strategy",
        intro:
          "A local marketing plan is not a posting schedule. It is a sequence of decisions connecting a commercial objective to measurable action within the resources the business actually has.",
        sections: [
          {
            heading: "Start with one commercial decision",
            paragraphs: [
              "Before choosing Instagram, Google or outdoor media, state the expected result in one sentence: generate quote requests, fill a quiet period, launch an offer or bring existing customers back. One primary objective makes trade-offs easier.",
              "Add the real constraints: service area, delivery capacity, team availability and budget. A campaign that creates more demand than the business can handle harms the experience instead of creating growth.",
            ],
          },
          {
            heading: "Describe situations, not demographic labels",
            paragraphs: [
              "A useful audience is more than an age bracket. Describe when people look for a solution, what they compare, what proof they need and what makes them hesitate. That picture guides content better than a vague persona.",
              "For a local business, proximity also matters: city, travel radius, preferred language, contact habits and familiar landmarks. French, Darija and Arabic may play different roles depending on the channel and the moment.",
            ],
          },
          {
            heading: "Give each channel one clear job",
            paragraphs: [
              "The website explains and reassures. Google captures existing intent. Social media builds familiarity and shows the work. WhatsApp shortens the conversation. Using each channel for its strength prevents one post from carrying the entire journey.",
              "Build a short path: one message, one relevant proof point and one clear action. Visitors should know what to do next without hunting for a number or decoding the navigation.",
            ],
          },
          {
            heading: "Measure what improves the next decision",
            paragraphs: [
              "Use a small set of metrics: qualified enquiries, calls, appointments, cost per enquiry when paid media is active, and contact source. Views and followers explain distribution but do not replace commercial measurement.",
              "Review what was published, what was seen, what started a conversation and what should change. Measurement should improve the next decision, not merely fill a report.",
            ],
          },
        ],
        takeaways: [
          "One primary commercial objective before channel selection",
          "An audience described through situations and objections",
          "Distinct jobs for the website, search, social and messaging",
          "Metrics connected to real conversations and enquiries",
        ],
      },
      ar: {
        title: "كيف تبني خطة تسويق محلي مركزة في المغرب",
        excerpt:
          "طريقة عملية تربط الهدف التجاري والجمهور المحلي والرسالة والقنوات والقياس قبل إنتاج أول محتوى.",
        metaDescription:
          "منهج واضح لبناء خطة تسويق محلي في المغرب: هدف تجاري، جمهور، رسالة، أدوار القنوات، تقويم ومؤشرات تساعد على اتخاذ القرار.",
        category: "الاستراتيجية التسويقية",
        intro:
          "خطة التسويق المحلي ليست جدول منشورات، بل سلسلة قرارات تربط هدفًا تجاريًا بأعمال قابلة للقياس ضمن الموارد المتاحة فعلًا.",
        sections: [
          {
            heading: "ابدأ بقرار تجاري واحد",
            paragraphs: [
              "قبل اختيار إنستغرام أو غوغل أو الإعلانات الخارجية، حدّد النتيجة المنتظرة في جملة واحدة: طلبات عروض أسعار، تنشيط فترة هادئة، إطلاق عرض جديد أو إعادة العملاء الحاليين. الهدف الرئيسي الواحد يجعل الاختيارات أوضح.",
              "أضف القيود الحقيقية: منطقة الخدمة، القدرة على تلبية الطلبات، وقت الفريق والميزانية. فالحملة التي تولد طلبًا يفوق قدرة المؤسسة قد تضر بالتجربة بدل أن تصنع النمو.",
            ],
          },
          {
            heading: "صف المواقف بدل الاكتفاء بالخصائص الديموغرافية",
            paragraphs: [
              "الجمهور المفيد ليس فئة عمرية فقط. صف اللحظة التي يبحث فيها الشخص عن حل، وما يقارنه، والدليل الذي يحتاجه، وما الذي يجعله يتردد. هذا الوصف يوجّه المحتوى أفضل من شخصية عامة وغامضة.",
              "في النشاط المحلي تهم أيضًا المدينة ونطاق التنقل واللغة المفضلة وعادات التواصل والمعالم المعروفة. قد تختلف وظيفة الفرنسية والدارجة والعربية بحسب القناة والموقف.",
            ],
          },
          {
            heading: "امنح كل قناة وظيفة واضحة",
            paragraphs: [
              "يشرح الموقع العرض ويبني الثقة. يلتقط غوغل نية البحث الموجودة. تصنع الشبكات الاجتماعية الألفة وتعرض العمل. ويختصر واتساب طريق المحادثة. هكذا لا نطلب من منشور واحد أن يقوم بكل شيء.",
              "ابنِ مسارًا قصيرًا: رسالة واحدة، ودليل مناسب، وخطوة تالية واضحة. يجب أن يعرف الزائر ماذا يفعل دون البحث عن رقم أو تفكيك قائمة معقدة.",
            ],
          },
          {
            heading: "قس ما يحسن القرار التالي",
            paragraphs: [
              "اختر مؤشرات قليلة: الطلبات المؤهلة، المكالمات، المواعيد، تكلفة الطلب عند تشغيل الإعلانات، ومصدر التواصل. تساعد المشاهدات والمتابعون على فهم الانتشار، لكنها لا تعوض القياس التجاري.",
              "راجع ما نُشر وما شوهد وما بدأ محادثة وما ينبغي تغييره. وظيفة القياس هي تحسين القرار التالي، لا ملء تقرير.",
            ],
          },
        ],
        takeaways: [
          "هدف تجاري رئيسي قبل اختيار القنوات",
          "جمهور موصوف بمواقفه واعتراضاته",
          "وظيفة مستقلة للموقع والبحث والشبكات والمراسلة",
          "مؤشرات مرتبطة بالمحادثات والطلبات الحقيقية",
        ],
      },
    },
  },
  {
    slug: "calendrier-contenu-social-media",
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    readingMinutes: 5,
    content: {
      fr: {
        title: "Créer un calendrier social media que votre équipe peut vraiment tenir",
        excerpt:
          "Des piliers éditoriaux au circuit de validation : une organisation simple pour publier avec régularité sans sacrifier la qualité.",
        metaDescription:
          "Apprenez à créer un calendrier social media réaliste : piliers éditoriaux, formats, production, validation, réutilisation et mesure au Maroc.",
        category: "Social media",
        intro:
          "Le meilleur calendrier n'est pas le plus rempli. C'est celui qui transforme les priorités de la marque en contenus réalisables, validés à temps et réutilisables sur plusieurs formats.",
        sections: [
          {
            heading: "Choisir trois à cinq piliers éditoriaux",
            paragraphs: [
              "Chaque pilier doit répondre à une question du public : comprendre l'offre, voir la preuve, découvrir la méthode, connaître les personnes ou passer à l'action. Un pilier trop large ne facilite aucune décision de production.",
              "Associez à chaque pilier un objectif et quelques formats possibles. Cela évite de chercher une idée à partir de zéro à chaque publication.",
            ],
          },
          {
            heading: "Planifier selon la capacité de production",
            paragraphs: [
              "Partez du temps réellement disponible pour écrire, tourner, monter et valider. Une cadence plus légère mais stable vaut mieux qu'une semaine intensive suivie d'un mois silencieux.",
              "Regroupez les tâches : une séance peut produire plusieurs plans, portraits, démonstrations et réponses courtes. Le calendrier devient alors un outil de production, pas seulement une suite de dates.",
            ],
          },
          {
            heading: "Installer un circuit de validation court",
            paragraphs: [
              "Définissez qui vérifie le fond, qui vérifie la marque et qui donne l'accord final. Une date de publication sans date de validation ne constitue pas un calendrier complet.",
              "Le brief doit contenir le message, le format, l'appel à l'action et les éléments obligatoires. Les retours deviennent plus précis et les versions inutiles diminuent.",
            ],
          },
          {
            heading: "Réutiliser sans répéter",
            paragraphs: [
              "Une idée forte peut devenir une vidéo courte, un carrousel, une réponse en story et un paragraphe de site. La réutilisation conserve l'idée mais adapte l'angle, la longueur et le geste demandé à chaque canal.",
              "En fin de mois, identifiez les sujets qui ont déclenché des sauvegardes, des réponses ou des demandes. Le calendrier suivant doit apprendre de ces signaux au lieu de recommencer à zéro.",
            ],
          },
        ],
        takeaways: [
          "Trois à cinq piliers reliés aux questions du public",
          "Une cadence construite sur la capacité réelle de production",
          "Des responsabilités et dates de validation explicites",
          "Une même idée adaptée intelligemment à plusieurs formats",
        ],
      },
      en: {
        title: "Build a social media calendar your team can actually sustain",
        excerpt:
          "From content pillars to approval: a simple system for publishing consistently without lowering quality.",
        metaDescription:
          "Create a sustainable social media calendar with clear content pillars, formats, production capacity, approvals, reuse and useful measurement.",
        category: "Social media",
        intro:
          "The best calendar is not the fullest one. It turns brand priorities into content the team can produce, approve on time and adapt across formats.",
        sections: [
          {
            heading: "Choose three to five content pillars",
            paragraphs: [
              "Each pillar should answer a public question: understand the offer, see proof, discover the method, meet the people or take action. A pillar that is too broad does not make production decisions easier.",
              "Connect each pillar to an objective and a short list of suitable formats. The team no longer has to invent every post from zero.",
            ],
          },
          {
            heading: "Plan around production capacity",
            paragraphs: [
              "Start from the time genuinely available for writing, shooting, editing and approval. A lighter stable rhythm is stronger than one intense week followed by a silent month.",
              "Batch related work: one session can produce demonstrations, portraits, supporting shots and short answers. The calendar becomes a production tool, not merely a set of dates.",
            ],
          },
          {
            heading: "Keep the approval path short",
            paragraphs: [
              "Decide who checks accuracy, who checks the brand and who gives final approval. A publishing date without an approval date is not a complete calendar.",
              "Every brief should carry the message, format, call to action and mandatory elements. Feedback becomes more precise and unnecessary versions decrease.",
            ],
          },
          {
            heading: "Reuse without repeating",
            paragraphs: [
              "One strong idea can become a short video, carousel, story answer and website paragraph. Reuse the idea while adapting the angle, length and requested action to each channel.",
              "At the end of the month, identify the topics that prompted saves, replies or enquiries. The next calendar should learn from those signals rather than start over.",
            ],
          },
        ],
        takeaways: [
          "Three to five pillars tied to real audience questions",
          "A cadence based on actual production capacity",
          "Explicit owners and approval dates",
          "One idea intelligently adapted across formats",
        ],
      },
      ar: {
        title: "كيف تنشئ تقويم محتوى تستطيع منظومتك الالتزام به",
        excerpt:
          "من محاور المحتوى إلى الاعتماد: تنظيم بسيط للنشر بانتظام دون التضحية بالجودة.",
        metaDescription:
          "أنشئ تقويمًا واقعيًا للشبكات الاجتماعية عبر محاور واضحة، وقدرة الإنتاج، والاعتماد، وإعادة الاستخدام، والقياس المفيد.",
        category: "الشبكات الاجتماعية",
        intro:
          "أفضل تقويم ليس الأكثر امتلاءً، بل الذي يحول أولويات العلامة إلى محتوى يمكن للفريق إنتاجه واعتماده في الوقت المناسب وتكييفه مع صيغ مختلفة.",
        sections: [
          {
            heading: "اختر من ثلاثة إلى خمسة محاور",
            paragraphs: [
              "يجب أن يجيب كل محور عن سؤال لدى الجمهور: فهم العرض، رؤية الدليل، اكتشاف الطريقة، التعرف على الفريق أو اتخاذ خطوة. المحور الواسع جدًا لا يساعد على قرار الإنتاج.",
              "اربط كل محور بهدف وبمجموعة صغيرة من الصيغ المناسبة حتى لا يبدأ الفريق البحث عن الفكرة من الصفر في كل مرة.",
            ],
          },
          {
            heading: "خطط وفق قدرة الإنتاج الحقيقية",
            paragraphs: [
              "ابدأ بالوقت المتاح فعلًا للكتابة والتصوير والمونتاج والاعتماد. وتيرة أخف لكنها مستقرة أفضل من أسبوع مكثف يتبعه شهر صامت.",
              "اجمع المهام المتشابهة: جلسة واحدة قد تنتج شروحات وصورًا ولقطات مساندة وأجوبة قصيرة. عندها يصبح التقويم أداة إنتاج لا مجرد تواريخ.",
            ],
          },
          {
            heading: "اختصر مسار الاعتماد",
            paragraphs: [
              "حدّد من يراجع دقة المعلومة، ومن يراجع الهوية، ومن يمنح الموافقة النهائية. تاريخ النشر دون تاريخ اعتماد لا يصنع تقويمًا مكتملًا.",
              "يجب أن يتضمن كل موجز الرسالة والصيغة والدعوة إلى الفعل والعناصر الإلزامية. تصبح الملاحظات أدق وتقل النسخ غير الضرورية.",
            ],
          },
          {
            heading: "أعد الاستخدام دون تكرار",
            paragraphs: [
              "يمكن لفكرة قوية أن تصبح فيديو قصيرًا ومنشورًا متسلسلًا وجوابًا في القصص وفقرة في الموقع. احتفظ بالفكرة وكيّف الزاوية والطول والخطوة المطلوبة لكل قناة.",
              "في نهاية الشهر، راقب المواضيع التي ولّدت حفظًا أو ردودًا أو طلبات. يجب أن يتعلم التقويم التالي من هذه الإشارات بدل البدء من جديد.",
            ],
          },
        ],
        takeaways: [
          "ثلاثة إلى خمسة محاور مرتبطة بأسئلة الجمهور",
          "وتيرة مبنية على قدرة الإنتاج الفعلية",
          "مسؤوليات وتواريخ اعتماد واضحة",
          "فكرة واحدة تُكيّف بذكاء مع صيغ متعددة",
        ],
      },
    },
  },
  {
    slug: "brief-video-reels",
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    readingMinutes: 5,
    content: {
      fr: {
        title: "Le brief vidéo qui évite les Reels jolis mais inutiles",
        excerpt:
          "Objectif, hook, preuve, plan de tournage et action finale : les éléments à verrouiller avant d'allumer la caméra.",
        metaDescription:
          "Préparez un brief vidéo et Reels efficace : objectif, audience, hook, preuve, script visuel, tournage, formats de livraison et appel à l'action.",
        category: "Production vidéo",
        intro:
          "Une vidéo peut être techniquement réussie et manquer son objectif. Le brief protège le projet contre ce décalage en transformant une intention vague en décisions de message, de plans et de diffusion.",
        sections: [
          {
            heading: "Définir le changement attendu",
            paragraphs: [
              "Écrivez ce que le spectateur doit comprendre, ressentir ou faire après la vidéo. Présenter un lieu, expliquer un service et déclencher une réservation sont trois objectifs différents qui n'appellent ni le même rythme ni les mêmes plans.",
              "Précisez aussi où la vidéo sera vue et dans quel contexte : avec ou sans son, dans un fil rapide, sur une page de service ou pendant une présentation commerciale.",
            ],
          },
          {
            heading: "Construire le hook autour d'une tension réelle",
            paragraphs: [
              "Les premières secondes doivent donner une raison de rester : une question précise, un résultat visible, un problème reconnu ou une démonstration qui commence immédiatement. Un mouvement de caméra seul n'est pas une promesse.",
              "Le hook visuel, le texte à l'écran et la première phrase doivent porter la même idée. S'ils ouvrent trois sujets différents, l'attention se disperse avant que le message n'arrive.",
            ],
          },
          {
            heading: "Transformer le script en liste de preuves",
            paragraphs: [
              "Pour chaque phrase importante, prévoyez ce qui la rend visible : geste, lieu, produit, écran, personne, avant-après autorisé ou détail de fabrication. La liste de plans doit prouver le texte, pas seulement l'accompagner.",
              "Identifiez avant le tournage les autorisations nécessaires : personnes reconnaissables, lieux privés, marques et contenus clients. Ce contrôle évite de découvrir au montage que le meilleur plan ne peut pas être publié.",
            ],
          },
          {
            heading: "Préparer les livraisons dès le brief",
            paragraphs: [
              "Indiquez les ratios, durées, sous-titres, langues, zones de sécurité et variantes attendues. Filmer uniquement pour un cadrage horizontal puis demander un format vertical conduit souvent à perdre le sujet ou les informations importantes.",
              "Terminez par une action réaliste et mesurable : visiter une page, écrire sur WhatsApp, demander un devis ou enregistrer une information. L'appel à l'action doit prolonger le message, pas apparaître comme une publicité ajoutée à la fin.",
            ],
          },
        ],
        takeaways: [
          "Un changement attendu clairement formulé",
          "Un hook visuel, écrit et parlé qui porte une seule idée",
          "Des plans conçus comme des preuves",
          "Des formats, autorisations et actions finales décidés avant le tournage",
        ],
      },
      en: {
        title: "The video brief that prevents attractive but ineffective Reels",
        excerpt:
          "Objective, hook, proof, shot list and final action: what to settle before the camera starts rolling.",
        metaDescription:
          "Prepare an effective video and Reels brief covering objective, audience, hook, visual proof, shot list, delivery formats and call to action.",
        category: "Video production",
        intro:
          "A video can be technically polished and still miss its purpose. The brief prevents that gap by turning a vague intention into decisions about message, shots and distribution.",
        sections: [
          {
            heading: "Define the expected change",
            paragraphs: [
              "Write what viewers should understand, feel or do after watching. Introducing a location, explaining a service and prompting a booking are different objectives requiring different rhythms and shots.",
              "State where the video will be seen and in what context: with or without sound, in a fast feed, on a service page or during a sales presentation.",
            ],
          },
          {
            heading: "Build the hook around a real tension",
            paragraphs: [
              "The first seconds need a reason to continue: a precise question, visible outcome, recognised problem or demonstration that starts immediately. Camera movement alone is not a promise.",
              "The visual hook, on-screen text and first spoken line should carry the same idea. If they open three different subjects, attention scatters before the message arrives.",
            ],
          },
          {
            heading: "Turn the script into a proof list",
            paragraphs: [
              "For every important line, decide what makes it visible: an action, location, product, screen, person, approved comparison or production detail. The shot list should prove the words, not merely decorate them.",
              "Identify permissions before the shoot: recognisable people, private locations, brands and client assets. This prevents discovering during editing that the best shot cannot be published.",
            ],
          },
          {
            heading: "Plan deliverables inside the brief",
            paragraphs: [
              "Specify ratios, durations, subtitles, languages, safe zones and variants. Shooting only for horizontal framing and later requesting vertical output often removes the subject or critical information.",
              "Finish with a realistic measurable action: visit a page, write on WhatsApp, request a quote or save useful information. The call to action should extend the message, not feel attached at the end.",
            ],
          },
        ],
        takeaways: [
          "A clearly stated change expected from the viewer",
          "Visual, written and spoken hooks carrying one idea",
          "Shots designed as proof",
          "Formats, permissions and final actions decided before filming",
        ],
      },
      ar: {
        title: "موجز الفيديو الذي يمنع إنتاج Reels جميلة بلا أثر",
        excerpt:
          "الهدف والخطاف والدليل وقائمة اللقطات والخطوة النهائية: ما يجب حسمه قبل تشغيل الكاميرا.",
        metaDescription:
          "حضّر موجزًا فعالًا للفيديو وReels يشمل الهدف والجمهور والخطاف والدليل البصري واللقطات وصيغ التسليم والدعوة إلى الفعل.",
        category: "إنتاج الفيديو",
        intro:
          "قد يكون الفيديو متقنًا من الناحية التقنية لكنه لا يحقق غايته. يمنع الموجز هذا الفرق بتحويل النية العامة إلى قرارات حول الرسالة واللقطات والنشر.",
        sections: [
          {
            heading: "حدّد التغيير المنتظر",
            paragraphs: [
              "اكتب ما الذي ينبغي للمشاهد أن يفهمه أو يشعر به أو يفعله بعد المشاهدة. تقديم مكان وشرح خدمة وتحفيز حجز أهداف مختلفة تحتاج إلى إيقاع ولقطات مختلفة.",
              "حدّد أيضًا أين سيُشاهد الفيديو وفي أي سياق: بصوت أو دونه، داخل موجز سريع، في صفحة خدمة أو أثناء عرض تجاري.",
            ],
          },
          {
            heading: "ابنِ الخطاف حول توتر حقيقي",
            paragraphs: [
              "يجب أن تمنح الثواني الأولى سببًا للاستمرار: سؤال دقيق، نتيجة مرئية، مشكلة معروفة أو شرح عملي يبدأ فورًا. حركة الكاميرا وحدها ليست وعدًا.",
              "ينبغي للخطاف البصري والنص على الشاشة والجملة الأولى أن تحمل الفكرة نفسها. إذا فتحت ثلاثة مواضيع مختلفة تشتت الانتباه قبل وصول الرسالة.",
            ],
          },
          {
            heading: "حوّل النص إلى قائمة أدلة",
            paragraphs: [
              "لكل جملة مهمة، حدّد ما يجعلها مرئية: حركة أو مكان أو منتج أو شاشة أو شخص أو مقارنة مسموح بها أو تفصيل في الصنع. يجب أن تثبت اللقطات الكلام لا أن تزيّنه فقط.",
              "حدّد التراخيص قبل التصوير: الأشخاص الظاهرون والأماكن الخاصة والعلامات ومواد العملاء. يمنع ذلك اكتشاف أن أفضل لقطة لا يمكن نشرها بعد الوصول إلى المونتاج.",
            ],
          },
          {
            heading: "خطط للتسليم داخل الموجز",
            paragraphs: [
              "حدّد النسب والمدد والترجمة واللغات ومناطق الأمان والنسخ المطلوبة. التصوير أفقيًا فقط ثم طلب نسخة عمودية قد يفقد الموضوع أو المعلومات المهمة.",
              "اختم بخطوة واقعية قابلة للقياس: زيارة صفحة، مراسلة عبر واتساب، طلب عرض سعر أو حفظ معلومة. يجب أن تكمل الدعوة إلى الفعل الرسالة بدل أن تبدو إعلانًا مضافًا في النهاية.",
            ],
          },
        ],
        takeaways: [
          "تغيير منتظر ومحدد بوضوح",
          "خطاف بصري ومكتوب ومنطوق يحمل فكرة واحدة",
          "لقطات مصممة كأدلة",
          "صيغ وتراخيص وخطوة نهائية محسومة قبل التصوير",
        ],
      },
    },
  },
];

export const findArticle = (slug: string): EditorialArticle | undefined =>
  articles.find((article) => article.slug === slug);
