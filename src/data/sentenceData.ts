import { Sentence } from '@/types';

// Curated Estonian-English sentence pairs from Tatoeba
// Categorized by level based on complexity and vocabulary
export const sentenceData: Sentence[] = [
    // A1 Level: Simple, everyday sentences
    { id: 1, estonian: 'Tere! Kuidas läheb?', english: 'Hello! How are you?', level: 'A1' },
    { id: 2, estonian: 'Mul läheb hästi.', english: 'I am doing well.', level: 'A1' },
    { id: 3, estonian: 'Mis su nimi on?', english: 'What is your name?', level: 'A1' },
    { id: 4, estonian: 'Minu nimi on Anna.', english: 'My name is Anna.', level: 'A1' },
    { id: 5, estonian: 'Ma olen eestlane.', english: 'I am Estonian.', level: 'A1' },
    { id: 6, estonian: 'Kust sa pärit oled?', english: 'Where are you from?', level: 'A1' },
    { id: 7, estonian: 'Ma tulen Tallinnast.', english: 'I come from Tallinn.', level: 'A1' },
    { id: 8, estonian: 'Kui vana sa oled?', english: 'How old are you?', level: 'A1' },
    { id: 9, estonian: 'Ma olen kakskümmend viis aastat vana.', english: 'I am twenty-five years old.', level: 'A1' },
    { id: 10, estonian: 'Ma räägin eesti keelt.', english: 'I speak Estonian.', level: 'A1' },
    { id: 11, estonian: 'Ma õpin eesti keelt.', english: 'I am learning Estonian.', level: 'A1' },
    { id: 12, estonian: 'See on väga hea.', english: 'That is very good.', level: 'A1' },
    { id: 13, estonian: 'Aitäh väga palju!', english: 'Thank you very much!', level: 'A1' },
    { id: 14, estonian: 'Palun vabandust.', english: 'Please excuse me.', level: 'A1' },
    { id: 15, estonian: 'Pole tänu väärt.', english: 'You are welcome.', level: 'A1' },
    { id: 16, estonian: 'Head aega!', english: 'Goodbye!', level: 'A1' },
    { id: 17, estonian: 'Näeme homme!', english: 'See you tomorrow!', level: 'A1' },
    { id: 18, estonian: 'Ma tahan süüa.', english: 'I want to eat.', level: 'A1' },
    { id: 19, estonian: 'Ma tahan juua.', english: 'I want to drink.', level: 'A1' },
    { id: 20, estonian: 'Kus on tualett?', english: 'Where is the toilet?', level: 'A1' },
    { id: 21, estonian: 'Ma ei saa aru.', english: 'I do not understand.', level: 'A1' },
    { id: 22, estonian: 'Palun räägi aeglasemalt.', english: 'Please speak more slowly.', level: 'A1' },
    { id: 23, estonian: 'Kas sa räägid inglise keelt?', english: 'Do you speak English?', level: 'A1' },
    { id: 24, estonian: 'Jah, ma räägin natuke.', english: 'Yes, I speak a little.', level: 'A1' },
    { id: 25, estonian: 'Mis see on?', english: 'What is this?', level: 'A1' },
    { id: 26, estonian: 'See on raamat.', english: 'This is a book.', level: 'A1' },
    { id: 27, estonian: 'Mul on nälg.', english: 'I am hungry.', level: 'A1' },
    { id: 28, estonian: 'Mul on janu.', english: 'I am thirsty.', level: 'A1' },
    { id: 29, estonian: 'Mul on külm.', english: 'I am cold.', level: 'A1' },
    { id: 30, estonian: 'Mul on palav.', english: 'I am hot.', level: 'A1' },
    { id: 31, estonian: 'Ma elan Eestis.', english: 'I live in Estonia.', level: 'A1' },
    { id: 32, estonian: 'Ma töötan kontoris.', english: 'I work in an office.', level: 'A1' },
    { id: 33, estonian: 'Täna on ilus ilm.', english: 'Today is beautiful weather.', level: 'A1' },
    { id: 34, estonian: 'Väljas sajab vihma.', english: 'It is raining outside.', level: 'A1' },
    { id: 35, estonian: 'Väljas sajab lund.', english: 'It is snowing outside.', level: 'A1' },
    { id: 36, estonian: 'Päike paistab.', english: 'The sun is shining.', level: 'A1' },
    { id: 37, estonian: 'Mis kell on?', english: 'What time is it?', level: 'A1' },
    { id: 38, estonian: 'Kell on kolm.', english: 'It is three o\'clock.', level: 'A1' },
    { id: 39, estonian: 'Ma lähen koju.', english: 'I am going home.', level: 'A1' },
    { id: 40, estonian: 'Ma tulen kohe tagasi.', english: 'I will come back soon.', level: 'A1' },

    // A2 Level: More complex structures
    { id: 41, estonian: 'Ma elasin varem Tartus, aga nüüd elan Tallinnas.', english: 'I used to live in Tartu, but now I live in Tallinn.', level: 'A2' },
    { id: 42, estonian: 'Kas sa tahaksid minuga kohvi juua?', english: 'Would you like to drink coffee with me?', level: 'A2' },
    { id: 43, estonian: 'Ma läheksin hea meelega kinno.', english: 'I would gladly go to the cinema.', level: 'A2' },
    { id: 44, estonian: 'Mida sa homme tegema hakkad?', english: 'What are you going to do tomorrow?', level: 'A2' },
    { id: 45, estonian: 'Ma pean homme tööle minema.', english: 'I have to go to work tomorrow.', level: 'A2' },
    { id: 46, estonian: 'Kas sul on aega homme õhtul?', english: 'Do you have time tomorrow evening?', level: 'A2' },
    { id: 47, estonian: 'Ma olen siin elanud juba viis aastat.', english: 'I have been living here for five years.', level: 'A2' },
    { id: 48, estonian: 'Ma käin iga päev jooksmas.', english: 'I go running every day.', level: 'A2' },
    { id: 49, estonian: 'Mulle meeldib eesti toit väga.', english: 'I like Estonian food very much.', level: 'A2' },
    { id: 50, estonian: 'Kas sa oled kunagi Saaremaal käinud?', english: 'Have you ever been to Saaremaa?', level: 'A2' },
    { id: 51, estonian: 'Ma ei ole veel Pärnus käinud.', english: 'I have not been to Pärnu yet.', level: 'A2' },
    { id: 52, estonian: 'Eile läksin ma poodi, et osta leiba.', english: 'Yesterday I went to the store to buy bread.', level: 'A2' },
    { id: 53, estonian: 'Ta ütles, et ta tuleb hiljem.', english: 'He said that he will come later.', level: 'A2' },
    { id: 54, estonian: 'Ma arvan, et see on hea mõte.', english: 'I think that this is a good idea.', level: 'A2' },
    { id: 55, estonian: 'Kui mul oleks rohkem aega, õpiksin ma rohkem.', english: 'If I had more time, I would study more.', level: 'A2' },
    { id: 56, estonian: 'Ma olen seda filmi juba näinud.', english: 'I have already seen this movie.', level: 'A2' },
    { id: 57, estonian: 'Mis sind eesti keele juures kõige rohkem huvitab?', english: 'What interests you most about the Estonian language?', level: 'A2' },
    { id: 58, estonian: 'Ma hakkasin eesti keelt õppima eelmisel aastal.', english: 'I started learning Estonian last year.', level: 'A2' },
    { id: 59, estonian: 'See restoran on avatud esmaspäevast reedeni.', english: 'This restaurant is open Monday to Friday.', level: 'A2' },
    { id: 60, estonian: 'Ma sooviksin broneerida lauda kahele.', english: 'I would like to book a table for two.', level: 'A2' },
    { id: 61, estonian: 'Palun tooge mulle menüü.', english: 'Please bring me the menu.', level: 'A2' },
    { id: 62, estonian: 'Ma võtaksin ühe kohvi ja ühe koogi.', english: 'I would take one coffee and one cake.', level: 'A2' },
    { id: 63, estonian: 'Kui palju see maksab?', english: 'How much does this cost?', level: 'A2' },
    { id: 64, estonian: 'Kas ma saan kaardiga maksta?', english: 'Can I pay by card?', level: 'A2' },
    { id: 65, estonian: 'Ma otsin kingapoodi.', english: 'I am looking for a shoe store.', level: 'A2' },
    { id: 66, estonian: 'Kas teil on seda suuremas numbris?', english: 'Do you have this in a bigger size?', level: 'A2' },
    { id: 67, estonian: 'See särk on mulle liiga suur.', english: 'This shirt is too big for me.', level: 'A2' },
    { id: 68, estonian: 'Ma tahaksin seda proovida.', english: 'I would like to try this on.', level: 'A2' },
    { id: 69, estonian: 'Riietuskabiin on seal taga.', english: 'The fitting room is in the back there.', level: 'A2' },
    { id: 70, estonian: 'Ma pean arsti juurde minema.', english: 'I have to go to the doctor.', level: 'A2' },
    { id: 71, estonian: 'Mul on peavalu.', english: 'I have a headache.', level: 'A2' },
    { id: 72, estonian: 'Ma tunnen end halvasti.', english: 'I feel sick.', level: 'A2' },
    { id: 73, estonian: 'Kas sa võiksid mulle apteeki näidata?', english: 'Could you show me the pharmacy?', level: 'A2' },
    { id: 74, estonian: 'Ma vajan rohtu köha vastu.', english: 'I need medicine for cough.', level: 'A2' },
    { id: 75, estonian: 'Bussijaam on siit viie minuti kaugusel.', english: 'The bus station is five minutes from here.', level: 'A2' },
    { id: 76, estonian: 'Kuidas ma saan kesklinna?', english: 'How can I get to the city center?', level: 'A2' },
    { id: 77, estonian: 'Kas see buss läheb raudteejaama?', english: 'Does this bus go to the train station?', level: 'A2' },
    { id: 78, estonian: 'Ma tahaksin piletit Tartusse.', english: 'I would like a ticket to Tartu.', level: 'A2' },
    { id: 79, estonian: 'Rong väljub kell kaheksa.', english: 'The train departs at eight o\'clock.', level: 'A2' },
    { id: 80, estonian: 'Ma jõudsin just õigel ajal kohale.', english: 'I arrived just in time.', level: 'A2' },

    // B1 Level: Complex sentences and idioms
    { id: 81, estonian: 'Kuigi mul oli palju tööd, jõudsin ma siiski kõik ära teha.', english: 'Although I had a lot of work, I still managed to finish everything.', level: 'B1' },
    { id: 82, estonian: 'Ma olen veendunud, et see projekt õnnestub.', english: 'I am convinced that this project will succeed.', level: 'B1' },
    { id: 83, estonian: 'Eesti kultuur on rikkalik ja mitmekesine.', english: 'Estonian culture is rich and diverse.', level: 'B1' },
    { id: 84, estonian: 'Laulupidu on eestlaste jaoks väga tähtis traditsioon.', english: 'The song festival is a very important tradition for Estonians.', level: 'B1' },
    { id: 85, estonian: 'Eesti taasiseseisvumine toimus 1991. aastal.', english: 'Estonia regained its independence in 1991.', level: 'B1' },
    { id: 86, estonian: 'Ma sooviksin avaldada oma arvamust selle teema kohta.', english: 'I would like to express my opinion on this topic.', level: 'B1' },
    { id: 87, estonian: 'Minu arvates on oluline säilitada keskkonda.', english: 'In my opinion, it is important to protect the environment.', level: 'B1' },
    { id: 88, estonian: 'Tehnoloogia areng on muutnud meie elu oluliselt.', english: 'The development of technology has significantly changed our lives.', level: 'B1' },
    { id: 89, estonian: 'Eesti on tuntud oma digitaalsete lahenduste poolest.', english: 'Estonia is known for its digital solutions.', level: 'B1' },
    { id: 90, estonian: 'E-residentsus on ainulaadne võimalus kogu maailmas.', english: 'E-residency is a unique opportunity in the world.', level: 'B1' },
    { id: 91, estonian: 'Ma olen selle raamatu juba läbi lugenud.', english: 'I have already read through this book.', level: 'B1' },
    { id: 92, estonian: 'Kirjanik kirjutab praegu uut romaani.', english: 'The writer is currently writing a new novel.', level: 'B1' },
    { id: 93, estonian: 'Eesti kirjandus on tõlgitud paljudesse keeltesse.', english: 'Estonian literature has been translated into many languages.', level: 'B1' },
    { id: 94, estonian: 'Ma eelistan lugeda ilukirjandust.', english: 'I prefer to read fiction.', level: 'B1' },
    { id: 95, estonian: 'Teaduslikud avastused aitavad meil maailma paremini mõista.', english: 'Scientific discoveries help us understand the world better.', level: 'B1' },
    { id: 96, estonian: 'Kliimamuutused mõjutavad kogu planeeti.', english: 'Climate change affects the entire planet.', level: 'B1' },
    { id: 97, estonian: 'Me peame tegema rohkem jätkusuutlike lahenduste nimel.', english: 'We need to do more for sustainable solutions.', level: 'B1' },
    { id: 98, estonian: 'Haridus on ühiskonna arengu alustala.', english: 'Education is the foundation of society\'s development.', level: 'B1' },
    { id: 99, estonian: 'Ülikoolis õppides sain ma palju uusi kogemusi.', english: 'While studying at university, I gained many new experiences.', level: 'B1' },
    { id: 100, estonian: 'Elukestev õpe on tänapäeval väga oluline.', english: 'Lifelong learning is very important nowadays.', level: 'B1' },
    { id: 101, estonian: 'Ma osalen regulaarselt erinevatel kursustel.', english: 'I regularly participate in various courses.', level: 'B1' },
    { id: 102, estonian: 'Tööturul on suur nõudlus IT-spetsialistide järele.', english: 'There is a high demand for IT specialists in the job market.', level: 'B1' },
    { id: 103, estonian: 'Ma soovin oma karjääri edendada.', english: 'I want to advance my career.', level: 'B1' },
    { id: 104, estonian: 'Ettevõtlus nõuab palju pühendumust ja riski.', english: 'Entrepreneurship requires a lot of dedication and risk.', level: 'B1' },
    { id: 105, estonian: 'Koostöö meeskonnaga on projekti edu võti.', english: 'Cooperation with the team is the key to project success.', level: 'B1' },
    { id: 106, estonian: 'Ma pean olema kohal koosolekul kell kümme.', english: 'I have to be present at the meeting at ten o\'clock.', level: 'B1' },
    { id: 107, estonian: 'Aruande esitamise tähtaeg on homme.', english: 'The deadline for submitting the report is tomorrow.', level: 'B1' },
    { id: 108, estonian: 'Ma pean selle dokumendi üle vaatama.', english: 'I need to review this document.', level: 'B1' },
    { id: 109, estonian: 'Kas sa võiksid mulle selle faili saata?', english: 'Could you send me this file?', level: 'B1' },
    { id: 110, estonian: 'Ma vastan sellele kirjale homme hommikul.', english: 'I will reply to this letter tomorrow morning.', level: 'B1' },
    { id: 111, estonian: 'Eesti loodus on imetlusväärne oma mitmekesisuses.', english: 'Estonian nature is admirable in its diversity.', level: 'B1' },
    { id: 112, estonian: 'Lahemaa rahvuspark on populaarne sihtkoht.', english: 'Lahemaa National Park is a popular destination.', level: 'B1' },
    { id: 113, estonian: 'Ma naudin metsas jalutamist.', english: 'I enjoy walking in the forest.', level: 'B1' },
    { id: 114, estonian: 'Soome lahe veed on puhtad ja selged.', english: 'The waters of the Gulf of Finland are clean and clear.', level: 'B1' },
    { id: 115, estonian: 'Suvel käin ma tihti rannas.', english: 'In summer, I often go to the beach.', level: 'B1' },
    { id: 116, estonian: 'Eesti talved võivad olla väga külmad.', english: 'Estonian winters can be very cold.', level: 'B1' },
    { id: 117, estonian: 'Ma armastan valget lund ja talvist maastikku.', english: 'I love the white snow and winter landscape.', level: 'B1' },
    { id: 118, estonian: 'Kevad on minu lemmik aastaaeg.', english: 'Spring is my favorite season.', level: 'B1' },
    { id: 119, estonian: 'Sügis on ilus, kui lehed muudavad värvi.', english: 'Autumn is beautiful when the leaves change color.', level: 'B1' },
    { id: 120, estonian: 'Ma loodan, et see vestlus oli teile kasulik.', english: 'I hope this conversation was useful for you.', level: 'B1' },
];

// Helper function to get sentences by level
export function getSentencesByLevel(level: 'A1' | 'A2' | 'B1'): Sentence[] {
    return sentenceData.filter(s => s.level === level);
}

// Helper function to get random sentences
export function getRandomSentences(count: number, level?: 'A1' | 'A2' | 'B1'): Sentence[] {
    const filtered = level ? getSentencesByLevel(level) : sentenceData;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Helper function to search sentences
export function searchSentences(query: string): Sentence[] {
    const lowerQuery = query.toLowerCase();
    return sentenceData.filter(s =>
        s.estonian.toLowerCase().includes(lowerQuery) ||
        s.english.toLowerCase().includes(lowerQuery)
    );
}
