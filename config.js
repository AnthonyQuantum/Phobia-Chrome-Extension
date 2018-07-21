// All data
CONFIG = {
    N: 3,
    CONSOLE_LOGGING: true,
    SENSITIVITY_FOR_IMAGE: 2,
    SENSITIVITY_FOR_TEXT: 10,
    LOCAL_URL: 'http://localhost:5000/',
    HOST_URL: 'https://still-citadel-11543.herokuapp.com/',
    PHOBIAS: [
        { 
            title: 'DogBlocker', // Only for testing
            description: 'Test',
            keywords: ['dog', 'dogs', 'puppy', 'labrador', 'retriever', 'kuvasz', 'pomeranian', 'beagle', 'collie', 'bernard',
             'spaniel', 'samoyed', 'hound', "setter", 'terrier', 'shepherd']
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