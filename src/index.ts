const DELIMETER = ' ';
const MESSAGE_LENGTH = 140;

/**
 * Функция createSuffix создаёт суфикс вида 1/10 
 * 
 * @param currentNumber - число в левой части суфикса
 * @param lastNumber - число в правой части суфикса
 * @returns - строку вида '1/10'
 */
const createSuffix = (
  currentNumber: number,
  lastNumber: number,
): string => `${currentNumber}/${lastNumber}`;

/**
 * Функция mapChunksWithSuffix проставляет суфиксы переданным чанкам
 * 
 * @param chunks - чанки - список строк 
 * @param delimeter - разделитель
 * @returns - список чанков с суфиксами
 */
const mapChunksWithSuffix = (chunks: string[], delimeter: string = DELIMETER): string[] => (
  chunks.map((chunk: string, i: number, arr: string[]): string => (
    [chunk, createSuffix(i + 1, arr.length)].join()
  ))
);

/**
 * Функция joinWordsToChunks объединяет переданные слова в чанки (строки) определенной длины
 * 
 * @param words - список слов
 * @param delimeter - разелитель
 * @param chunkMaxLength - максимальная длина одного чанка
 * @returns - список чанков, состоящий из переданных слов (строки определенной длины)
 */
const joinWordsToChunks = (
  words: string[],
  delimeter: string = DELIMETER,
  chunkMaxLength: number = MESSAGE_LENGTH,
): string[] => words.reduce((acc: string[], word: string, i: number) => {
  const lastChunkIndex = acc.length - 1;
  const lastChunk: string | undefined = acc[lastChunkIndex];
  if (!lastChunk) {
    return [word];
  }

  const newChunk: string = [lastChunk, word].join(delimeter);

  if (newChunk.length < chunkMaxLength) {
    acc[lastChunkIndex] = newChunk;
  } else {
    acc.push(word);
  }
  return acc;
}, []);

/**
 * Функция optimizeChunksLength оптимизирует длину чанков и подготавливает их
 * под добавление суфикса без нарушения ограничения по длине
 * 
 * @param chunks - список чанков
 * @param delimeter - разделитель
 * @param chunkMaxLength - максимальная длина чанка
 * @returns - список чанков с проставленными суфиксами
 */
const optimizeChunksLength = (
  chunks: string[],
  delimeter: string = DELIMETER,
  chunkMaxLength: number = MESSAGE_LENGTH,
): string[] => chunks.reduce((
  acc: string[],
  chunk: string,
  i: number,
  arr: string[],
) => {
  const suffix: string = createSuffix(i + 1, arr.length);
  const chunkWithSuffix: string = [chunk, suffix].join(delimeter);


  if (chunkWithSuffix.length > chunkMaxLength) {
    const currentChunkAllWords: string[] = chunk.split(delimeter);
    const currentChunkWithoutLastWord: string[] = (
      currentChunkAllWords.slice(0, currentChunkAllWords.length - 1)
    );
    const currentChunkLastWord: string[] = currentChunkAllWords.slice(-1);
    const nextChunk = arr[i + 1] || '';

    acc.push(currentChunkWithoutLastWord.join(delimeter));
    arr[i + 1] = [currentChunkLastWord, nextChunk].join(delimeter);

  } else {
    acc.push(chunk);
  }
  
  return acc;

}, []);

type TConvertTextToSms = (
  text: string,
  delimeter?: string,
  messageMaxLenght?: number,
) => string[];

/**
 * Функция convertTextToSMS конвертирует входящий текст в формат СМС сообщений, ограниченных по длине.
 * В случае необходимости разбить сообщение на несколько смс, проставляет суфиксы.
 * 
 * @param text - входящий текст
 * @param delimeter - разделитель
 * @param messageMaxLenght - максимальная длина 1 смс
 * @returns - список СМС с проставленными суфиксами, если СМС > 1
 */
export const convertTextToSMS: TConvertTextToSms = (
  text: string,
  delimeter: string = DELIMETER,
  messageMaxLenght: number = MESSAGE_LENGTH,
): string[] => {
  if (text.length <= messageMaxLenght) {
    return [text];
  }

  const words: string[] = text.split(delimeter);
  const chunks: string[] = joinWordsToChunks(words, delimeter, messageMaxLenght);
  const chunksWithOptimizedLength = optimizeChunksLength(chunks, delimeter, messageMaxLenght);
  const chunksWithSuffixes = mapChunksWithSuffix(chunksWithOptimizedLength, delimeter);

  return chunksWithSuffixes;
};

/*
* То, что я написал ниже, просто тут ради того, что пример выше может показаться кому-то черезмерно избыточным на количество переменных
* внутри композиции, поэтому я решу ту же задачу теми же инструментами, но в более компактном виде.
*/

/**
 * Функция fp принимает значения, которые по очереди нужно передать в фунцкии-обработчики
 * и возвращает функцию, которая принимает эти фунцкии-обработчики.
 * 
 * @param data - значения для обработки
 * @returns - функцию, принимающую функции-обработчики и возвращающую результат поочерёдной обработки входящих значений
 */
const fp = <D, R>(data: D) => (
  ...funcs: Function[]
): R => (
  funcs.reduce(
    (acc: any, func) => func(acc),
    data,
  )
);

/**
 * Функция joinWordsToChunksFP каррирует конфигурационные аргументы функции joinWordsToChunks
 * и создаёт на основе неё обработчик для дальнейшего применения к проивзольным значениям
 * 
 * @param delimeter - разделитель
 * @param chunkMaxLength - максимальная длина чанка
 * @returns - функцию, принимающую список значений и передающий их функции joinWordsToChunks
 */
const joinWordsToChunksFP = (
  delimeter: string,
  chunkMaxLength: number,
) => (words: string[]): string[] => joinWordsToChunks(words, delimeter, chunkMaxLength);

/**
 * Функция optimizeChunksLengthFP каррирует конфигурационные аргументы функции optimizeChunksLength
 * 
 * @param delimeter - разделитель
 * @param chunkMaxLength - максимальная длина чанка
 * @returns - функцию, принимающую список значений и передающий их функции optimizeChunksLength
 */
const optimizeChunksLengthFP = (
  delimeter: string,
  chunkMaxLength: number,
) => (chunks: string[]) => optimizeChunksLength(chunks, delimeter, chunkMaxLength);

/**
 * Функция mapChunksWithSuffixFP каррирует конфигурационные аргументы функции mapChunksWithSuffix
 * 
 * @param delimeter - разделитель
 * @returns - функцию, принимающую список значений и передающий их функции mapChunksWithSuffix
 */
const mapChunksWithSuffixFP = (delimeter: string) => (chunks: string[]) => mapChunksWithSuffix(chunks, delimeter);


/**
 * Функция convertTextToSMSViaFP конвертирует входящий текст в формат СМС сообщений, ограниченных по длине.
 * В случае необходимости разбить сообщение на несколько смс, проставляет суфиксы.
 * 
 * @param text - входящий текст
 * @param delimeter - разделитель
 * @param messageMaxLenght - максимальная длина 1 смс
 * @returns - список СМС с проставленными суфиксами, если СМС > 1
 */
export const convertTextToSMSViaFP: TConvertTextToSms = (
  text: string,
  delimeter: string = DELIMETER,
  messageMaxLenght: number = MESSAGE_LENGTH,
): string[] => {
  if (text.length <= messageMaxLenght) {
    return [text];
  }

  const words: string[] = text.split(delimeter);

  return fp<string[], string[]>(words)(
    joinWordsToChunksFP(delimeter, messageMaxLenght),
    optimizeChunksLengthFP(delimeter, messageMaxLenght),
    mapChunksWithSuffixFP(delimeter),
  );
};

const testData1 = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
const testData2 = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sit amet posuere risus';

console.log('testData1', convertTextToSMS(testData1));
console.log('testData2', convertTextToSMS(testData2));

console.log('testData1 FP', convertTextToSMSViaFP(testData1));
console.log('testData2 FP', convertTextToSMSViaFP(testData2));