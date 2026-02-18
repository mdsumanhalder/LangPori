import { Podcast } from '@/types';

// Sample Estonian podcast data with synchronized transcripts
export const podcastData: Podcast[] = [
    {
        id: 1,
        title: 'Tere! Esimene päev Eestis',
        titleEn: 'Hello! First Day in Estonia',
        description: 'Lihtne sissejuhatus eesti keelde. Õpi tervitusi ja põhilisi väljendeid.',
        descriptionEn: 'Simple introduction to Estonian. Learn greetings and basic expressions.',
        level: 'A1',
        duration: 45, // seconds
        audioUrl: '', // Will be generated via TTS in the component
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 5,
                estonian: 'Tere! Mina olen Anna.',
                english: 'Hello! I am Anna.'
            },
            {
                id: 2,
                startTime: 5,
                endTime: 10,
                estonian: 'Kuidas sul läheb?',
                english: 'How are you doing?'
            },
            {
                id: 3,
                startTime: 10,
                endTime: 15,
                estonian: 'Mul läheb hästi, aitäh.',
                english: 'I am doing well, thank you.'
            },
            {
                id: 4,
                startTime: 15,
                endTime: 20,
                estonian: 'Mis su nimi on?',
                english: 'What is your name?'
            },
            {
                id: 5,
                startTime: 20,
                endTime: 25,
                estonian: 'Minu nimi on Peeter.',
                english: 'My name is Peeter.'
            },
            {
                id: 6,
                startTime: 25,
                endTime: 32,
                estonian: 'Väga meeldiv sinuga tutvuda!',
                english: 'Very nice to meet you!'
            },
            {
                id: 7,
                startTime: 32,
                endTime: 38,
                estonian: 'Ma õpin eesti keelt.',
                english: 'I am learning Estonian.'
            },
            {
                id: 8,
                startTime: 38,
                endTime: 45,
                estonian: 'Näeme varsti! Head aega!',
                english: 'See you soon! Goodbye!'
            }
        ]
    },
    {
        id: 2,
        title: 'Kohvikus',
        titleEn: 'At the Café',
        description: 'Õpi, kuidas kohvikus tellida ja vestlust pidada.',
        descriptionEn: 'Learn how to order at a café and have a conversation.',
        level: 'A2',
        duration: 60,
        audioUrl: '',
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 5,
                estonian: 'Tere päevast! Kas ma võin teid aidata?',
                english: 'Good day! Can I help you?'
            },
            {
                id: 2,
                startTime: 5,
                endTime: 12,
                estonian: 'Jah, palun. Ma sooviksin ühe kohvi ja ühe saia.',
                english: 'Yes, please. I would like one coffee and one bun.'
            },
            {
                id: 3,
                startTime: 12,
                endTime: 18,
                estonian: 'Mis kohvi te soovite? Meil on espresso, cappuccino ja latte.',
                english: 'What coffee would you like? We have espresso, cappuccino and latte.'
            },
            {
                id: 4,
                startTime: 18,
                endTime: 24,
                estonian: 'Ma võtaksin ühe cappuccino, palun.',
                english: 'I would take one cappuccino, please.'
            },
            {
                id: 5,
                startTime: 24,
                endTime: 30,
                estonian: 'Väga hea. Kas soovite ka piima või suhkrut?',
                english: 'Very good. Would you also like milk or sugar?'
            },
            {
                id: 6,
                startTime: 30,
                endTime: 36,
                estonian: 'Ainult natuke suhkrut, tänan.',
                english: 'Just a little sugar, thank you.'
            },
            {
                id: 7,
                startTime: 36,
                endTime: 42,
                estonian: 'Suurepärane! See maksab viis eurot.',
                english: 'Excellent! That costs five euros.'
            },
            {
                id: 8,
                startTime: 42,
                endTime: 48,
                estonian: 'Kas ma saan kaardiga maksta?',
                english: 'Can I pay by card?'
            },
            {
                id: 9,
                startTime: 48,
                endTime: 54,
                estonian: 'Jah, loomulikult. Terminal on siin.',
                english: 'Yes, of course. The terminal is here.'
            },
            {
                id: 10,
                startTime: 54,
                endTime: 60,
                estonian: 'Aitäh väga! Head päeva!',
                english: 'Thank you very much! Have a good day!'
            }
        ]
    },
    {
        id: 3,
        title: 'Eesti kultuur ja traditsioonid',
        titleEn: 'Estonian Culture and Traditions',
        description: 'Avasta Eesti kultuuri ja olulisi traditsioone. Õpi rääkima kultuurist ja ajaloost.',
        descriptionEn: 'Discover Estonian culture and important traditions. Learn to talk about culture and history.',
        level: 'B1',
        duration: 75,
        audioUrl: '',
        transcript: [
            {
                id: 1,
                startTime: 0,
                endTime: 8,
                estonian: 'Eesti kultuur on väga rikas ja mitmekesine.',
                english: 'Estonian culture is very rich and diverse.'
            },
            {
                id: 2,
                startTime: 8,
                endTime: 16,
                estonian: 'Üks olulisemaid traditsioone on laulupidu, mis toimub iga viie aasta tagant.',
                english: 'One of the most important traditions is the song festival, which takes place every five years.'
            },
            {
                id: 3,
                startTime: 16,
                endTime: 24,
                estonian: 'Laulupeo ajal kogunevad tuhanded lauljad ja kümned tuhanded pealtvaatajad.',
                english: 'During the song festival, thousands of singers and tens of thousands of spectators gather.'
            },
            {
                id: 4,
                startTime: 24,
                endTime: 32,
                estonian: 'See traditsioon on UNESCO maailmapärandi nimekirjas.',
                english: 'This tradition is on the UNESCO World Heritage list.'
            },
            {
                id: 5,
                startTime: 32,
                endTime: 40,
                estonian: 'Eesti loodus on samuti imetlusväärne. Meil on palju metsi ja järvi.',
                english: 'Estonian nature is also admirable. We have many forests and lakes.'
            },
            {
                id: 6,
                startTime: 40,
                endTime: 48,
                estonian: 'Eestlased armastavad sauna ja paljud perekonnad omavad oma suvila.',
                english: 'Estonians love sauna and many families own their own summer cottage.'
            },
            {
                id: 7,
                startTime: 48,
                endTime: 56,
                estonian: 'Eesti on ka väga digitaalne riik. Meil on e-residentsus ja internetihääletamine.',
                english: 'Estonia is also a very digital country. We have e-residency and internet voting.'
            },
            {
                id: 8,
                startTime: 56,
                endTime: 64,
                estonian: 'Tallinnas on hästi säilinud keskaegne vanalinn.',
                english: 'Tallinn has a well-preserved medieval old town.'
            },
            {
                id: 9,
                startTime: 64,
                endTime: 75,
                estonian: 'Eesti keel kuulub soome-ugri keelkonda ja on lähedane soome keelele.',
                english: 'The Estonian language belongs to the Finno-Ugric language family and is close to Finnish.'
            }
        ]
    }
];

// Helper function to get podcasts by level
export function getPodcastsByLevel(level: 'A1' | 'A2' | 'B1'): Podcast[] {
    return podcastData.filter(p => p.level === level);
}

// Helper function to get podcast by ID
export function getPodcastById(id: number): Podcast | undefined {
    return podcastData.find(p => p.id === id);
}

// Helper function to get all levels
export function getAllLevels(): Array<'A1' | 'A2' | 'B1'> {
    return ['A1', 'A2', 'B1'];
}
