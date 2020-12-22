interface Config {
    apiKey: string,
    baseURL: string,
    earliestReleaseYearInBase: number,
    maxPageSize: number,
    maxAnswers: number,
    maxGamesToAnswer: number
}

const config: Config = {
    apiKey: '',
    baseURL: 'https://api.rawg.io/api/',
    earliestReleaseYearInBase: 1971,
    maxPageSize: 40,
    maxAnswers: 6,
    maxGamesToAnswer: 12
}
export default config;