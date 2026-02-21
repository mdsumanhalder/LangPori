/**
 * Sample stories for "Auto generate" by language.
 * Short, simple texts (A1–A2 level) for demo. Free, no API.
 */

export interface SampleStory {
  languageCode: string;
  title: string;
  author: string;
  content: string;
}

const SAMPLES: SampleStory[] = [
  // English
  {
    languageCode: 'en',
    title: 'A Day in the Park',
    author: 'Sample',
    content: `The sun is bright. Anna goes to the park. She sees a big tree. A bird is in the tree. The bird is red. Anna sits on the grass. She reads a book. The book is about a cat. After that she goes home. She is happy. The next day Anna tells her mother about the park. Her mother says they can go again on Saturday. Anna likes the park because it is quiet and green. Sometimes she sees other children there. They play on the swings. Anna prefers to sit and read. She has a favourite bench under the big tree. In the evening she writes about the park in her diary.`,
  },
  {
    languageCode: 'en',
    title: 'My Family',
    author: 'Sample',
    content: `I have a small family. My mother is a teacher. My father works in an office. I have one brother. His name is Tom. We live in a house. The house has a garden. We have a dog. The dog is brown. We like to play in the garden. Tom is two years older than me. He goes to the same school. We walk together every morning. On weekends we help our father in the garden. Our mother cooks lunch for us. We usually eat together at the big table. In the evening we watch a film or read books. Our dog sits with us on the sofa. I am very happy with my family.`,
  },
  // Estonian
  {
    languageCode: 'et',
    title: 'Päev pargis',
    author: 'Näidis',
    content: `Päike paistab. Anna läheb parki. Ta näeb suurt puud. Puu sees on lind. Lind on punane. Anna istub murul. Ta loeb raamatut. Raamat on kassist. Pärast seda läheb ta koju. Ta on õnnelik. Järgmisel päeval Anna räägib emale pargist. Ema ütleb, et nad saavad laupäeval uuesti minna. Annale meeldib park, sest see on vaikne ja roheline. Mõnikord näeb ta seal teisi lapsi. Nad mängivad kiigul. Anna eelistab istuda ja lugeda. Tal on lemmikpink suure puu all. Õhtul kirjutab ta pargist oma päevikusse.`,
  },
  {
    languageCode: 'et',
    title: 'Minu perekond',
    author: 'Näidis',
    content: `Mul on väike perekond. Ema on õpetaja. Isa töötab kontoris. Mul on üks vend. Tema nimi on Toomas. Me elame majas. Majal on aed. Meil on koer. Koer on pruun. Meile meeldib aias mängida. Toomas on kaks aastat minust vanem. Ta käib samas koolis. Me kõnnime koos iga hommik. Nädalavahetusel aitame me isa aias. Ema teeb meile lõuna. Me sööme tavaliselt koos suure laua taga. Õhtul vaatame filmi või loeme raamatuid. Meie koer istub meiega diivanil. Olen oma perega väga õnnelik.`,
  },
  // Spanish
  {
    languageCode: 'es',
    title: 'Un día en el parque',
    author: 'Muestra',
    content: `El sol brilla. Ana va al parque. Ve un árbol grande. Un pájaro está en el árbol. El pájaro es rojo. Ana se sienta en la hierba. Lee un libro. El libro habla de un gato. Después va a casa. Está contenta. Al día siguiente Ana le cuenta a su madre del parque. Su madre dice que pueden volver el sábado. A Ana le gusta el parque porque es tranquilo y verde. A veces ve a otros niños allí. Juegan en los columpios. Ana prefiere sentarse y leer. Tiene un banco favorito bajo el árbol grande. Por la noche escribe sobre el parque en su diario.`,
  },
  {
    languageCode: 'es',
    title: 'Mi familia',
    author: 'Muestra',
    content: `Tengo una familia pequeña. Mi madre es profesora. Mi padre trabaja en una oficina. Tengo un hermano. Se llama Pablo. Vivimos en una casa. La casa tiene un jardín. Tenemos un perro. El perro es marrón. Nos gusta jugar en el jardín. Pablo es dos años mayor que yo. Va al mismo colegio. Caminamos juntos cada mañana. Los fines de semana ayudamos a nuestro padre en el jardín. Nuestra madre nos prepara el almuerzo. Solemos comer juntos en la mesa grande. Por la noche vemos una película o leemos libros. Nuestro perro se sienta con nosotros en el sofá. Estoy muy contento con mi familia.`,
  },
  // French
  {
    languageCode: 'fr',
    title: 'Une journée au parc',
    author: 'Exemple',
    content: `Le soleil brille. Anne va au parc. Elle voit un grand arbre. Un oiseau est dans l'arbre. L'oiseau est rouge. Anne s'assoit sur l'herbe. Elle lit un livre. Le livre parle d'un chat. Ensuite elle rentre à la maison. Elle est contente.`,
  },
  {
    languageCode: 'fr',
    title: 'Ma famille',
    author: 'Exemple',
    content: `J'ai une petite famille. Ma mère est professeur. Mon père travaille dans un bureau. J'ai un frère. Il s'appelle Pierre. Nous habitons une maison. La maison a un jardin. Nous avons un chien. Le chien est marron. Nous aimons jouer dans le jardin.`,
  },
  // German
  {
    languageCode: 'de',
    title: 'Ein Tag im Park',
    author: 'Beispiel',
    content: `Die Sonne scheint. Anna geht in den Park. Sie sieht einen großen Baum. Ein Vogel ist im Baum. Der Vogel ist rot. Anna setzt sich auf das Gras. Sie liest ein Buch. Das Buch handelt von einer Katze. Danach geht sie nach Hause. Sie ist glücklich.`,
  },
  {
    languageCode: 'de',
    title: 'Meine Familie',
    author: 'Beispiel',
    content: `Ich habe eine kleine Familie. Meine Mutter ist Lehrerin. Mein Vater arbeitet in einem Büro. Ich habe einen Bruder. Er heißt Tom. Wir wohnen in einem Haus. Das Haus hat einen Garten. Wir haben einen Hund. Der Hund ist braun. Wir spielen gern im Garten.`,
  },
  // Italian
  {
    languageCode: 'it',
    title: 'Un giorno al parco',
    author: 'Esempio',
    content: `Il sole splende. Anna va al parco. Vede un albero grande. Un uccello è sull'albero. L'uccello è rosso. Anna si siede sull'erba. Legge un libro. Il libro parla di un gatto. Poi torna a casa. È contenta.`,
  },
  {
    languageCode: 'it',
    title: 'La mia famiglia',
    author: 'Esempio',
    content: `Ho una famiglia piccola. Mia madre è insegnante. Mio padre lavora in un ufficio. Ho un fratello. Si chiama Marco. Abitiamo in una casa. La casa ha un giardino. Abbiamo un cane. Il cane è marrone. Ci piace giocare nel giardino.`,
  },
  // Portuguese
  {
    languageCode: 'pt',
    title: 'Um dia no parque',
    author: 'Exemplo',
    content: `O sol brilha. A Ana vai ao parque. Ela vê uma árvore grande. Um pássaro está na árvore. O pássaro é vermelho. A Ana senta-se na relva. Ela lê um livro. O livro fala de um gato. Depois vai para casa. Ela está contente.`,
  },
  {
    languageCode: 'pt',
    title: 'A minha família',
    author: 'Exemplo',
    content: `Tenho uma família pequena. A minha mãe é professora. O meu pai trabalha num escritório. Tenho um irmão. Chama-se João. Vivemos numa casa. A casa tem um jardim. Temos um cão. O cão é castanho. Gostamos de brincar no jardim.`,
  },
  // Russian
  {
    languageCode: 'ru',
    title: 'День в парке',
    author: 'Пример',
    content: `Светит солнце. Анна идёт в парк. Она видит большое дерево. На дереве сидит птица. Птица красная. Анна садится на траву. Она читает книгу. Книга про кота. Потом она идёт домой. Она счастлива.`,
  },
  {
    languageCode: 'ru',
    title: 'Моя семья',
    author: 'Пример',
    content: `У меня маленькая семья. Моя мама учительница. Папа работает в офисе. У меня есть брат. Его зовут Том. Мы живём в доме. У дома есть сад. У нас есть собака. Собака коричневая. Мы любим играть в саду.`,
  },
  // Dutch
  {
    languageCode: 'nl',
    title: 'Een dag in het park',
    author: 'Voorbeeld',
    content: `De zon schijnt. Anna gaat naar het park. Ze ziet een grote boom. Er zit een vogel in de boom. De vogel is rood. Anna gaat op het gras zitten. Ze leest een boek. Het boek gaat over een kat. Daarna gaat ze naar huis. Ze is blij.`,
  },
  // Polish
  {
    languageCode: 'pl',
    title: 'Dzień w parku',
    author: 'Przykład',
    content: `Słońce świeci. Anna idzie do parku. Widzi duże drzewo. Na drzewie jest ptak. Ptak jest czerwony. Anna siada na trawie. Czyta książkę. Książka jest o kocie. Potem idzie do domu. Jest zadowolona.`,
  },
  // Swedish
  {
    languageCode: 'sv',
    title: 'En dag i parken',
    author: 'Exempel',
    content: `Solen skiner. Anna går till parken. Hon ser ett stort träd. En fågel sitter i trädet. Fågeln är röd. Anna sitter på gräset. Hon läser en bok. Boken handlar om en katt. Sedan går hon hem. Hon är glad.`,
  },
  // Finnish
  {
    languageCode: 'fi',
    title: 'Päivä puistossa',
    author: 'Esimerkki',
    content: `Aurinko paistaa. Anna menee puistoon. Hän näkee suuren puun. Puussa on lintu. Lintu on punainen. Anna istuu nurmikolle. Hän lukee kirjaa. Kirja kertoo kissasta. Sen jälkeen hän menee kotiin. Hän on iloinen.`,
  },
  // Turkish
  {
    languageCode: 'tr',
    title: 'Parkta bir gün',
    author: 'Örnek',
    content: `Güneş parlıyor. Anna parka gidiyor. Büyük bir ağaç görüyor. Ağaçta bir kuş var. Kuş kırmızı. Anna çimene oturuyor. Bir kitap okuyor. Kitap bir kedi hakkında. Sonra eve gidiyor. Mutlu.`,
  },
  // Vietnamese
  {
    languageCode: 'vi',
    title: 'Một ngày ở công viên',
    author: 'Mẫu',
    content: `Mặt trời sáng. Anna đi đến công viên. Cô thấy một cây to. Có một con chim trên cây. Con chim màu đỏ. Anna ngồi trên cỏ. Cô đọc sách. Sách nói về một con mèo. Sau đó cô về nhà. Cô vui.`,
  },
  // Hindi (Devanagari)
  {
    languageCode: 'hi',
    title: 'पार्क में एक दिन',
    author: 'नमूना',
    content: `धूप खिली है। अन्ना पार्क जाती है। वह एक बड़ा पेड़ देखती है। पेड़ पर एक चिड़िया है। चिड़िया लाल है। अन्ना घास पर बैठती है। वह एक किताब पढ़ती है। किताब बिल्ली के बारे में है। फिर वह घर जाती है। वह खुश है।`,
  },
  // Arabic
  {
    languageCode: 'ar',
    title: 'يوم في الحديقة',
    author: 'عينة',
    content: `الشمس ساطعة. آنا تذهب إلى الحديقة. ترى شجرة كبيرة. هناك طائر على الشجرة. الطائر أحمر. آنا تجلس على العشب. تقرأ كتاباً. الكتاب عن قطة. ثم تذهب إلى البيت. هي سعيدة.`,
  },
  // Chinese Simplified
  {
    languageCode: 'zh-CN',
    title: '公园里的一天',
    author: '示例',
    content: `阳光很好。安娜去公园。她看见一棵大树。树上有一只鸟。鸟是红色的。安娜坐在草地上。她读一本书。书是关于一只猫的。然后她回家。她很开心。`,
  },
  // Japanese
  {
    languageCode: 'ja',
    title: '公園の一日',
    author: 'サンプル',
    content: `日が照っています。アンナは公園に行きます。大きな木が見えます。木に鳥がいます。鳥は赤いです。アンナは草の上に座ります。本を読みます。本は猫の話です。それから家に帰ります。うれしいです。`,
  },
  // Korean
  {
    languageCode: 'ko',
    title: '공원에서의 하루',
    author: '샘플',
    content: `날씨가 좋습니다. 안나는 공원에 갑니다. 큰 나무를 봅니다. 나무에 새가 있습니다. 새는 빨간색입니다. 안나는 잔디에 앉습니다. 책을 읽습니다. 책은 고양이에 대한 이야기입니다. 그다음 집에 갑니다. 기쁩니다.`,
  },
  // Bengali
  {
    languageCode: 'bn',
    title: 'পার্কে একটি দিন',
    author: 'নমুনা',
    content: `সূর্য উজ্জ্বল। আনা পার্কে যায়। সে একটি বড় গাছ দেখে। গাছে একটি পাখি আছে। পাখিটি লাল। আনা ঘাসে বসে। সে একটি বই পড়ে। বইটি একটি বেড়ালের কথা। তারপর সে বাড়ি যায়। সে খুশি।`,
  },
  // Ukrainian
  {
    languageCode: 'uk',
    title: 'День у парку',
    author: 'Зразок',
    content: `Сонце сяє. Анна йде в парк. Вона бачить велике дерево. На дереві сидить птах. Птах червоний. Анна сідає на траву. Вона читає книгу. Книга про кота. Потім вона йде додому. Вона щаслива.`,
  },
  // Fallback: use 'en' for any other language code so we always have at least one option
];

/** Language codes that have at least one sample. */
const LANGUAGES_WITH_SAMPLES = [...new Set(SAMPLES.map((s) => s.languageCode))];

/**
 * Get a random sample story for the given language.
 * If no sample exists for that language, returns a random English sample (so form still fills).
 */
export function getRandomSampleForLanguage(languageCode: string): SampleStory | null {
  const forLang = SAMPLES.filter((s) => s.languageCode === languageCode);
  if (forLang.length > 0) {
    return forLang[Math.floor(Math.random() * forLang.length)];
  }
  const en = SAMPLES.filter((s) => s.languageCode === 'en');
  return en[Math.floor(Math.random() * en.length)] ?? null;
}

/** Check if we have samples for this language. */
export function hasSamplesForLanguage(languageCode: string): boolean {
  return SAMPLES.some((s) => s.languageCode === languageCode);
}

/** List of language codes that have dedicated samples (not fallback). */
export function getLanguagesWithSamples(): string[] {
  return LANGUAGES_WITH_SAMPLES;
}

/**
 * Get a static sample for API fallback (same as getRandomSampleForLanguage but can be used server-side).
 * Returns content in the requested language when available, otherwise English.
 */
export function getStaticFallbackForLanguage(languageCode: string): SampleStory | null {
  return getRandomSampleForLanguage(languageCode);
}

/**
 * Fetch a sample story from the free Tatoeba database (via our API).
 * Works for many languages. Returns null on failure (use getRandomSampleForLanguage as fallback).
 */
export async function fetchSampleFromTatoeba(languageCode: string): Promise<SampleStory | null> {
  try {
    const res = await fetch(`/api/tatoeba?lang=${encodeURIComponent(languageCode)}`);
    const data = await res.json();
    if (!res.ok || data.error || !data.content?.trim()) return null;
    return {
      languageCode,
      title: data.title || 'Sample from Tatoeba',
      author: data.author || 'Tatoeba',
      content: data.content.trim(),
    };
  } catch {
    return null;
  }
}
