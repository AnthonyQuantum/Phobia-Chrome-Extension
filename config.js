// All data
CONFIG = {
    N: 3,
    CONSOLE_LOGGING: true,
    SENSITIVITY_FOR_IMAGE: 2,
    SENSITIVITY_FOR_TEXT: 10,
    SENSITIVITY_FOR_KEYWORD: 10,
    LOCAL_URL: 'http://localhost:5000/',
    HEROKU_URL: 'https://still-citadel-11543.herokuapp.com/',
    AWS_URL: 'http://phobia.us-east-2.elasticbeanstalk.com/',
    PHOBIAS: [
        { 
            title: 'Cynophobia',
            description: 'Dogs',
            keywords: ['dog', 'dogs', 'puppy', 'labrador',
             'retriever', 'kuvasz', 'pomeranian', 'beagle',
             'collie', 'bernard', 'spaniel', 'samoyed',
             'hound', "setter", 'terrier', 'shepherd',
             'canine', 'pooch', 'chihuahua', 'pekinese',
             'ridgeback', 'bulldog', 'setter',
             'pinscher', 'mastiff', 'boxer', 'husky',
             'dalmatian', 'pug', 'spitz', 'griffon',
             'corgi', 'poodle', 'deerhound', 'bloodhound',
             'wolfhound', 'chow']
            /*keywords_lang: {
                RU: ['собака', 'собаки', 'щенок'],
                DU: ['hond', 'honden', 'brak']
            }*/
        },
        { 
            title: 'Arachnophobia',
            description: 'Spiders',
            keywords: ['spider', 'arachnid', 'tarantula']
        },
        {
            title: 'Insectophobia',
            description: 'Insects',
            keywords: ['insect', 'spider', 'bug', 'pest', 'beetle', 'anthropod', 'fly', 'bee', 'worm', 'caterpillar',
             'ant', 'aphid', 'butterfly', 'cockroach', 'dragonfly', 'flea', 'grasshopper', 'ladybug', 'mite', 'mosquito',
             'moth', 'termite']
        },
        {
            title: 'Emetophobia',
            description: 'Vomit',
            keywords: ['vomit', 'puke', 'disgorge', 'spew']
        }
    ]
}

// TODO: add more filters and languages