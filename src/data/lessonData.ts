import { Lesson } from '@/types';

export const lessonsData: Lesson[] = [
    {
        id: 1,
        title: "Basic Greetings",
        level: "A1",
        language: "et-EE",
        description: "Essential greetings for everyday communication",
        content: [
            {
                category: "Common Greetings",
                words: [
                    {
                        word: "Hello",
                        translation: "Tere",
                        pronunciation: "TEH-reh",
                        grammar: "Basic greeting used at any time of day",
                        example: "Tere! Kuidas sul läheb?",
                        exampleTranslation: "Hello! How are you?"
                    },
                    {
                        word: "Good morning",
                        translation: "Tere hommikust",
                        pronunciation: "TEH-reh HOHM-mee-koost",
                        example: "Tere hommikust! Magasid hästi?",
                        exampleTranslation: "Good morning! Did you sleep well?"
                    },
                    {
                        word: "Good evening",
                        translation: "Tere õhtust",
                        pronunciation: "TEH-reh UH-h-toost",
                        example: "Tere õhtust! Tore sind näha.",
                        exampleTranslation: "Good evening! Nice to see you."
                    },
                    {
                        word: "Goodbye",
                        translation: "Head aega",
                        pronunciation: "HEH-ahd AY-gah",
                        grammar: "Literally means 'good time'. Used when parting.",
                        example: "Head aega! Näeme homme.",
                        exampleTranslation: "Goodbye! See you tomorrow."
                    },
                    {
                        word: "See you later",
                        translation: "Näeme hiljem",
                        pronunciation: "NAE-eh-meh HEEL-yehm",
                        example: "Näeme hiljem! Head päeva!",
                        exampleTranslation: "See you later! Have a good day!"
                    }
                ]
            },
            {
                category: "Polite Expressions",
                words: [
                    {
                        word: "Please",
                        translation: "Palun",
                        pronunciation: "PAH-loon",
                        grammar: "Used for requests or when offering something",
                        example: "Palun aidake mind!",
                        exampleTranslation: "Please help me!"
                    },
                    {
                        word: "Thank you",
                        translation: "Aitäh",
                        pronunciation: "AY-taeh",
                        example: "Aitäh! Sa oled väga abivalmis.",
                        exampleTranslation: "Thank you! You are very helpful."
                    },
                    {
                        word: "You're welcome",
                        translation: "Palun / Pole tänu väärt",
                        pronunciation: "PAH-loon / POH-leh TAE-noo vae-rt",
                        example: "Aitäh abi eest! - Pole tänu väärt!",
                        exampleTranslation: "Thanks for the help! - You're welcome!"
                    },
                    {
                        word: "Excuse me / Sorry",
                        translation: "Vabandust",
                        pronunciation: "VAH-bahn-doost",
                        example: "Vabandust, kus on bussipeatus?",
                        exampleTranslation: "Excuse me, where is the bus stop?"
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Numbers 1-10",
        level: "A1",
        language: "et-EE",
        description: "Basic numbers for counting",
        content: [
            {
                category: "Numbers 1-5",
                words: [
                    { word: "One", translation: "Üks", pronunciation: "ooks", example: "Mul on üks õun.", exampleTranslation: "I have one apple." },
                    { word: "Two", translation: "Kaks", pronunciation: "kahks", example: "Kaks kohvi, palun.", exampleTranslation: "Two coffees, please." },
                    { word: "Three", translation: "Kolm", pronunciation: "kohlm", example: "Meil on kolm last.", exampleTranslation: "We have three children." },
                    { word: "Four", translation: "Neli", pronunciation: "NEH-lee", example: "Buss number neli.", exampleTranslation: "Bus number four." },
                    { word: "Five", translation: "Viis", pronunciation: "vees", example: "Viis eurot, palun.", exampleTranslation: "Five euros, please." }
                ]
            },
            {
                category: "Numbers 6-10",
                words: [
                    { word: "Six", translation: "Kuus", pronunciation: "kooss", example: "Kell on kuus.", exampleTranslation: "It's six o'clock." },
                    { word: "Seven", translation: "Seitse", pronunciation: "SAYT-seh", example: "Seitse päeva nädalas.", exampleTranslation: "Seven days in a week." },
                    { word: "Eight", translation: "Kaheksa", pronunciation: "KAH-hehk-sah", example: "Ma elan majas number kaheksa.", exampleTranslation: "I live in house number eight." },
                    { word: "Nine", translation: "Üheksa", pronunciation: "OO-hehk-sah", example: "Üheksa tundi tööd päevas.", exampleTranslation: "Nine hours of work per day." },
                    { word: "Ten", translation: "Kümme", pronunciation: "KOOM-meh", example: "Kümme minutit.", exampleTranslation: "Ten minutes." }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Days of the Week",
        level: "A1",
        language: "et-EE",
        description: "Days of the week in Estonian",
        content: [
            {
                category: "Weekdays",
                words: [
                    { word: "Monday", translation: "Esmaspäev", pronunciation: "EHS-mahs-paev", grammar: "Literally means 'first day'", example: "Esmaspäev on nädala esimene päev.", exampleTranslation: "Monday is the first day of the week." },
                    { word: "Tuesday", translation: "Teisipäev", pronunciation: "TAY-see-paev", grammar: "Literally means 'second day'", example: "Teisipäeval on mul koosolek.", exampleTranslation: "On Tuesday I have a meeting." },
                    { word: "Wednesday", translation: "Kolmapäev", pronunciation: "KOHL-mah-paev", grammar: "Literally means 'third day'", example: "Kolmapäev on nädala keskmine päev.", exampleTranslation: "Wednesday is the middle of the week." },
                    { word: "Thursday", translation: "Neljapäev", pronunciation: "NEHL-yah-paev", grammar: "Literally means 'fourth day'", example: "Neljapäeval käin keeletunnis.", exampleTranslation: "On Thursday I go to language class." },
                    { word: "Friday", translation: "Reede", pronunciation: "REH-deh", example: "Reede on nädala viimane tööpäev.", exampleTranslation: "Friday is the last workday of the week." }
                ]
            },
            {
                category: "Weekend",
                words: [
                    { word: "Saturday", translation: "Laupäev", pronunciation: "LOW-paev", example: "Laupäeval käin turul.", exampleTranslation: "On Saturday I go to the market." },
                    { word: "Sunday", translation: "Pühapäev", pronunciation: "POO-hah-paev", grammar: "Literally means 'holy day'", example: "Pühapäev on puhkepäev.", exampleTranslation: "Sunday is a rest day." }
                ]
            },
            {
                category: "Useful Phrases",
                words: [
                    { word: "What day is today?", translation: "Mis päev täna on?", pronunciation: "miss paev TAE-nah on", example: "Mis päev täna on? - Täna on teisipäev.", exampleTranslation: "What day is today? - Today is Tuesday." },
                    { word: "week", translation: "nädal", pronunciation: "NAE-dahl", example: "Järgmisel nädalal.", exampleTranslation: "Next week." }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "EE 20%",
        level: "EE20",
        language: "et-EE",
        description: "Essential Estonian vocabulary - 20% of the most useful words",
        content: [
            {
                category: "Introducing Yourself",
                words: [
                    { word: "My name is ...", translation: "Minu nimi on ...", pronunciation: "MEE-noo NEE-mee on", grammar: "Use 'Minu nimi on' followed by your name. 'Minu' means 'my', 'nimi' means 'name'.", example: "Minu nimi on Maria.", exampleTranslation: "My name is Maria." },
                    { word: "I am from Bangladesh", translation: "Ma olen pärit Bangladeshist", pronunciation: "mah OH-len PAE-rit BAHN-glah-deh-shist", grammar: "Use 'Ma olen pärit' to say where you're from. Country names end in '-st' (from).", example: "Ma olen pärit Bangladeshist. Ma elan Eestis.", exampleTranslation: "I am from Bangladesh. I live in Estonia." },
                    { word: "I live in Tallinn", translation: "Ma elan Tallinnas", pronunciation: "mah EH-lahn TAHL-lin-nahs", grammar: "City names end in '-s' when you live 'in' them. Tallinn → Tallinnas.", example: "Ma elan Tallinnas. Tallinn on pealinn.", exampleTranslation: "I live in Tallinn. Tallinn is the capital." },
                    { word: "I speak a little Estonian", translation: "Ma räägin natuke eesti keelt", pronunciation: "mah RAEH-gin NAH-too-keh EHS-tee kelt", grammar: "'Ma räägin' means 'I speak'. 'Natuke' means 'a little'. Language names use '-t' ending.", example: "Ma räägin natuke eesti keelt ja inglise keelt.", exampleTranslation: "I speak a little Estonian and English." },
                    { word: "How old are you?", translation: "Kui vana sa oled?", pronunciation: "kwee VAH-nah sah OH-led", grammar: "Question format: 'Kui vana' (how old) + 'sa oled' (you are).", example: "Kui vana sa oled? - Ma olen 25 aastat vana.", exampleTranslation: "How old are you? - I am 25 years old." },
                    { word: "I am 28 years old", translation: "Ma olen 28 aastat vana", pronunciation: "mah OH-len kahks-küm-mend kahk-sah AHS-taht VAH-nah", grammar: "Use 'Ma olen' + number + 'aastat vana'. 'Aastat' means 'years'.", example: "Ma olen 28 aastat vana. Mu õde on 30 aastat vana.", exampleTranslation: "I am 28 years old. My sister is 30 years old." }
                ]
            },
            {
                category: "Common Questions",
                words: [
                    { word: "What is your name?", translation: "Mis su nimi on?", pronunciation: "miss soo NEE-mee on", grammar: "Use 'Mis' for 'what' and 'su' for 'your' (informal)", example: "Mis su nimi on? - Minu nimi on Markus.", exampleTranslation: "What is your name? - My name is Markus." },
                    { word: "Where are you from?", translation: "Kust sa pärit oled?", pronunciation: "koost sah PAE-rit OH-led", grammar: "'Kust' means 'from where', 'pärit oled' means 'are from'", example: "Kust sa pärit oled? - Ma olen pärit Bangladeshist.", exampleTranslation: "Where are you from? - I am from Bangladesh." },
                    { word: "Where do you live?", translation: "Kus sa elad?", pronunciation: "kooss sah EH-lahd", grammar: "'Kus' means 'where', 'elad' is conjugated form of 'elama' (to live)", example: "Kus sa elad? - Ma elan Tallinnas.", exampleTranslation: "Where do you live? - I live in Tallinn." },
                    { word: "What are you doing?", translation: "Mida sa teed?", pronunciation: "MEE-dah sah ted", grammar: "'Mida' means 'what' (object form), 'teed' is from 'tegema' (to do)", example: "Mida sa teed? - Ma õpin eesti keelt.", exampleTranslation: "What are you doing? - I am learning Estonian." },
                    { word: "What is this?", translation: "Mis see on?", pronunciation: "miss seh on", grammar: "'See' means 'this/it', used to point at objects", example: "Mis see on? - See on raamat.", exampleTranslation: "What is this? - This is a book." },
                    { word: "Who is that?", translation: "Kes see on?", pronunciation: "kess seh on", grammar: "'Kes' means 'who', used for asking about people", example: "Kes see on? - See on minu sõber.", exampleTranslation: "Who is that? - That is my friend." },
                    { word: "How much does it cost?", translation: "Kui palju see maksab?", pronunciation: "kwee PAHL-yoo seh MAHK-sahb", grammar: "'Kui palju' means 'how much', 'maksab' means 'costs'", example: "Kui palju see maksab? - See maksab viis eurot.", exampleTranslation: "How much does it cost? - It costs five euros." }
                ]
            },
            {
                category: "Greetings & Polite Phrases",
                words: [
                    { word: "Hello", translation: "Tere", pronunciation: "TEH-reh", grammar: "Universal greeting for any time of day", example: "Tere! Kuidas läheb?", exampleTranslation: "Hello! How are you?" },
                    { word: "Good morning", translation: "Tere hommikust", pronunciation: "TEH-reh HOM-mee-koost", grammar: "'Hommikust' is partitive form of 'morning'", example: "Tere hommikust! Ilusat päeva!", exampleTranslation: "Good morning! Have a nice day!" },
                    { word: "Good afternoon", translation: "Tere päevast", pronunciation: "TEH-reh PAE-vahst", grammar: "'Päevast' is partitive form of 'day'", example: "Tere päevast! Kus sa käisid?", exampleTranslation: "Good afternoon! Where have you been?" },
                    { word: "Good evening", translation: "Tere õhtust / Head õhtut", pronunciation: "TEH-reh ÕH-toost / head ÕH-toot", grammar: "Both forms are common, 'head' means 'good'", example: "Tere õhtust! Kas sa oled juba õhtustanud?", exampleTranslation: "Good evening! Have you had dinner yet?" },
                    { word: "Good night", translation: "Head ööd", pronunciation: "head ööd", grammar: "Used when going to bed or ending an evening", example: "Head ööd! Magusaid unenägusid!", exampleTranslation: "Good night! Sweet dreams!" },
                    { word: "Bye (informal)", translation: "Nägemist", pronunciation: "NAE-geh-mist", grammar: "Literally means 'seeing', most common informal goodbye", example: "Nägemist! Kohtume homme!", exampleTranslation: "Bye! See you tomorrow!" },
                    { word: "Goodbye (formal)", translation: "Head aega", pronunciation: "head AH-eh-gah", grammar: "Literally means 'good time', more formal", example: "Head aega! Edu tööl!", exampleTranslation: "Goodbye! Good luck at work!" },
                    { word: "Thank you", translation: "Aitäh", pronunciation: "AH-ee-taeh", grammar: "Standard expression of gratitude", example: "Aitäh sulle! Sa oled väga lahke.", exampleTranslation: "Thank you! You are very kind." },
                    { word: "Please / You're welcome", translation: "Palun", pronunciation: "PAH-loon", grammar: "Used for requests and as response to 'thank you'", example: "Palun aita mind! - Palun, pole tänu väärt.", exampleTranslation: "Please help me! - You're welcome, don't mention it." },
                    { word: "Excuse me / Sorry", translation: "Vabandust", pronunciation: "VAH-bahn-doost", grammar: "Used to apologize or get someone's attention", example: "Vabandust, kus on WC?", exampleTranslation: "Excuse me, where is the toilet?" },
                    { word: "No problem", translation: "Pole viga", pronunciation: "POH-leh VEE-gah", grammar: "Literally means 'no mistake', casual response", example: "Vabandust! - Pole viga, kõik on korras.", exampleTranslation: "Sorry! - No problem, everything is fine." },
                    { word: "Okay / Clear", translation: "Selge", pronunciation: "SEL-geh", grammar: "Means 'clear' or 'understood', shows agreement", example: "Kas sa saad aru? - Jah, selge!", exampleTranslation: "Do you understand? - Yes, clear!" }
                ]
            },
            {
                category: "Numbers",
                words: [
                    { word: "0", translation: "null", pronunciation: "nooll", example: "Null kraadi on külm.", exampleTranslation: "Zero degrees is cold." },
                    { word: "1", translation: "üks", pronunciation: "ükss", example: "Üks kohv, palun.", exampleTranslation: "One coffee, please." },
                    { word: "2", translation: "kaks", pronunciation: "kahks", example: "Kaks piletit, palun.", exampleTranslation: "Two tickets, please." },
                    { word: "3", translation: "kolm", pronunciation: "kolm", example: "Kolm last.", exampleTranslation: "Three children." },
                    { word: "4", translation: "neli", pronunciation: "NEH-lee", example: "Neli hooaega.", exampleTranslation: "Four seasons." },
                    { word: "5", translation: "viis", pronunciation: "veess", example: "Viis eurot.", exampleTranslation: "Five euros." },
                    { word: "10", translation: "kümme", pronunciation: "KÜM-meh", example: "Kümme minutit.", exampleTranslation: "Ten minutes." },
                    { word: "20", translation: "kakskümmend", pronunciation: "kahks-KÜM-mend", example: "Kakskümmend aastat vana.", exampleTranslation: "Twenty years old." },
                    { word: "100", translation: "sada", pronunciation: "SAH-dah", example: "Üks sada eurot.", exampleTranslation: "One hundred euros." },
                    { word: "1,000", translation: "tuhat", pronunciation: "TOO-haht", example: "Tuhat tänu!", exampleTranslation: "A thousand thanks!" },
                    { word: "1,000,000", translation: "miljon", pronunciation: "MIL-yon", example: "Üks miljon inimest.", exampleTranslation: "One million people." },
                    { word: "1,000,000,000", translation: "miljard", pronunciation: "MIL-yahrd", example: "Miljard dollarit.", exampleTranslation: "One billion dollars." }
                ]
            },
            {
                category: "Directions & Locations",
                words: [
                    { word: "left", translation: "vasak", pronunciation: "VAH-sahk", cases: { nimetav: "vasak", nimetavExample: "Vasak käsi on tugevam.", nimetavExampleEn: "The left hand is stronger.", omastav: "vasaku", omastavExample: "Vasaku käe sõrmed on pikemad.", omastavExampleEn: "The fingers of the left hand are longer.", osastav: "vasakut", osastavExample: "Ma kasutan vasakut kätt.", osastavExampleEn: "I use the left hand." } },
                    { word: "right", translation: "parem", pronunciation: "PAH-rem", cases: { nimetav: "parem", nimetavExample: "Parem pool on vaba.", nimetavExampleEn: "The right side is free.", omastav: "parema", omastavExample: "Parema käega kirjutan.", omastavExampleEn: "I write with the right hand.", osastav: "paremat", osastavExample: "Ma eelistan paremat poolt.", osastavExampleEn: "I prefer the right side." } },
                    { word: "straight ahead", translation: "otse edasi", pronunciation: "OT-seh EH-dah-see" },
                    { word: "near", translation: "lähedal", pronunciation: "LAE-heh-dahl" },
                    { word: "far", translation: "kaugel", pronunciation: "KOW-gel" },
                    { word: "here", translation: "siin", pronunciation: "seen" },
                    { word: "there", translation: "seal", pronunciation: "sehl" },
                    { word: "in front of", translation: "ees", pronunciation: "ess" },
                    { word: "behind", translation: "taga", pronunciation: "TAH-gah" },
                    { word: "next to", translation: "kõrval", pronunciation: "KÕRR-vahl" },
                    { word: "opposite", translation: "vastas", pronunciation: "VAHS-tahs" },
                    { word: "entrance", translation: "sissepääs", pronunciation: "SIS-seh-paes", cases: { nimetav: "sissepääs", nimetavExample: "Sissepääs on suletud.", nimetavExampleEn: "The entrance is closed.", omastav: "sissepääsu", omastavExample: "Sissepääsu juures on valvur.", omastavExampleEn: "There is a guard at the entrance.", osastav: "sissepääsu", osastavExample: "Ma otsin sissepääsu.", osastavExampleEn: "I am looking for the entrance." } },
                    { word: "exit", translation: "väljapääs", pronunciation: "VÄHL-yah-paes", cases: { nimetav: "väljapääs", nimetavExample: "Väljapääs on sealt.", nimetavExampleEn: "The exit is over there.", omastav: "väljapääsu", omastavExample: "Väljapääsu uks on roheline.", omastavExampleEn: "The exit door is green.", osastav: "väljapääsu", osastavExample: "Ma ei leia väljapääsu.", osastavExampleEn: "I cannot find the exit." } }
                ]
            },
            {
                category: "Places",
                words: [
                    { word: "city center", translation: "kesklinn", pronunciation: "KESK-linn", cases: { nimetav: "kesklinn", nimetavExample: "Kesklinn on ilus.", nimetavExampleEn: "The city center is beautiful.", omastav: "kesklinna", omastavExample: "Kesklinna tänavad on kitsad.", omastavExampleEn: "The streets of the city center are narrow.", osastav: "kesklinna", osastavExample: "Ma külastan kesklinna.", osastavExampleEn: "I visit the city center." } },
                    { word: "school", translation: "kool", pronunciation: "kohl", cases: { nimetav: "kool", nimetavExample: "Kool on lähedal.", nimetavExampleEn: "The school is nearby.", omastav: "kooli", omastavExample: "Kooli direktor on range.", omastavExampleEn: "The school principal is strict.", osastav: "kooli", osastavExample: "Laps läheb kooli.", osastavExampleEn: "The child goes to school." } },
                    { word: "university", translation: "ülikool", pronunciation: "Ü-lee-kohl", cases: { nimetav: "ülikool", nimetavExample: "Ülikool on suur.", nimetavExampleEn: "The university is big.", omastav: "ülikooli", omastavExample: "Ülikooli hoone on vana.", omastavExampleEn: "The university building is old.", osastav: "ülikooli", osastavExample: "Ma lõpetasin ülikooli.", osastavExampleEn: "I graduated from university." } },
                    { word: "hospital", translation: "haigla", pronunciation: "HAH-eeg-lah", cases: { nimetav: "haigla", nimetavExample: "Haigla on avatud.", nimetavExampleEn: "The hospital is open.", omastav: "haigla", omastavExample: "Haigla arstid on head.", omastavExampleEn: "The hospital doctors are good.", osastav: "haiglat", osastavExample: "Ma otsin haiglat.", osastavExampleEn: "I am looking for the hospital." } },
                    { word: "airport", translation: "lennujaam", pronunciation: "LEN-noo-yahm", cases: { nimetav: "lennujaam", nimetavExample: "Lennujaam on kaugel.", nimetavExampleEn: "The airport is far away.", omastav: "lennujaama", omastavExample: "Lennujaama terminal on uus.", omastavExampleEn: "The airport terminal is new.", osastav: "lennujaama", osastavExample: "Ma otsin lennujaama.", osastavExampleEn: "I am looking for the airport." } },
                    { word: "train station", translation: "rongijaam", pronunciation: "RON-gee-yahm", cases: { nimetav: "rongijaam", nimetavExample: "Rongijaam on vana.", nimetavExampleEn: "The train station is old.", omastav: "rongijaama", omastavExample: "Rongijaama kell on katki.", omastavExampleEn: "The train station clock is broken.", osastav: "rongijaama", osastavExample: "Ma näen rongijaama.", osastavExampleEn: "I see the train station." } },
                    { word: "bus stop", translation: "bussipeatus", pronunciation: "BOOS-see-peh-ah-toos", cases: { nimetav: "bussipeatus", nimetavExample: "Bussipeatus on nurga taga.", nimetavExampleEn: "The bus stop is around the corner.", omastav: "bussipeatuse", omastavExample: "Bussipeatuse pink on märg.", omastavExampleEn: "The bus stop bench is wet.", osastav: "bussipeatust", osastavExample: "Ma otsin bussipeatust.", osastavExampleEn: "I am looking for the bus stop." } },
                    { word: "restaurant", translation: "restoran", pronunciation: "RES-toh-rahn", cases: { nimetav: "restoran", nimetavExample: "Restoran on kallis.", nimetavExampleEn: "The restaurant is expensive.", omastav: "restorani", omastavExample: "Restorani menüü on lai.", omastavExampleEn: "The restaurant menu is wide.", osastav: "restorani", osastavExample: "Ma soovitan seda restorani.", osastavExampleEn: "I recommend this restaurant." } },
                    { word: "café", translation: "kohvik", pronunciation: "KOH-veek", cases: { nimetav: "kohvik", nimetavExample: "Kohvik on hubane.", nimetavExampleEn: "The café is cozy.", omastav: "kohviku", omastavExample: "Kohviku kohv on hea.", omastavExampleEn: "The café's coffee is good.", osastav: "kohvikut", osastavExample: "Ma külastan seda kohvikut.", osastavExampleEn: "I visit this café." } },
                    { word: "park", translation: "park", pronunciation: "pahrk", cases: { nimetav: "park", nimetavExample: "Park on roheline.", nimetavExampleEn: "The park is green.", omastav: "pargi", omastavExample: "Pargi puud on kõrged.", omastavExampleEn: "The park trees are tall.", osastav: "parki", osastavExample: "Ma lähen parki.", osastavExampleEn: "I go to the park." } }
                ]
            },
            {
                category: "Food & Drink",
                words: [
                    { word: "bread", translation: "leib", pronunciation: "lehb", cases: { nimetav: "leib", nimetavExample: "Leib on värske.", nimetavExampleEn: "The bread is fresh.", omastav: "leiva", omastavExample: "Leiva lõhn on hea.", omastavExampleEn: "The smell of bread is good.", osastav: "leiba", osastavExample: "Ma ostan leiba.", osastavExampleEn: "I buy bread." } },
                    { word: "butter", translation: "või", pronunciation: "vöi", cases: { nimetav: "või", nimetavExample: "Või on pehme.", nimetavExampleEn: "The butter is soft.", omastav: "või", omastavExample: "Või maitse on hea.", omastavExampleEn: "The taste of butter is good.", osastav: "võid", osastavExample: "Ma panen leivale võid.", osastavExampleEn: "I put butter on bread." } },
                    { word: "cheese", translation: "juust", pronunciation: "yoost", cases: { nimetav: "juust", nimetavExample: "Juust on kollane.", nimetavExampleEn: "The cheese is yellow.", omastav: "juustu", omastavExample: "Juustu hind on tõusnud.", omastavExampleEn: "The price of cheese has risen.", osastav: "juustu", osastavExample: "Ma söön juustu.", osastavExampleEn: "I eat cheese." } },
                    { word: "water", translation: "vesi", pronunciation: "VEH-see", cases: { nimetav: "vesi", nimetavExample: "Vesi on puhas.", nimetavExampleEn: "The water is clean.", omastav: "vee", omastavExample: "Vee temperatuur on madal.", omastavExampleEn: "The water temperature is low.", osastav: "vett", osastavExample: "Ma joon vett.", osastavExampleEn: "I drink water." } },
                    { word: "coffee", translation: "kohv", pronunciation: "kohv", cases: { nimetav: "kohv", nimetavExample: "Kohv on kuum.", nimetavExampleEn: "The coffee is hot.", omastav: "kohvi", omastavExample: "Kohvi aroom on tugev.", omastavExampleEn: "The aroma of coffee is strong.", osastav: "kohvi", osastavExample: "Ma joon kohvi.", osastavExampleEn: "I drink coffee." } },
                    { word: "tea", translation: "tee", pronunciation: "teh", cases: { nimetav: "tee", nimetavExample: "Tee on magus.", nimetavExampleEn: "The tea is sweet.", omastav: "tee", omastavExample: "Tee värv on kuldne.", omastavExampleEn: "The color of tea is golden.", osastav: "teed", osastavExample: "Ma joon teed.", osastavExampleEn: "I drink tea." } },
                    { word: "apple", translation: "õun", pronunciation: "öwn", cases: { nimetav: "õun", nimetavExample: "Õun on punane.", nimetavExampleEn: "The apple is red.", omastav: "õuna", omastavExample: "Õuna maitse on magus.", omastavExampleEn: "The taste of the apple is sweet.", osastav: "õuna", osastavExample: "Ma söön õuna.", osastavExampleEn: "I eat an apple." } },
                    { word: "potato", translation: "kartul", pronunciation: "KAHR-tool", cases: { nimetav: "kartul", nimetavExample: "Kartul on tervislilk.", nimetavExampleEn: "The potato is healthy.", omastav: "kartuli", omastavExample: "Kartuli koor on õhuke.", omastavExampleEn: "The potato peel is thin.", osastav: "kartulit", osastavExample: "Ma koorin kartulit.", osastavExampleEn: "I peel a potato." } },
                    { word: "meat", translation: "liha", pronunciation: "LEE-hah", cases: { nimetav: "liha", nimetavExample: "Liha on värske.", nimetavExampleEn: "The meat is fresh.", omastav: "liha", omastavExample: "Liha hind on kõrge.", omastavExampleEn: "The price of meat is high.", osastav: "liha", osastavExample: "Ma ostan liha.", osastavExampleEn: "I buy meat." } },
                    { word: "fish", translation: "kala", pronunciation: "KAH-lah", cases: { nimetav: "kala", nimetavExample: "Kala on tervislik.", nimetavExampleEn: "Fish is healthy.", omastav: "kala", omastavExample: "Kala lõhn on tugev.", omastavExampleEn: "The smell of fish is strong.", osastav: "kala", osastavExample: "Ma söön kala.", osastavExampleEn: "I eat fish." } },
                    { word: "soup", translation: "supp", pronunciation: "sopp", cases: { nimetav: "supp", nimetavExample: "Supp on kuum.", nimetavExampleEn: "The soup is hot.", omastav: "supi", omastavExample: "Supi maitse on hea.", omastavExampleEn: "The taste of the soup is good.", osastav: "suppi", osastavExample: "Ma söön suppi.", osastavExampleEn: "I eat soup." } },
                    { word: "beer", translation: "õlu", pronunciation: "Õ-loo", cases: { nimetav: "õlu", nimetavExample: "Õlu on külm.", nimetavExampleEn: "The beer is cold.", omastav: "õlle", omastavExample: "Õlle vaht on paks.", omastavExampleEn: "The beer foam is thick.", osastav: "õlut", osastavExample: "Ma joon õlut.", osastavExampleEn: "I drink beer." } },
                    { word: "wine", translation: "vein", pronunciation: "vein", cases: { nimetav: "vein", nimetavExample: "Vein on punane.", nimetavExampleEn: "The wine is red.", omastav: "veini", omastavExample: "Veini maitse on kuiv.", omastavExampleEn: "The taste of the wine is dry.", osastav: "veini", osastavExample: "Ma joon veini.", osastavExampleEn: "I drink wine." } }
                ]
            },
            {
                category: "Verbs (Most Common)",
                words: [
                    { word: "to be", translation: "olema", pronunciation: "OH-leh-mah" },
                    { word: "to go", translation: "minema", pronunciation: "MEE-neh-mah" },
                    { word: "to come", translation: "tulema", pronunciation: "TOO-leh-mah" },
                    { word: "to do / make", translation: "tegema", pronunciation: "TEH-geh-mah" },
                    { word: "to give", translation: "andma", pronunciation: "AHND-mah" },
                    { word: "to take", translation: "võtma", pronunciation: "VÕT-mah" },
                    { word: "to see", translation: "nägema", pronunciation: "NAE-geh-mah" },
                    { word: "to hear", translation: "kuulma", pronunciation: "KOOL-mah" },
                    { word: "to speak", translation: "rääkima", pronunciation: "RAAE-kee-mah" },
                    { word: "to learn", translation: "õppima", pronunciation: "ÕP-pee-mah" },
                    { word: "to work", translation: "töötama", pronunciation: "TÖÖ-tah-mah" },
                    { word: "to live", translation: "elama", pronunciation: "EH-lah-mah" },
                    { word: "to eat", translation: "sööma", pronunciation: "SÖÖ-mah" },
                    { word: "to drink", translation: "jooma", pronunciation: "YOH-mah" }
                ]
            },
            {
                category: "Adjectives",
                words: [
                    { word: "big / tall", translation: "suur", pronunciation: "soor", cases: { nimetav: "suur", nimetavExample: "Suur maja on kallis.", nimetavExampleEn: "A big house is expensive.", omastav: "suure", omastavExample: "Suure maja aed on ilus.", omastavExampleEn: "The garden of the big house is beautiful.", osastav: "suurt", osastavExample: "Ma näen suurt maja.", osastavExampleEn: "I see a big house." } },
                    { word: "small", translation: "väike", pronunciation: "VAE-ee-keh", cases: { nimetav: "väike", nimetavExample: "Väike laps mängib.", nimetavExampleEn: "A small child is playing.", omastav: "väikese", omastavExample: "Väikese lapse naer on armas.", omastavExampleEn: "The laugh of a small child is cute.", osastav: "väikest", osastavExample: "Ma näen väikest koera.", osastavExampleEn: "I see a small dog." } },
                    { word: "long / tall", translation: "pikk", pronunciation: "pikk", cases: { nimetav: "pikk", nimetavExample: "Pikk tee viib metsa.", nimetavExampleEn: "A long road leads to the forest.", omastav: "pika", omastavExample: "Pika tee lõpus on järv.", omastavExampleEn: "At the end of the long road is a lake.", osastav: "pikka", osastavExample: "Ma kõnnin pikka teed.", osastavExampleEn: "I walk a long road." } },
                    { word: "short", translation: "lühike", pronunciation: "LÜ-hee-keh", cases: { nimetav: "lühike", nimetavExample: "Lühike jutt on selge.", nimetavExampleEn: "A short story is clear.", omastav: "lühikese", omastavExample: "Lühikese jutu mõte on lihtne.", omastavExampleEn: "The meaning of a short story is simple.", osastav: "lühikest", osastavExample: "Ma loen lühikest juttu.", osastavExampleEn: "I read a short story." } },
                    { word: "beautiful", translation: "ilus", pronunciation: "EE-loos", cases: { nimetav: "ilus", nimetavExample: "Ilus ilm on täna.", nimetavExampleEn: "The weather is beautiful today.", omastav: "ilusa", omastavExample: "Ilusa ilmaga lähen jalutama.", omastavExampleEn: "In beautiful weather I go for a walk.", osastav: "ilusat", osastavExample: "Ma näen ilusat päikeseloojangut.", osastavExampleEn: "I see a beautiful sunset." } },
                    { word: "ugly", translation: "kole", pronunciation: "KOH-leh", cases: { nimetav: "kole", nimetavExample: "Kole ilm on väljas.", nimetavExampleEn: "The weather outside is ugly.", omastav: "koleda", omastavExample: "Koleda ilmaga jään koju.", omastavExampleEn: "In ugly weather I stay home.", osastav: "koledat", osastavExample: "Ma ei taha koledat ilma.", osastavExampleEn: "I don't want ugly weather." } },
                    { word: "good", translation: "hea", pronunciation: "heh-ah", cases: { nimetav: "hea", nimetavExample: "Hea raamat on hariv.", nimetavExampleEn: "A good book is educational.", omastav: "hea", omastavExample: "Hea raamatu leidmine on raske.", omastavExampleEn: "Finding a good book is hard.", osastav: "head", osastavExample: "Ma loen head raamatut.", osastavExampleEn: "I read a good book." } },
                    { word: "bad", translation: "halb", pronunciation: "hahlb", cases: { nimetav: "halb", nimetavExample: "Halb ilm on tüütu.", nimetavExampleEn: "Bad weather is annoying.", omastav: "halva", omastavExample: "Halva ilma tõttu jäin koju.", omastavExampleEn: "Because of bad weather I stayed home.", osastav: "halba", osastavExample: "Ma ei taha halba tulemust.", osastavExampleEn: "I don't want a bad result." } },
                    { word: "new", translation: "uus", pronunciation: "oos", cases: { nimetav: "uus", nimetavExample: "Uus auto on kiire.", nimetavExampleEn: "The new car is fast.", omastav: "uue", omastavExample: "Uue auto hind on kõrge.", omastavExampleEn: "The price of the new car is high.", osastav: "uut", osastavExample: "Ma ostan uut autot.", osastavExampleEn: "I buy a new car." } },
                    { word: "old", translation: "vana", pronunciation: "VAH-nah", cases: { nimetav: "vana", nimetavExample: "Vana maja on hubane.", nimetavExampleEn: "The old house is cozy.", omastav: "vana", omastavExample: "Vana maja seinad on paksud.", omastavExampleEn: "The walls of the old house are thick.", osastav: "vana", osastavExample: "Ma remondin vana maja.", osastavExampleEn: "I renovate the old house." } },
                    { word: "fast", translation: "kiire", pronunciation: "KEE-reh", cases: { nimetav: "kiire", nimetavExample: "Kiire rong saabub.", nimetavExampleEn: "The fast train arrives.", omastav: "kiire", omastavExample: "Kiire rongi pilet on kallim.", omastavExampleEn: "The ticket for the fast train is more expensive.", osastav: "kiiret", osastavExample: "Ma oota kiiret rongi.", osastavExampleEn: "I wait for the fast train." } },
                    { word: "slow", translation: "aeglane", pronunciation: "AYEG-lah-neh", cases: { nimetav: "aeglane", nimetavExample: "Aeglane jalutuskäik on mõnus.", nimetavExampleEn: "A slow walk is pleasant.", omastav: "aeglase", omastavExample: "Aeglase tempo eelised on suured.", omastavExampleEn: "The advantages of a slow pace are great.", osastav: "aeglast", osastavExample: "Ma eelistan aeglast tempot.", osastavExampleEn: "I prefer a slow pace." } },
                    { word: "expensive", translation: "kallis", pronunciation: "KAHL-lees", cases: { nimetav: "kallis", nimetavExample: "Kallis restoran on populaarne.", nimetavExampleEn: "An expensive restaurant is popular.", omastav: "kalli", omastavExample: "Kalli restorani toit on maitsev.", omastavExampleEn: "The food of the expensive restaurant is tasty.", osastav: "kallist", osastavExample: "Ma väldin kallist restorani.", osastavExampleEn: "I avoid the expensive restaurant." } },
                    { word: "cheap", translation: "odav", pronunciation: "OH-dahv", cases: { nimetav: "odav", nimetavExample: "Odav kohvik on populaarne.", nimetavExampleEn: "A cheap café is popular.", omastav: "odava", omastavExample: "Odava kohviku kohv on hea.", omastavExampleEn: "The coffee of the cheap café is good.", osastav: "odavat", osastavExample: "Ma otsin odavat kohvikut.", osastavExampleEn: "I am looking for a cheap café." } }
                ]
            },
            {
                category: "Time & Frequency",
                words: [
                    { word: "today", translation: "täna", pronunciation: "TAE-nah" },
                    { word: "tomorrow", translation: "homme", pronunciation: "HOM-meh" },
                    { word: "yesterday", translation: "eile", pronunciation: "EH-ee-leh" },
                    { word: "now", translation: "nüüd", pronunciation: "nüüd" },
                    { word: "soon", translation: "varsti", pronunciation: "VAHRS-tee" },
                    { word: "always", translation: "alati", pronunciation: "AH-lah-tee" },
                    { word: "sometimes", translation: "mõnikord", pronunciation: "MÕ-nee-kohrd" },
                    { word: "rarely", translation: "harva", pronunciation: "HAHR-vah" },
                    { word: "already", translation: "juba", pronunciation: "YOO-bah" },
                    { word: "still", translation: "veel", pronunciation: "vehl" }
                ]
            },
            {
                category: "Family",
                words: [
                    { word: "mother", translation: "ema", pronunciation: "EH-mah", cases: { nimetav: "ema", nimetavExample: "Ema teeb süüa.", nimetavExampleEn: "Mother is cooking.", omastav: "ema", omastavExample: "Ema nõu on alati hea.", omastavExampleEn: "Mother's advice is always good.", osastav: "ema", osastavExample: "Ma kutsun ema külla.", osastavExampleEn: "I invite mother to visit." } },
                    { word: "father", translation: "isa", pronunciation: "EE-sah", cases: { nimetav: "isa", nimetavExample: "Isa töötab kontoris.", nimetavExampleEn: "Father works in an office.", omastav: "isa", omastavExample: "Isa auto on sinine.", omastavExampleEn: "Father's car is blue.", osastav: "isa", osastavExample: "Ma aitan isa.", osastavExampleEn: "I help father." } },
                    { word: "brother", translation: "vend", pronunciation: "vend", cases: { nimetav: "vend", nimetavExample: "Vend on noorem.", nimetavExampleEn: "The brother is younger.", omastav: "venna", omastavExample: "Venna tuba on suur.", omastavExampleEn: "The brother's room is big.", osastav: "venda", osastavExample: "Ma ootan venda.", osastavExampleEn: "I wait for my brother." } },
                    { word: "sister", translation: "õde", pronunciation: "Õ-deh", cases: { nimetav: "õde", nimetavExample: "Õde elab Tartus.", nimetavExampleEn: "The sister lives in Tartu.", omastav: "õe", omastavExample: "Õe sünnipäev on homme.", omastavExampleEn: "The sister's birthday is tomorrow.", osastav: "õde", osastavExample: "Ma helistan õele.", osastavExampleEn: "I call my sister." } },
                    { word: "child", translation: "laps", pronunciation: "lahps", cases: { nimetav: "laps", nimetavExample: "Laps mängib õues.", nimetavExampleEn: "The child plays outside.", omastav: "lapse", omastavExample: "Lapse naer on nakkav.", omastavExampleEn: "The child's laughter is contagious.", osastav: "last", osastavExample: "Ma vaatan last.", osastavExampleEn: "I watch the child." } },
                    { word: "son", translation: "poeg", pronunciation: "poeg", cases: { nimetav: "poeg", nimetavExample: "Poeg käib koolis.", nimetavExampleEn: "The son goes to school.", omastav: "poja", omastavExample: "Poja hinded on head.", omastavExampleEn: "The son's grades are good.", osastav: "poega", osastavExample: "Ma kiidan poega.", osastavExampleEn: "I praise my son." } },
                    { word: "daughter", translation: "tütar", pronunciation: "TÜ-tahr", cases: { nimetav: "tütar", nimetavExample: "Tütar õpib ülikoolis.", nimetavExampleEn: "The daughter studies at university.", omastav: "tütre", omastavExample: "Tütre unistus on reisida.", omastavExampleEn: "The daughter's dream is to travel.", osastav: "tütart", osastavExample: "Ma toetan tütart.", osastavExampleEn: "I support my daughter." } },
                    { word: "grandmother", translation: "vanaema", pronunciation: "VAH-nah-eh-mah", cases: { nimetav: "vanaema", nimetavExample: "Vanaema küpsetab kooki.", nimetavExampleEn: "Grandmother bakes cake.", omastav: "vanaema", omastavExample: "Vanaema kook on maitsev.", omastavExampleEn: "Grandmother's cake is delicious.", osastav: "vanaema", osastavExample: "Ma külastan vanaema.", osastavExampleEn: "I visit grandmother." } },
                    { word: "grandfather", translation: "vanaisa", pronunciation: "VAH-nah-ee-sah", cases: { nimetav: "vanaisa", nimetavExample: "Vanaisa elab maal.", nimetavExampleEn: "Grandfather lives in the countryside.", omastav: "vanaisa", omastavExample: "Vanaisa lood on huvitavad.", omastavExampleEn: "Grandfather's stories are interesting.", osastav: "vanaisa", osastavExample: "Ma kuulan vanaisa.", osastavExampleEn: "I listen to grandfather." } }
                ]
            },
            {
                category: "Body Parts",
                words: [
                    { word: "head", translation: "pea", pronunciation: "peh-ah", cases: { nimetav: "pea", nimetavExample: "Pea valutab.", nimetavExampleEn: "The head hurts.", omastav: "pea", omastavExample: "Pea tagant vaatab keegi.", omastavExampleEn: "Someone is looking from behind the head.", osastav: "pead", osastavExample: "Ma hoian pead.", osastavExampleEn: "I hold my head." } },
                    { word: "hand", translation: "käsi", pronunciation: "KAE-see", cases: { nimetav: "käsi", nimetavExample: "Käsi on külm.", nimetavExampleEn: "The hand is cold.", omastav: "käe", omastavExample: "Käe sõrmed on pikad.", omastavExampleEn: "The fingers of the hand are long.", osastav: "kätt", osastavExample: "Ma pesen kätt.", osastavExampleEn: "I wash my hand." } },
                    { word: "leg / foot", translation: "jalg", pronunciation: "yahlg", cases: { nimetav: "jalg", nimetavExample: "Jalg on haige.", nimetavExampleEn: "The leg is sore.", omastav: "jala", omastavExample: "Jala luu on murdunud.", omastavExampleEn: "The leg bone is broken.", osastav: "jalga", osastavExample: "Ma masseerin jalga.", osastavExampleEn: "I massage my leg." } },
                    { word: "eye", translation: "silm", pronunciation: "silm", cases: { nimetav: "silm", nimetavExample: "Silm on sinine.", nimetavExampleEn: "The eye is blue.", omastav: "silma", omastavExample: "Silma värv on ilus.", omastavExampleEn: "The color of the eye is beautiful.", osastav: "silma", osastavExample: "Ma sulgen silma.", osastavExampleEn: "I close my eye." } },
                    { word: "mouth", translation: "suu", pronunciation: "soo", cases: { nimetav: "suu", nimetavExample: "Suu on avatud.", nimetavExampleEn: "The mouth is open.", omastav: "suu", omastavExample: "Suu ümber on punane.", omastavExampleEn: "Around the mouth is red.", osastav: "suud", osastavExample: "Ma avan suud.", osastavExampleEn: "I open my mouth." } },
                    { word: "nose", translation: "nina", pronunciation: "NEE-nah", cases: { nimetav: "nina", nimetavExample: "Nina on punane.", nimetavExampleEn: "The nose is red.", omastav: "nina", omastavExample: "Nina ots on külm.", omastavExampleEn: "The tip of the nose is cold.", osastav: "nina", osastavExample: "Ma puudutan nina.", osastavExampleEn: "I touch my nose." } },
                    { word: "ear", translation: "kõrv", pronunciation: "kõrv", cases: { nimetav: "kõrv", nimetavExample: "Kõrv valutab.", nimetavExampleEn: "The ear hurts.", omastav: "kõrva", omastavExample: "Kõrva taga on haav.", omastavExampleEn: "Behind the ear is a wound.", osastav: "kõrva", osastavExample: "Ma katan kõrva.", osastavExampleEn: "I cover my ear." } },
                    { word: "stomach", translation: "kõht", pronunciation: "kõht", cases: { nimetav: "kõht", nimetavExample: "Kõht on täis.", nimetavExampleEn: "The stomach is full.", omastav: "kõhu", omastavExample: "Kõhu valu on tugev.", omastavExampleEn: "The stomach pain is strong.", osastav: "kõhtu", osastavExample: "Ma hoian kõhtu.", osastavExampleEn: "I hold my stomach." } }
                ]
            }
        ]
    },
    // A2 Level Lessons
    {
        id: 5,
        title: "A2: Everyday Conversations",
        level: "A2",
        language: "et-EE",
        description: "Common phrases and expressions for daily situations",
        content: [
            {
                category: "Shopping & Services",
                words: [
                    { word: "How much does this cost?", translation: "Kui palju see maksab?", pronunciation: "KOO-ee PAHL-yoo seh MAHK-sahb", grammar: "'Kui palju' is used for quantities and prices", example: "Kui palju see kleit maksab? - See maksab 25 eurot.", exampleTranslation: "How much does this dress cost? - It costs 25 euros." },
                    { word: "I would like to buy", translation: "Ma tahaksin osta", pronunciation: "mah TAH-hahk-seen OSS-tah", grammar: "'Tahaksin' is conditional form, more polite", example: "Ma tahaksin osta uue telefoni.", exampleTranslation: "I would like to buy a new phone." },
                    { word: "Can I pay by card?", translation: "Kas ma saan kaardiga maksta?", pronunciation: "kahs mah sahn KAHR-dee-gah MAHK-stah", example: "Kas ma saan kaardiga maksta?", exampleTranslation: "Can I pay by card?" },
                    { word: "receipt", translation: "kviitung", pronunciation: "KVEE-toong", example: "Kas ma saan kviitungi?", exampleTranslation: "Can I get a receipt?" },
                    { word: "expensive", translation: "kallis", pronunciation: "KAHL-liss", example: "See on väga kallis.", exampleTranslation: "This is very expensive." },
                    { word: "cheap", translation: "odav", pronunciation: "OH-dahv", example: "See pood on odavam.", exampleTranslation: "This store is cheaper." },
                    { word: "discount", translation: "allahindlus", pronunciation: "AHL-lah-heend-looss", example: "Kas teil on allahindlust?", exampleTranslation: "Do you have a discount?" }
                ]
            },
            {
                category: "Work & Profession",
                words: [
                    { word: "I work as", translation: "Ma töötan", pronunciation: "mah TØØ-tahn", example: "Ma töötan programmeerijana.", exampleTranslation: "I work as a programmer." },
                    { word: "company", translation: "ettevõte", pronunciation: "EHT-teh-vuh-teh", example: "Ma töötan suures ettevõttes.", exampleTranslation: "I work in a large company." },
                    { word: "colleague", translation: "kolleeg", pronunciation: "KOHL-lehg", example: "Minu kolleegid on sõbralikud.", exampleTranslation: "My colleagues are friendly." },
                    { word: "meeting", translation: "koosolek", pronunciation: "KOH-soh-lehk", example: "Mul on täna koosolek.", exampleTranslation: "I have a meeting today." },
                    { word: "salary", translation: "palk", pronunciation: "pahlk", example: "Minu palk on hea.", exampleTranslation: "My salary is good." }
                ]
            },
            {
                category: "Health & Medical",
                words: [
                    { word: "I feel sick", translation: "Ma tunnen end halvasti", pronunciation: "mah TOON-nehn ehnd HAHL-vahs-tee", example: "Ma tunnen end halvasti.", exampleTranslation: "I feel sick." },
                    { word: "doctor", translation: "arst", pronunciation: "ahrst", example: "Ma lähen arsti juurde.", exampleTranslation: "I'm going to the doctor." },
                    { word: "pharmacy", translation: "apteek", pronunciation: "ahp-TEHK", example: "Kus on lähim apteek?", exampleTranslation: "Where is the nearest pharmacy?" },
                    { word: "medicine", translation: "ravim", pronunciation: "RAH-veem", example: "Ma võtan seda ravimit.", exampleTranslation: "I take this medicine." },
                    { word: "headache", translation: "peavalu", pronunciation: "PEH-ah-VAH-loo", example: "Mul on peavalu.", exampleTranslation: "I have a headache." }
                ]
            },
            {
                category: "Transportation",
                words: [
                    { word: "bus station", translation: "bussijaam", pronunciation: "BOOS-see-yahm", example: "Kus on bussijaam?", exampleTranslation: "Where is the bus station?" },
                    { word: "train", translation: "rong", pronunciation: "rohng", example: "Ma sõidan rongiga.", exampleTranslation: "I'm traveling by train." },
                    { word: "ticket", translation: "pilet", pronunciation: "PEE-leht", example: "Üks pilet, palun.", exampleTranslation: "One ticket, please." },
                    { word: "timetable", translation: "sõiduplaan", pronunciation: "SØI-doo-plahn", example: "Kus on sõiduplaan?", exampleTranslation: "Where is the timetable?" },
                    { word: "to arrive", translation: "saabuma", pronunciation: "SAH-boo-mah", example: "Buss saabub varsti.", exampleTranslation: "The bus arrives soon." }
                ]
            }
        ]
    },
    {
        id: 6,
        title: "A2: Grammar & Structure",
        level: "A2",
        language: "et-EE",
        description: "Essential grammar patterns and sentence structures",
        content: [
            {
                category: "Time Expressions",
                words: [
                    { word: "yesterday", translation: "eile", pronunciation: "EY-leh", example: "Eile käisin kinos.", exampleTranslation: "Yesterday I went to the cinema." },
                    { word: "today", translation: "täna", pronunciation: "TAE-nah", example: "Täna on ilus ilm.", exampleTranslation: "Today the weather is nice." },
                    { word: "tomorrow", translation: "homme", pronunciation: "HOHM-meh", example: "Homme lähen arsti juurde.", exampleTranslation: "Tomorrow I'm going to the doctor." },
                    { word: "next week", translation: "järgmine nädal", pronunciation: "JAER-gee-mee-neh NAE-dahl", example: "Järgmisel nädalal alustan tööd.", exampleTranslation: "Next week I start work." },
                    { word: "in the morning", translation: "hommikul", pronunciation: "HOHM-mee-kool", example: "Ma ärkan hommikul.", exampleTranslation: "I wake up in the morning." },
                    { word: "in the evening", translation: "õhtul", pronunciation: "UH-htool", example: "Õhtul loen raamatut.", exampleTranslation: "In the evening I read a book." }
                ]
            },
            {
                category: "Modal Verbs",
                words: [
                    { word: "I can", translation: "Ma saan / Ma võin", pronunciation: "mah sahn / mah vuh-een", grammar: "'Saan' = ability, 'Võin' = permission", example: "Ma saan eesti keelt rääkida.", exampleTranslation: "I can speak Estonian." },
                    { word: "I must", translation: "Ma pean", pronunciation: "mah peh-ahn", grammar: "Strong obligation", example: "Ma pean tööle minema.", exampleTranslation: "I must go to work." },
                    { word: "I want", translation: "Ma tahan", pronunciation: "mah TAH-hahn", example: "Ma tahan õppida.", exampleTranslation: "I want to learn." },
                    { word: "I should", translation: "Ma peaks", pronunciation: "mah pehks", example: "Ma peaks rohkem õppima.", exampleTranslation: "I should study more." },
                    { word: "I need", translation: "Ma vajan", pronunciation: "mah VAH-yahn", example: "Ma vajan abi.", exampleTranslation: "I need help." }
                ]
            }
        ]
    },
    // B1 Level Lessons
    {
        id: 7,
        title: "B1: Complex Situations",
        level: "B1",
        language: "et-EE",
        description: "Advanced conversations and complex topics",
        content: [
            {
                category: "Opinions & Arguments",
                words: [
                    { word: "In my opinion", translation: "Minu arvates", pronunciation: "MEE-noo AHR-vah-tehs", example: "Minu arvates on see hea plaan.", exampleTranslation: "In my opinion, this is a good plan." },
                    { word: "I agree", translation: "Ma nõustun", pronunciation: "mah NUH-oos-toon", example: "Ma nõustun sinuga.", exampleTranslation: "I agree with you." },
                    { word: "I disagree", translation: "Ma ei nõustu", pronunciation: "mah ey NUH-oos-too", example: "Ma ei nõustu sellega.", exampleTranslation: "I disagree with this." },
                    { word: "On the one hand", translation: "Ühelt poolt", pronunciation: "OO-hehlt pohlt", example: "Ühelt poolt on see kallis.", exampleTranslation: "On the one hand it's expensive." },
                    { word: "On the other hand", translation: "Teiselt poolt", pronunciation: "TEY-sehlt pohlt", example: "Teiselt poolt on see kvaliteetne.", exampleTranslation: "On the other hand it's quality." },
                    { word: "However", translation: "Siiski", pronunciation: "SEE-skee", example: "Ma olen väsinud. Siiski lähen trenni.", exampleTranslation: "I am tired. However, I will go to training." },
                    { word: "Although", translation: "Kuigi", pronunciation: "KOO-ee-gee", example: "Kuigi oli külm, läksime jalutama.", exampleTranslation: "Although it was cold, we went for a walk." }
                ]
            },
            {
                category: "Professional Life",
                words: [
                    { word: "to apply for a job", translation: "tööle kandideerima", pronunciation: "TØØ-leh kahn-dee-DEH-ree-mah", example: "Ma kandideerin selle ametikoha peale.", exampleTranslation: "I am applying for this position." },
                    { word: "curriculum vitae (CV)", translation: "elulookirjeldus", pronunciation: "EH-loo-loh-keer-yel-doos", example: "Palun saatke oma elulookirjeldus.", exampleTranslation: "Please send your CV." },
                    { word: "interview", translation: "intervjuu", pronunciation: "een-tehr-VYOO", example: "Mul on homme tööintervjuu.", exampleTranslation: "I have a job interview tomorrow." },
                    { word: "responsibility", translation: "vastutus", pronunciation: "VAHS-too-toos", example: "See nõuab suurt vastutust.", exampleTranslation: "This requires great responsibility." },
                    { word: "deadline", translation: "tähtaeg", pronunciation: "TAEH-tah-ehg", example: "Tähtaeg on reede.", exampleTranslation: "The deadline is Friday." }
                ]
            },
            {
                category: "Social Issues",
                words: [
                    { word: "environment", translation: "keskkond", pronunciation: "KEHSK-kohnd", example: "Peame hoolitsema keskkonna eest.", exampleTranslation: "We must take care of the environment." },
                    { word: "climate change", translation: "kliima muutus", pronunciation: "KLEE-mah MOO-too-toos", example: "Kliima muutus mõjutab maailma.", exampleTranslation: "Climate change affects the world." },
                    { word: "society", translation: "ühiskond", pronunciation: "OO-hees-kohnd", example: "Haridus on ühiskonna alus.", exampleTranslation: "Education is the foundation of society." },
                    { word: "government", translation: "valitsus", pronunciation: "VAH-leet-soos", example: "Valitsus tegi otsuse.", exampleTranslation: "The government made a decision." },
                    { word: "democracy", translation: "demokraatia", pronunciation: "deh-moh-KRAH-tee-ah", example: "Eesti on demokraatlik riik.", exampleTranslation: "Estonia is a democratic country." }
                ]
            }
        ]
    },
    {
        id: 8,
        title: "B1: Advanced Grammar",
        level: "B1",
        language: "et-EE",
        description: "Complex grammatical structures and expressions",
        content: [
            {
                category: "Conjunctions & Connectors",
                words: [
                    { word: "because", translation: "sest / kuna", pronunciation: "sehst / KOO-nah", example: "Ma jäin koju, sest mul oli peavalu.", exampleTranslation: "I stayed home because I had a headache." },
                    { word: "if", translation: "kui", pronunciation: "koo-ee", example: "Kui sa tuled, anna mulle teada.", exampleTranslation: "If you come, let me know." },
                    { word: "while", translation: "ajal kui", pronunciation: "AH-yahl koo-ee", example: "Ma kuulasin muusikat ajal kui töötasin.", exampleTranslation: "I listened to music while working." },
                    { word: "in order to", translation: "et", pronunciation: "eht", example: "Ma õpin palju, et saada head tulemust.", exampleTranslation: "I study a lot in order to get good results." },
                    { word: "despite", translation: "vaatamata", pronunciation: "VAH-tah-mah-tah", example: "Vaatamata vihmale läksime jalutama.", exampleTranslation: "Despite the rain, we went for a walk." }
                ]
            },
            {
                category: "Abstract Concepts",
                words: [
                    { word: "possibility", translation: "võimalus", pronunciation: "VUH-ee-mah-loos", example: "On palju võimalusi.", exampleTranslation: "There are many possibilities." },
                    { word: "consequence", translation: "tagajärg", pronunciation: "TAH-gah-jaerg", example: "Iga otsusel on tagajärjed.", exampleTranslation: "Every decision has consequences." },
                    { word: "purpose", translation: "eesmärk", pronunciation: "EHS-maerk", example: "Minu eesmärk on õppida.", exampleTranslation: "My purpose is to learn." },
                    { word: "advantage", translation: "eelis", pronunciation: "EH-lees", example: "Keeleoskus on suur eelis.", exampleTranslation: "Language skills are a big advantage." },
                    { word: "influence", translation: "mõju", pronunciation: "MUH-yoo", example: "Tehnoloogia mõjutab meie elu.", exampleTranslation: "Technology influences our life." }
                ]
            }
        ]
    }
];
