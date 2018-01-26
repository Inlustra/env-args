import * as minimist from 'minimist'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import { constant } from 'change-case'

export type Logger = (str: string) => any
export type Args = string[]
export type EnvKeyTransform = (str: string) => string
export interface Options {
  arguments?: string[]
  envPrefix?: string
  throwUndefined?: boolean
  logConfiguration?: boolean
  log?: any
  dotEnvEncoding?: 'utf8' | 'base64'
  dotEnvPath?: string
  envKeyTransform?: (string: string) => string
}

export class EnvironmentNotSetError extends Error {
  constructor() {
    super('Missing environment configuration')
    Error.captureStackTrace(this, EnvironmentNotSetError)
  }
}

const packageName = process.env.npm_package_name

function getEnv(key: string, envKeyTransform: EnvKeyTransform): any {
  let val = process.env[envKeyTransform(key)]
  try {
    val = JSON.parse(val)
  } catch (ignore) {
    if (val === 'undefined') {
      val = void 0
    }
  }
  return val
}

function checkUndefined(
  obj: any,
  envKeyTransform: EnvKeyTransform,
  log: Logger
) {
  const errors = Object.keys(obj)
    .filter(key => obj[key] === undefined)
    .reduce(
      (acc, key) =>
        `Argument ${chalk.red(`--${key}`)} or environment variable ${chalk.red(
          envKeyTransform(key)
        )}\n${acc}`,
      ''
    )
  if (errors) {
    log(
      chalk.bold(`------------ Environment configuration not set ------------`)
    )
    log(
      chalk.bold(
        `Remember, you can override these by placing a .env file in your package.`
      )
    )
    log(errors)
    throw new EnvironmentNotSetError()
  }
}

function logObject(obj: any, log: Logger) {
  log(chalk.bold(`------------ Start Environment Configuration ------------`))
  Object.keys(obj)
    .map(key => `    ${key}: ${chalk.green(obj[key])}`)
    .forEach(val => log(val))
  log(chalk.bold(`------------ End Environment Configuration --------------`))
}

function firstValue(...arg: any[]) {
  return arg.find(x => x !== undefined)
}

function loadConfig<T>(obj: T, args: Args, envKeyTransform: EnvKeyTransform) {
  const passedArguments = minimist(args)
  return Object.keys(obj).reduce((acc, key) => {
    let argumentValue = passedArguments[key]
    let environmentValue = getEnv(key, envKeyTransform)
    let defaultValue = obj[key]
    return {
      ...acc,
      [key]: firstValue(argumentValue, environmentValue, defaultValue)
    }
  }, {}) as T
}

export function load<T extends object>(obj: T, configOptions: Options = {}): T {
  let options: Options = {
    dotEnvEncoding: undefined,
    dotEnvPath: undefined,
    arguments: process.argv.slice(2),
    envPrefix: null,
    throwUndefined: true,
    logConfiguration: true,
    log: console.log,
    envKeyTransform: (key: string) =>
      options.envPrefix
        ? constant(`${options.envPrefix}_${key}`)
        : packageName ? `${constant(packageName + '_' + key)}` : constant(key),
    ...configOptions
  }
  const dotEnv = dotenv.config({
    path: options.dotEnvPath,
    encoding: options.dotEnvEncoding
  })
  const config = loadConfig(obj, options.arguments, options.envKeyTransform)
  if (options.throwUndefined) {
    checkUndefined(config, options.envKeyTransform, options.log)
  }
  if (options.logConfiguration) {
    logObject(config, options.log)
  }
  return config
}
