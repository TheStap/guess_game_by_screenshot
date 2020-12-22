interface Config {
    apiKey: string,
    baseURL: string,
    earliestReleaseYearInBase: number
}

const config: Config = {
    apiKey: '449d19a3e64645cba21e2cacff174812',
    baseURL: 'https://api.rawg.io/api/',
    earliestReleaseYearInBase: 1971
}
export default config;