CONFIG = {
    CONSOLE_LOGGING: true,
    SENSITIVITY_FOR_IMAGE: 2,
    SENSITIVITY_FOR_TEXT: 2,
    LOCAL_URL: 'http://localhost:5000/', // For testing purposes only
    AWS_URL: 'http://phobia.us-east-2.elasticbeanstalk.com/',
    PHOBIAS: [
        { 
            title: 'Arachnophobia',
            description: 'Spiders',
            keywords: ['spider', 'arachnid', 'tarantula',
             'scorpion']
        },
        {
            title: 'Insectophobia',
            description: 'Insects',
            keywords: ['insect', 'spider', 'bug', 'pest',
             'beetle', 'anthropod', 'fly', 'bee', 'worm',
             'caterpillar', 'ant', 'aphid', 'butterfly',
             'cockroach', 'dragonfly', 'flea', 'ixodes',
             'grasshopper', 'ladybug', 'mite', 'mosquito',
             'moth', 'termite', 'centipede', 'acarine']
        },
        {
            title: 'Ophidiophobia',
            description: 'Snakes',
            keywords: ['snake', 'ophidian', 'serpent',
             'constrictor', 'python', 'cobra',
             'rattlesnake', 'viper', 'mamba', 'krait']
        },
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
        }
    ]
}

// TODO: add more filters and languages