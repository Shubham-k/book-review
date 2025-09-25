const { uniqueNamesGenerator, NumberDictionary, adjectives, names, animals, colors } = require('unique-names-generator');

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
const usernameDictionaries = [adjectives, names, animals, colors];

const generateUniqueUsername = () => {
    const [dictionaryOne, dictionaryTwo] = shuffleArray(usernameDictionaries);
    return uniqueNamesGenerator({
        dictionaries: [
            dictionaryOne,
            dictionaryTwo,
            NumberDictionary.generate({ min: 100, max: 999999 }),
        ], // colors can be omitted here as not used
        length: 3,
        style: 'lowerCase',
        separator: '_',
    });
};

module.exports = { generateUniqueUsername };