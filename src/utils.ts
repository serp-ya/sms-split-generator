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
  export const mapChunksWithSuffix = (chunks: string[], delimeter: string): string[] => (
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
  export const joinWordsToChunks = (
    words: string[],
    delimeter: string,
    chunkMaxLength: number,
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
  export const optimizeChunksLength = (
    chunks: string[],
    delimeter: string,
    chunkMaxLength: number,
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