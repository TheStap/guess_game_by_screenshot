interface Config {
    apiKey: string,
    baseURL: string,
    earliestReleaseYearInBase: number
}

const config: Config = {
    apiKey: '',
    baseURL: 'https://api.rawg.io/api/',
    earliestReleaseYearInBase: 1971
}
export default config;